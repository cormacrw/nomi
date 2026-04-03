# Branding

Context for visual design, copy, and UI—including tools such as **Google Stitch** (MCP) or other generators. This doc is **directional**: lock final hex codes, font files, and logo assets when designs are approved.

**Product anchor**: [vision](vision.md).

**Name (working): Nomi** — use in UI copy, marketing drafts, and design prompts; finalize legal/trademark checks before launch.

**Screens**: Frame names and flows should align with [screens/inventory.md](screens/inventory.md) IDs (e.g. `AUTH-02`, `FEED-01`) when generating UI in Stitch or Figma.

---

## Brand essence

**Intimate, trustworthy, calm**—a social space that feels like a **small circle**, not a stadium. The brand should communicate **real relationships** and **privacy by design**, without feeling secretive, edgy, or corporate-surveillance cold.

**One sentence for designers**

> A warm, human product that respects attention: connecting people who already know each other, verified by phone—no performative scale, no endless discovery.

**Visual direction (locked preference)**

- **Green-first UI**: green is the hero color—surfaces, primary actions, and key chrome lean green (not a tiny accent on an otherwise neutral app). Prefer **bold, saturated greens** (high chroma), not washed-out sage or pastel as the primary—still keep contrast accessible for text and icons.
- **Bold green canvas (entire core app)** — **Do not** default the “main app” to a light parchment / off-white page while keeping green only for buttons. **Core screens** (shell, feed, friends, composer, profile roots, primary settings lists) use the **same full-bleed bold emerald treatment** as verification: immersive **#00875A / #006b47-class** green as the **default viewport background**, with **white / warm off-white typography** and **inverse pills** (cream/white fill, dark green text) for primary CTAs unless a specific exception is documented. Light neutrals belong on **small elevated pieces** (inputs, cards, sheets)—not as the app-wide skin. See [design decision 0001](../design/decisions/0001-bold-green-canvas-all-core-screens.md).
- **Big buttons**: large tap targets, generous padding, obvious primary actions.
- **Very simple interfaces**: few elements per screen, clear hierarchy, minimal decoration—see [Visual territory](#visual-territory) and [UI patterns](#ui-and-product-patterns-brand-adjacent).

---

## Personality


| Attribute              | What it means                                     | What it is not                                       |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| **Grounded**           | Feels real, everyday, relatable                   | Hyper-minimal “luxury tech” chill                    |
| **Warm**               | Approachable, friendly microcopy                  | Loud, meme-y, or childish                            |
| **Simple**             | Few controls, one obvious next step, roomy layout | Dense dashboards, tiny icons competing for attention |
| **Clear**              | Obvious next steps, no dark patterns              | Busy toolbars or growth hacks in the UI              |
| **Quiet confidence**   | Big actions without noisy visuals                 | Aggressive gradients, “viral” energy                 |
| **Private-by-default** | Safe, contained, intentional                      | Paranoid or fear-based messaging                     |


---

## Voice and tone

**Voice** (stable): direct, plain language, respectful. Short sentences. Second person (“you”) where it helps. Avoid hype adjectives (“revolutionary,” “ultimate”).

**Tone** (situational):

- **Onboarding / verification**: reassuring, procedural, never blame the user for SMS delays.
- **Friend requests**: neutral-warm; no gamification (“You’re crushing it!”).
- **Errors**: calm, specific, what to do next.
- **Empty states**: gentle invitation, not guilt (“No posts yet” not “Your feed is lonely”).

**Example microcopy directions**

- Prefer “People you know” over “Your squad” or “Your network.”
- Prefer “Add with phone number” over “Find your friends instantly!!!”
- Prefer “Verified” / “Confirmed” over “Secured with military-grade encryption” unless you truly implement and disclose that.

---

## Visual territory

Final tokens (exact hex/RGB) belong in a design system later; use this as a **mood brief**. **Green is the theme**, not an afterthought accent.

### Color

- **Primary palette**: **green-forward and bold**—prefer **saturated, confident greens** (e.g. emerald / leaf / forest depth), not pale or dusty mint as the main brand color. Use a **coherent scale** from bold primary down to softer tints for surfaces so hierarchy stays clear—see [What to avoid](#what-to-avoid-brand-risks) for “one flat green everywhere.”
- **Neutrals**: **Default page chrome is green**, not gray parchment—see **Bold green canvas** under [Visual direction](#brand-essence) above. Use **soft off-white / warm gray** only for **components on top of green** (e.g. text fields, cards, modal bodies) or **marketing surfaces outside the core app**, so hierarchy stays clear. Avoid rainbow accents; let green + restrained neutrals do the work.
- **Contrast**: bold green buttons and icons need **accessible text contrast** (usually white or near-white on the primary green; validate WCAG AA for text and icons). If using a mid green, use dark text—validate in design, not only in generator output.
- **Dark mode**: deep charcoal or green-tinted dark backgrounds with **clear, saturated green** for primary actions and focus rings; still **simple**—avoid neon lime unless intentional.
- **Semantic**: success / verified states align naturally with green—keep them **consistent** with the primary green system so the app does not introduce a second unrelated “success color.”
- **Caution**: destructive or warning states still need **non-green** signals (e.g. amber/red) so mistakes are obvious.

### Typography

- **UI**: highly legible, neutral sans (system fonts or a single workhorse family). Avoid display fonts for body.
- **Hierarchy**: clear size steps; **primary actions are big**—type on buttons can be slightly larger than body for readability at arm’s length.
- **Tone**: modern but simple; avoid ultra-condensed or novelty faces for core UI.

### Buttons and touch targets

- **Big buttons**: primary CTAs should feel **easy to hit**—generous min height (think comfortable thumb reach), full-width or near full-width on mobile where it makes sense.
- **Secondary actions**: still tappable at a real size—no “text link only” as the only path for critical flows unless intentional.
- **Spacing**: whitespace between actions so mis-taps are rare.

### Imagery and illustration

- Real moments, small groups, **faces optional**—respect that the product is private; marketing can use abstract metaphors (circles, proximity, handoffs) as much as literal photos.
- Avoid: stock “influencer at sunset,” crowds, global network diagrams implying millions of strangers.

### Iconography

- Simple, consistent stroke or filled set. Metaphors: **person + check**, **phone + shield (subtle)**, **small group**, not megaphone/trophy/flame unless used sparingly for non-growth contexts.

### Logo

- **Symbol only**: the **logo mark is an icon/symbol**—**do not** embed the word “Nomi” or any letterform inside the primary logo asset. The app name appears in **navigation, splash, and marketing** as separate typography next to the mark.
- **Color**: the mark should work in **bold green** on light backgrounds and as a **single-color** (often white or light) glyph on solid green or dark UI.
- **Lock**: final vector assets and trademark review live outside this doc when ready.

### Motion

- Subtle transitions; **no** aggressive bounce on every tap. Verification success: brief, clear feedback—no slot-machine celebration.

---

## UI and product patterns (brand-adjacent)

- **Simplicity first**: prefer **one primary action** per screen when possible; avoid competing equal-weight buttons unless the flow truly needs a fork.
- **Big buttons** for the main path (Continue, Send code, Add friend, Post)—see [Buttons and touch targets](#buttons-and-touch-targets).
- **No follower counts as hero metrics** in core surfaces (if shown at all, de-emphasize).
- **No infinite “suggested people”** carousels at launch—aligns with [discovery-and-graph](discovery-and-graph.md).
- **Verification flows** should look **secure but friendly**—progress, clear labels, **large inputs** for phone number (country + number), green primary actions.

---

## What to avoid (brand risks)

- **Tiny controls**: small buttons or cramped rows that fight the **big-button, simple** direction.
- **Too many greens**: if everything is the same saturated green, nothing stands out—use **steps** (surface / primary / pressed) from one coherent green scale.
- **Washed-out primary**: avoid using **only** pale sage/mint as the main brand green if the product direction is **bold green**—keep tints for secondary surfaces, not the hero.
- **Growth-hack visuals**: notification spam styling, red badges everywhere, streaks.
- **Pseudo-military security theater** unless product truly backs it up.
- **Performative “authenticity”** (overly cute copy that clashes with a sober verification step).
- **Generic “social app 2016”** aesthetic: unrelated loud gradients (unrelated to your green system), random isometric illustration packs unless intentionally chosen.

---

## Keywords for design prompts

Useful fragments for tools like Stitch (combine with layout goals):

`Nomi`, `Nomi app`, `bold green`, `full-bleed emerald background`, `same green canvas as auth`, `saturated green`, `emerald green UI`, `green-themed UI`, `green primary color`, `no light parchment default`, `generous whitespace`, `large primary buttons`, `full-width CTA`, `simple layout`, `minimal UI chrome`, `one action per screen`, `warm minimal`, `small circle`, `private social`, `calm`, `friend-first`, `verified identity`, `readable sans-serif`, `no gamification`, `no viral energy`, `accessible contrast on green buttons`, `white text on green`

---

## Design tool context (copy-paste)

Use this block as **background context** when generating screens or design systems:

```
Product name: Nomi (working). Social app for people who only connect with others they already know in real life.
Identity: Verified phone number required; users find each other by phone number, not a public directory.
Brand: Warm, calm, trustworthy—intimate small-circle social, not influencer scale. Visual: SUPER GREEN themed UI — **full-bleed bold emerald (#00875A / #006b47-class) as the default canvas for core app screens**, same as auth; white/cream type on green; primary CTAs often inverse pills (white/cream fill, dark green text). Do NOT default to a light parchment or gray “app shell” with green only on buttons. Use soft off-white/warm gray only for elevated components (inputs, cards, sheets) on top of green. Big buttons, large tap targets, very simple screens. Ensure accessible text contrast. Legible sans-serif, subtle motion. Voice: direct, plain language, reassuring in verification flows. Avoid: tiny controls, cluttered layouts, gamification chrome, unrelated rainbow accents, follower-chasing UI.
```

---

## Logo prompt (image models)

Use when generating **logo marks** (not UI). Rules: **symbol only—no product name or letters in the logo**; **bold green** brand color; see [Logo](#logo).

```
Design an app icon / symbol-only logo (no text, no letters, no wordmark) for a product codenamed Nomi — a private social app where people only connect with friends they actually know in real life, with identity anchored on verified phone numbers. No public stranger discovery; calm, trustworthy, small-circle energy — not viral or influencer scale.

Brand: intimate, grounded, warm, simple, quiet confidence.

Visual: use a bold, saturated green as the primary brand color (emerald / forest / strong leaf — confident chroma, not pale sage or pastel). The mark must work as a single simple icon at small sizes (push notification, home screen). Optional second treatment: white or light glyph on solid bold green.

Style: minimal, modern, flat or nearly flat vector look. Metaphors that fit: small circle, gentle connection, trust — abstract or geometric. Optional subtle nod to verification or closeness without looking corporate-banking or military.

Strict constraints:
- Do not include the name "Nomi" or any typography in the logo.
- No wordmark, no initials, no lettermarks.
- No globes, no “millions of nodes” network diagrams, no megaphone/trophy/flame.
- Deliver on neutral background; one variant on bold green field if applicable.
```

---

## When this doc changes

Update when: **name/logo lock** (Nomi is working until then), final palette, illustration style, or partnership requires a visible brand shift. Reference the date in commit messages; consider a short “Changelog” subsection here if needed.