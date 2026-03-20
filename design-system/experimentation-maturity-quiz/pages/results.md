# Results Page — Design Overrides

> Inherits from MASTER.md. Only deviations are listed here.

---

## Layout

The results page is the only **scrollable** page. All others fit in the viewport.

```
Shell: white bg, Kyzn logo header
Main: max-w-4xl mx-auto px-6 py-12 space-y-16
  Section 1: Score hero
  Section 2: Category breakdown (2x2 grid)
  Section 3: Radar chart
  Section 4: Recommendations
  Section 5: What's Next CTA
Footer: border-t border-gray-100, copyright
```

## Score Hero Section

- Centered layout
- `AnimatedScore` component: large animated percentage
- Persona title: RecklessCondensed, `text-4xl sm:text-5xl`, color `#7a00df`
- Persona description: `text-base text-gray-500 font-light max-w-xl mx-auto text-center`
- Next step text + hyperlink: `text-sm text-gray-500`, link `text-[#7a00df] underline underline-offset-4`
- No gradient background behind this section — white card with `border border-gray-100 rounded-2xl`

## Section Headings

- RecklessCondensed, weight 400
- `text-3xl sm:text-4xl text-gray-900`
- Centred with a one-line description below in `text-sm text-gray-500 font-light`

## Category Score Cards

Each card shows:
- Category name (uppercase pill, purple tint)
- Score percentage (large, colour-coded)
- Horizontal progress bar (colour-coded: red/amber/green)
- One-line description

Card style: `rounded-xl border border-gray-100 bg-white p-5`

Score colour rules:
- `<40%` → `#ef4444` (red-500)
- `40–69%` → `#f59e0b` (amber-500)
- `≥70%` → `#22c55e` (green-500)

## Radar Chart

- Existing `RadarChart` component
- Max width `max-w-lg mx-auto`
- Wrapped in a white card with border

## Recommendations

- 2-column grid on desktop, 1-column on mobile
- Cards: `rounded-xl border border-gray-100 bg-white p-5`
- Card heading: RecklessCondensed, `text-xl`
- Card body: `text-sm text-gray-500 font-light leading-relaxed`
- Icon: inline SVG, `color: #7a00df`

## CTA Section

Single centred block:
- Heading: RecklessCondensed, `text-3xl text-gray-900`
- Description: `text-sm text-gray-500 font-light`
- Button: purple gradient, rounded-full, "Book a Call" with calendar icon

---

## Removed from previous version

- ❌ `ThemeToggle` component
- ❌ `dark:` classes everywhere
- ❌ `from-primary-50/30` gradient backgrounds
- ❌ `font-bold` on section headings
- ❌ `ThemeToggle` absolutely positioned top-4 right-4
