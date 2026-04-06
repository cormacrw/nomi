<script setup>
import { appPath } from '~/utils/appBase'

definePageMeta({
  layout: 'marketing',
})

const isDev = import.meta.dev

useHead({
  title: 'Nomi — private social for people you know',
  meta: [
    {
      name: 'description',
      content: 'A small, trusted social layer for people who already know each other in real life. Verified identity, find friends by phone number, no public directory. Sign in with email to get started on the web.',
    },
  ],
})

const differentiation = [
  {
    incumbent: 'Open discovery, trending, suggested users',
    nomi: 'Discovery by phone number first; no public people directory at launch',
  },
  {
    incumbent: 'Follower/following counts as status',
    nomi: 'A graph around mutual acquaintance, not audience size',
  },
  {
    incumbent: 'Pseudonymous or optional identity',
    nomi: 'Verified phone required for a real account (product direction)',
  },
  {
    incumbent: 'Engagement-optimized feeds',
    nomi: 'Feed among friends — not growth hacking by default',
  },
]

const whoItsFor = [
  'People who want a private social space without building a public handle.',
  'Groups who already coordinate in real life and want a shared feed without random adds.',
  'Anyone for whom a phone number is a reasonable signal of real-world acquaintance.',
]

const howItWorks = [
  {
    title: 'Verify who you are',
    body: 'Every account is anchored to a verified phone number so identity is grounded in something harder to mass-fake than email or username alone (see product vision). On the web today, you sign in with email first.',
  },
  {
    title: 'Find people by number',
    body: 'You discover others by phone number — exact match, normalized format — not by browsing a public directory of strangers.',
  },
  {
    title: 'Keep the circle mutual',
    body: 'Friend requests and a small, intentional graph — not follower counts or broadcast reach.',
  },
  {
    title: 'Share with friends',
    body: 'Posts with photos and a caption; reactions visible only to the author — poster-only visibility for reactions.',
  },
]

const principles = [
  'Trust over reach',
  'Explicit over implicit',
  'Privacy by structure',
  'Honest identity',
]

const nonGoals = [
  'Open discovery by interest, location, or trending topics.',
  'Anonymous or pseudonymous-first identity.',
  'Creator monetization or algorithmic “For You” feeds tuned for viral scale.',
]
</script>

