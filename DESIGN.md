# DESIGN.md — DUALCORE COCKPIT

## 1. Design Philosophy

Create a premium, minimal, highly readable product experience inspired by Apple's design principles.

The product is DUALCORE COCKPIT, an intelligent productivity OS for students preparing for high-stakes examinations.

The interface should feel:
- Calm, focused, and distraction-free.
- Minimal, precise, and thoughtfully crafted.
- Premium without being flashy.
- Functional before decorative.
- Friendly and approachable without looking childish.
- Consistent across desktop, tablet, and mobile.

### Core principles
- Clarity over decoration.
- Content over chrome.
- Whitespace over visual clutter.
- Consistency over novelty.
- Subtle feedback over excessive animation.
- Real usability over visual gimmicks.

Use Apple-inspired restraint as a design reference. Do not copy Apple's website, proprietary assets, logos, or exact layouts.

---

## 2. Color System

Use a restrained neutral palette with one carefully controlled accent color.

### Light theme
- Background: `#FFFFFF`
- Secondary background: `#F5F5F7`
- Elevated surface: `#FFFFFF`
- Primary text: `#1D1D1F`
- Secondary text: `#6E6E73`
- Tertiary text: `#86868B`
- Border: `#D2D2D7`
- Subtle divider: `#E8E8ED`
- Primary accent: `#0071E3`
- Accent hover: `#0077ED`
- Accent subtle background: `#EAF3FF`
- Success: `#248A3D`
- Warning: `#9A6700`
- Error: `#D70015`

### Dark theme
If the application already supports dark mode, preserve it and apply the following tokens:
- Background: `#000000`
- Secondary background: `#161617`
- Elevated surface: `#1C1C1E`
- Primary text: `#F5F5F7`
- Secondary text: `#A1A1A6`
- Border: `#38383A`
- Primary accent: `#2997FF`

### Color rules
- Use neutral colors for at least 90% of the interface.
- Use blue only for primary actions, links, focus states, and meaningful emphasis.
- Use semantic colors exclusively for meaningful status information.
- Never use rainbow gradients, neon colors, or arbitrary accent colors.
- Never communicate status through color alone; include text or an icon.
- Avoid large saturated color blocks unless they are essential to the existing product.

---

## 3. Typography

Prioritize readability, clear hierarchy, and natural Korean typography.

### Font stack
`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Pretendard", "Noto Sans KR", sans-serif`

### Type scale
- Hero headline: 48–64px, weight 600, line-height 1.08–1.15
- Page title: 32–40px, weight 600, line-height 1.2
- Section title: 24–28px, weight 600, line-height 1.3
- Card title: 17–20px, weight 600, line-height 1.4
- Body: 15–17px, weight 400, line-height 1.6–1.75
- Secondary body: 14px, weight 400, line-height 1.6
- Caption and metadata: 12–13px, line-height 1.5

### Typography rules
- Use no more than three font weights in a single view.
- Maintain clear differences between headings, body text, and metadata.
- Avoid excessively bold body text and oversized section headings.
- Avoid long passages in uppercase or tightly spaced text.
- Use Korean-friendly line breaks and comfortable paragraph widths.
- Keep body text readable on smaller screens.
- Use tabular numerals for timers, statistics, and numerical dashboards when useful.

---

## 4. Spacing System

Use a consistent 4px-based spacing scale.
- 4px: icon-to-label spacing
- 8px: compact internal spacing
- 12px: related controls
- 16px: standard component spacing
- 24px: card padding and content groups
- 32px: section subgroups
- 48px: section spacing
- 64px: major content sections

### Layout rules
- Main content max-width: 1200px.
- Reading content max-width: 720px.
- Desktop page gutters: 32–48px.
- Tablet page gutters: 24px.
- Mobile page gutters: 20px.
- Use a consistent alignment grid throughout the application.

---

## 5. Surfaces, Cards, and Borders

Use flat surfaces and subtle separation rather than excessive containers.
- Default card radius: 12–16px.
- Large panels: 16–20px.
- Buttons and inputs: 10–12px.
- Small chips: 6–8px or fully rounded when appropriate.
- Border: `1px solid #D2D2D7` (Light) / `1px solid #38383A` (Dark).
- Shadows: minimal, soft, and used only to establish elevation.

---

## 6. Buttons and Form Controls

### Primary button
- Background: primary accent (`#0071E3` / `#2997FF`).
- Text: white.
- Font weight: 500–600.
- Height: approximately 44–48px.
- Horizontal padding: 16–20px.
- Radius: 10–12px.

### Secondary button
- Neutral background or transparent background.
- Primary text color.
- Subtle border when needed.

---

## 7. Navigation and Information Architecture
- Make the current location and primary navigation immediately understandable.
- Keep navigation labels concise and familiar.
- Preserve existing routes, links, and navigation behavior.
- Keep headers visually quiet so the main content remains dominant.

---

## 8. Dashboard and Productivity Components
- Make the most important current task or metric the primary visual focus.
- Group related statistics and controls logically.
- Make timers and changing values easy to scan.
- Preserve the existing business logic, data relationships, and interaction patterns.

---

## 9. Icons and Visual Assets
- Prefer the icon library already installed in the project (`lucide-react`).
- Typical icon sizes: 16px, 20px, and 24px.
- Pair unfamiliar icons with clear labels.
- Avoid emoji as primary interface icons where clean vector icons work better.

---

## 10. Motion and Microinteractions
- Typical transition duration: 150–220ms.
- Prefer opacity and small positional changes.
- Respect `prefers-reduced-motion`.

---

## 11. Responsive Design
- Desktop: generous whitespace, clear content grid, max-width 1200px.
- Tablet: 24px gutters, adapted multi-column layouts without squeezing cards.
- Mobile: single-column layout, 20px gutters, no horizontal overflow, ~44x44px touch targets.

---

## 12. Accessibility
- WCAG AA contrast targets.
- Semantic HTML, visible focus indicators, keyboard navigation.

---

## 13. Implementation Constraints
- Preserve all existing functionality and business logic.
- Centralize repeated colors, spacing, radii, and typography in design tokens.
