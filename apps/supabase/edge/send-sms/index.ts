import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

type SendSmsPayload = {
  user: { phone: string }
  sms: { otp: string }
}

const jsonErr = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonErr(405, 'Method not allowed')
  }

  const rawSecret = Deno.env.get('SEND_SMS_HOOK_SECRET')
  if (!rawSecret) {
    console.error('send-sms: SEND_SMS_HOOK_SECRET is not set')
    return jsonErr(500, 'Server misconfigured')
  }

  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')
  if (!accountSid || !authToken || !messagingServiceSid) {
    console.error('send-sms: Twilio env vars missing')
    return jsonErr(500, 'Server misconfigured')
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)

  const whSecret = rawSecret.startsWith('v1,whsec_')
    ? rawSecret.replace(/^v1,whsec_/, '')
    : rawSecret.replace(/^whsec_/, '')

  let data: SendSmsPayload
  try {
    const wh = new Webhook(whSecret)
    data = wh.verify(payload, headers) as SendSmsPayload
  } catch (e) {
    console.error('send-sms: webhook verify failed', e)
    return jsonErr(401, 'Invalid webhook signature')
  }

  const to = data.user?.phone?.trim()
  const otp = data.sms?.otp?.trim()
  if (!to || !otp) {
    return jsonErr(400, 'Missing phone or otp')
  }

  const body = `Nomi: your verification code is ${otp}`

  const form = new URLSearchParams({
    To: to,
    MessagingServiceSid: messagingServiceSid,
    Body: body,
  })

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const basic = btoa(`${accountSid}:${authToken}`)

  const res = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  })

  const twilioJson = (await res.json()) as {
    status?: string
    code?: number
    message?: string
    more_info?: string
  }

  if (!res.ok) {
    console.error('send-sms: Twilio error', {
      status: res.status,
      code: twilioJson.code,
      message: twilioJson.message,
    })
    return new Response(
      JSON.stringify({
        error: {
          http_code: twilioJson.code ?? res.status,
          message: twilioJson.message ?? 'Twilio request failed',
        },
      }),
      {
        status: res.status >= 400 && res.status < 600 ? res.status : 502,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  const ok =
    twilioJson.status === 'queued' ||
    twilioJson.status === 'sent' ||
    twilioJson.status === 'accepted' ||
    twilioJson.status === 'sending'
  if (!ok) {
    console.error('send-sms: unexpected Twilio status', twilioJson.status)
    return jsonErr(502, 'SMS not accepted by provider')
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