<template>
  <div>
    <section
      class="relative overflow-hidden bg-gradient-to-br from-nomi-emerald via-nomi-deep to-[#004d34] px-5 pb-16 pt-[max(2.5rem,env(safe-area-inset-top))] text-nomi-mint md:pb-24 md:pt-16"
      aria-labelledby="hero-heading"
    >
      <div class="mx-auto max-w-3xl text-center">
        <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
          Nomi
          <span class="font-medium normal-case tracking-normal text-white/60">(know-me)</span>
        </p>
        <h1
          id="hero-heading"
          class="font-headline text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-white"
        >
          A small, trusted social layer for people who already know each other in real life.
        </h1>
        <p class="mx-auto mt-6 max-w-xl text-[clamp(1.0625rem,2.8vw,1.25rem)] font-medium leading-relaxed text-nomi-mint/90">
          Discovered and connected through verified phone numbers — not open networks or algorithms. Calm, intentional, friend-first.
        </p>
        <div class="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
          <NuxtLink
            to="/app"
            class="inline-flex min-h-[3.5rem] items-center justify-center rounded-full bg-white px-8 font-headline text-base font-black tracking-tight text-nomi-ink shadow-lg shadow-black/15 transition hover:brightness-[1.03] sm:min-h-[3.75rem]"
          >
            Get started
          </NuxtLink>
        </div>
        <p class="mx-auto mt-4 max-w-lg text-sm font-medium text-nomi-mint/75">
          Sign in with email on the web to begin; phone verification is the product direction for core identity.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-5 py-14 md:py-20" aria-labelledby="problem-heading">
      <h2 id="problem-heading" class="font-headline text-2xl font-extrabold tracking-tight text-nomi-ink md:text-3xl">
        Why Nomi exists
      </h2>
      <p class="mt-4 text-lg leading-relaxed text-nomi-ink/85">
        Mainstream social products optimize for growth: public profiles, open discovery, and feeds tuned for engagement. Many people still want to share life updates with a
        <strong class="font-bold text-nomi-ink">defined circle they could name offline</strong>
        — without performing for an algorithm or a global audience.
      </p>
    </section>

    <section
      class="border-y border-nomi-ink/10 bg-white/60 px-5 py-14 md:py-20"
      aria-labelledby="who-heading"
    >
      <div class="mx-auto max-w-3xl">
        <h2 id="who-heading" class="font-headline text-2xl font-extrabold tracking-tight text-nomi-ink md:text-3xl">
          Who it’s for
        </h2>
        <ul class="mt-8 space-y-4 text-lg leading-relaxed text-nomi-ink/85">
          <li
            v-for="(line, i) in whoItsFor"
            :key="i"
            class="flex gap-3"
          >
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nomi-emerald" aria-hidden="true" />
            <span>{{ line }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-5 py-14 md:py-20" aria-labelledby="how-heading">
      <h2 id="how-heading" class="font-headline text-2xl font-extrabold tracking-tight text-nomi-ink md:text-3xl">
        How it works
      </h2>
      <ol class="mt-10 space-y-10">
        <li
          v-for="(step, i) in howItWorks"
          :key="step.title"
          class="flex gap-4"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nomi-emerald font-headline text-sm font-black text-white"
            aria-hidden="true"
          >{{ i + 1 }}</span>
          <div>
            <h3 class="font-headline text-lg font-bold text-nomi-ink">
              {{ step.title }}
            </h3>
            <p class="mt-2 leading-relaxed text-nomi-ink/80">
              {{ step.body }}
            </p>
          </div>
        </li>
      </ol>
    </section>

    <section
      class="border-y border-nomi-ink/10 bg-white/60 px-5 py-14 md:py-20"
      aria-labelledby="diff-heading"
    >
      <div class="mx-auto max-w-4xl overflow-x-auto">
        <h2 id="diff-heading" class="font-headline text-2xl font-extrabold tracking-tight text-nomi-ink md:text-3xl">
          A different direction
        </h2>
        <table class="mt-10 w-full min-w-[min(100%,36rem)] border-collapse text-left text-sm md:text-base">
          <thead>
            <tr class="border-b border-nomi-ink/15">
              <th scope="col" class="py-3 pr-4 font-bold text-nomi-ink/70">
                Common pattern
              </th>
              <th scope="col" class="py-3 font-bold text-nomi-emerald">
                Nomi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in differentiation"
              :key="row.incumbent"
              class="border-b border-nomi-ink/10"
            >
              <td class="py-4 pr-4 align-top text-nomi-ink/75">
                {{ row.incumbent }}
              </td>
              <td class="py-4 align-top font-medium text-nomi-ink">
                {{ row.nomi }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-5 py-14 md:py-20" aria-labelledby="principles-heading">
      <h2 id="principles-heading" class="font-headline text-2xl font-extrabold tracking-tight text-nomi-ink md:text-3xl">
        Principles
      </h2>
      <ul class="mt-8 flex flex-wrap gap-2">
        <li
          v-for="p in principles"
          :key="p"
          class="rounded-full border border-nomi-emerald/25 bg-nomi-emerald/10 px-4 py-2 text-sm font-semibold text-nomi-ink"
        >
          {{ p }}
        </li>
      </ul>

      <h3 class="mt-12 font-headline text-lg font-bold text-nomi-ink">
        Non-goals (initial)
      </h3>
      <ul class="mt-4 space-y-2 text-nomi-ink/75">
        <li
          v-for="ng in nonGoals"
          :key="ng"
          class="flex gap-2"
        >
          <span class="text-nomi-ink/40" aria-hidden="true">—</span>
          <span>{{ ng }}</span>
        </li>
      </ul>
    </section>

    <section
      class="bg-gradient-to-br from-nomi-emerald via-nomi-deep to-[#004d34] px-5 py-16 text-center text-nomi-mint md:py-20"
      aria-labelledby="cta-heading"
    >
      <div class="mx-auto max-w-xl">
        <h2 id="cta-heading" class="font-headline text-2xl font-extrabold text-white md:text-3xl">
          Ready for a smaller circle?
        </h2>
        <p class="mt-4 text-nomi-mint/85">
          Direct, plain language. No hype — just people you actually know.
        </p>
        <NuxtLink
          to="/app"
          class="mt-8 inline-flex min-h-[3.5rem] min-w-[12rem] items-center justify-center rounded-full bg-white px-8 font-headline text-base font-black tracking-tight text-nomi-ink shadow-lg shadow-black/15 transition hover:brightness-[1.03]"
        >
          Get started
        </NuxtLink>
      </div>
    </section>

    <footer class="border-t border-nomi-ink/10 px-5 py-12 text-center">
      <div class="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <div class="flex flex-wrap justify-center gap-6 text-sm font-semibold uppercase tracking-[0.14em] text-nomi-ink/55">
          <a class="transition hover:text-nomi-ink" href="#">Terms</a>
          <a class="transition hover:text-nomi-ink" href="#">Privacy</a>
          <a
            class="transition hover:text-nomi-ink"
            href="https://github.com/cormacrw/nomi"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <p class="flex items-center gap-2 text-xs uppercase tracking-wide text-nomi-ink/45">
          <span class="material-symbols-outlined text-base text-nomi-emerald/80" aria-hidden="true">verified_user</span>
          Identity verified platform
        </p>
        <NuxtLink
          v-if="isDev"
          :to="appPath('/dev/login')"
          class="text-sm font-semibold text-nomi-emerald underline-offset-2 hover:underline"
        >
          Dev: sign in with password
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>
