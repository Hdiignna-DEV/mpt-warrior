# 🎯 AI Mentor Responsive System - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI MENTOR RESPONSIVE SYSTEM                  │
└─────────────────────────────────────────────────────────────────┘

                      ResponsiveAIMentorLayout
                              │
                    ┌─────────┴─────────┐
                    │                   │
              (Detect screen size)     
                    │                   │
            ┌───────┴────────┐         │
            │                │         │
         MOBILE            DESKTOP   
        (<768px)          (≥768px)    
            │                │
            ├─────────┬──────┤
            │         │      │
    ┌───────▼──┐  ┌───▼─────┴─────┐
    │ Floating │  │ Sidebar Layout │
    │  Bubble  │  │                │
    │ (Mobile) │  ├────────────────┤
    └──────────┘  │ AIMentorSidebar│ (Right)
                  │ AIMentorSide   │ (Left)
                  │ barLeft        │
                  └────────────────┘

           ┌────────────┬────────────┐
           │            │            │
      ┌────▼──┐    ┌────▼──┐   ┌────▼──┐
      │ Idle  │    │ Hover │   │Active │
      │ 25%   │    │ 100%  │   │ 100%  │
      └───────┘    └───────┘   └───────┘
```

---

## Component Hierarchy

```
App
├── ResponsiveAIMentorLayout
│   ├── [Mobile] FloatingAIMentorBubble
│   │   ├── Avatar Button (80x80px)
│   │   │   └── Image (commander-arka-{pose}.png)
│   │   └── Expanded Modal (on click)
│   │       └── Speech Bubble with Message
│   │
│   └── [Desktop] AIMentorSidebar OR AIMentorSidebarLeft
│       ├── Sidebar Container (20% width)
│       ├── Mascot Image
│       │   └── Image (commander-arka-{pose}.png)
│       └── Status Indicator + Optional Actions
│
└── MainContent
    └── [Your Page Content]
```

---

## State Management Flow

```
                    ┌──────────────┐
                    │ User Interact│
                    │ (Resize, etc)│
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Check Screen │
                    │   Size       │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   < 768px           768px - 1024px      > 1024px
        │                  │                  │
     MOBILE            TABLET               DESKTOP
        │                  │                  │
   ┌────▼────┐        ┌────▼────┐       ┌────▼────┐
   │Floating │        │Sidebar  │       │Sidebar  │
   │ Bubble  │        │(20%)    │       │(20%)    │
   │Opacity: │        │Opacity: │       │Opacity: │
   │25%→100% │        │25%→100% │       │25%→100% │
   │         │        │         │       │         │
   │Drag ✓   │        │Hover ✓  │       │Hover ✓  │
   │Expand ✓ │        │Expand ✗ │       │Expand ✗ │
   └─────────┘        └─────────┘       └─────────┘
```

---

## Opacity Lifecycle

### Mobile Floating Bubble

```
User Action              Opacity      Pointer Events
────────────────────────────────────────────────────
1. Page Load             25%          auto (clickable)
2. User hovers           100%         auto (clickable)
3. User clicks           100%         auto (modal open)
4. Modal expanded        100%         auto (modal mode)
5. User closes modal     25%          auto (default)
6. Idle after 3s        25% (fades)   auto (clickable)
────────────────────────────────────────────────────

Timeline visualization:
    0ms      300ms      600ms       900ms
    │        │          │           │
    ▼        ▼          ▼           ▼
    25% ─→ 100% ─→ [Modal] ─→ [Close] ─→ 25%
    Idle   Hover    Active      Fade
    │◄─────opacity transition────►│
```

### Desktop Sidebar

```
User Action              Opacity      Pointer Events
────────────────────────────────────────────────────
1. Page Load             25%          none (passthrough)
2. User hovers           100%         auto (interactive)
3. Hover away           100% → 25%    none (passthrough)
4. Page inactive        25%           none (passthrough)
────────────────────────────────────────────────────

Timeline visualization:
    0ms      300ms      600ms
    │        │          │
    ▼        ▼          ▼
    25% ─→ 100% ─→ 25%
    Idle   Hover   Idle
    │◄────opacity transition────►│
```

---

## Pose State Machine

```
                    ┌──────────┐
                    │ START    │
                    └─────┬────┘
                          │
                    ┌─────▼──────┐
                    │ onboarding │ 🫡
                    │ (Amber)    │
                    └─────┬──────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    ┌───▼────┐       ┌────▼────┐      ┌────▼────┐
    │ vision │ ◄────►│ victory │      │ warning │
    │(Blue)  │ ◄────►│(Green)  │ ◄───►│ (Red)   │
    └────────┘       └────────┘      └────────┘
        │                 │
        └─────────────────┼─────────────────┐
                          │
                    ┌─────▼──────┐
                    │   empty    │ 🤔
                    │  (Slate)   │
                    └────────────┘
```

**Pose Colors & Usage:**
- 🫡 `onboarding` (Amber #fbbf24) - Login, welcome screens
- 📸 `vision` (Blue #3b82f6) - Default, chart analysis
- 🎖️ `victory` (Green #22c55e) - Profit hits, achievements
- ⚠️ `warning` (Red #ef4444) - Risk alerts, warnings
- 🤔 `empty` (Slate #64748b) - Errors, loading states

---

## Responsive Breakpoint Logic

```typescript
// Breakpoint Detection
const breakpoints = {
  mobile:  window.innerWidth < 768,      // <  768px
  tablet:  window.innerWidth >= 768,     // >= 768px
  desktop: window.innerWidth >= 1024     // >= 1024px
};

// Component Selection
if (breakpoints.mobile) {
  render <FloatingAIMentorBubble />
} else {
  render <AIMentorSidebar /> or <AIMentorSidebarLeft />
}

// Content Spacing
if (!isMobile) {
  if (position === 'right') contentClass += 'lg:pr-1/5'
  if (position === 'left')  contentClass += 'lg:pl-1/5'
}
```

---

## CSS Utility Classes Reference

### Opacity
```css
/* Dynamic opacity */
.opacity-25      /* 25% - Idle/background */
.opacity-100     /* 100% - Active/hover */
.transition-all  /* Smooth 300ms transition */
.duration-300    /* 300ms transition time */
```

### Positioning
```css
/* Fixed sidebar */
.fixed           /* Fixed position */
.right-0         /* Right: 0 */
.left-0          /* Left: 0 */
.top-0           /* Top: 0 */
.h-screen        /* Height: 100vh */
.w-1/5           /* Width: 20% */

/* Mobile floating */
.bottom-right    /* Used inline: position absolute */
.z-40            /* z-index: 40 (high but not modal) */
```

### Pointer Events
```css
.pointer-events-none   /* pointer-events: none (clicks pass through) */
.pointer-events-auto   /* pointer-events: auto (clickable) */
```

### Interactions
```css
.cursor-grab     /* Grab icon (draggable) */
.cursor-grabbing /* Grabbing icon (dragging) */
.group-hover:    /* Apply on parent hover */
.hover:          /* Apply on self hover */
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│           Page Component                         │
│  - Track mentorPose, mentorActive, position     │
└────────────────┬────────────────────────────────┘
                 │ Pass as props
                 ▼
┌─────────────────────────────────────────────────┐
│    ResponsiveAIMentorLayout                      │
│  - Detect screen size                           │
│  - Choose component (mobile/desktop)            │
│  - Apply content spacing                        │
└────────┬───────────────────────┬────────────────┘
         │                       │
    MOBILE                    DESKTOP
    WIDTH                     WIDTH
         │                       │
         ▼                       ▼
┌──────────────────┐  ┌─────────────────────┐
│FloatingAIMentor  │  │ AIMentorSidebar(L)  │
│ - Position state │  │ - Opacity state     │
│ - Drag handlers  │  │ - Hover state       │
│ - Expand state   │  │ - Active indicator  │
└──────────────────┘  └─────────────────────┘
         │                       │
         └───────┬───────────────┘
                 │ Render
                 ▼
         ┌──────────────┐
         │ DOM Elements │
         └──────────────┘
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────┐
│       Load Time Optimization            │
└─────────────────────────────────────────┘

Initial Load:
  ├── ResponsiveAIMentorLayout (lazy)
  ├── FloatingAIMentorBubble (lazy, mobile only)
  ├── AIMentorSidebar (lazy, desktop only)
  └── Images (lazy, loading="lazy")
           │
           ├── Only load needed components
           ├── Images load on demand
           └── CSS transforms (GPU accelerated)

Runtime Performance:
  ├── Opacity changes: CSS (no reflow)
  ├── Position changes: Absolute positioning
  ├── Hover effects: pointer-events toggle
  └── Transitions: Will-change hints
```

---

## Browser Support

```
Feature              Chrome  Firefox  Safari  Edge
─────────────────────────────────────────────────
Opacity              ✓       ✓        ✓       ✓
CSS Transitions      ✓       ✓        ✓       ✓
Pointer Events       ✓       ✓        ✓       ✓
Touch Events         ✓       ✓        ✓       ✓
Next.js Image        ✓       ✓        ✓       ✓
Backdrop Filter      ✓       ✓        12+     ✓
─────────────────────────────────────────────────
```

---

## Testing Checklist

### Unit Tests
- [ ] ResponsiveAIMentorLayout detects mobile correctly
- [ ] FloatingAIMentorBubble respects isVisible prop
- [ ] AIMentorSidebar opacity changes on hover
- [ ] Pose values render correct image paths

### Integration Tests
- [ ] Mobile < 768px shows floating bubble
- [ ] Desktop ≥ 768px shows sidebar
- [ ] Resize triggers layout switch
- [ ] Opacity transitions are smooth

### Visual Tests
- [ ] No white border around mascot (transparent PNG)
- [ ] Floating bubble doesn't go off-screen
- [ ] Sidebar doesn't block main content
- [ ] Text remains readable at 25% opacity

### Performance Tests
- [ ] Lighthouse score > 80
- [ ] Layout shift < 0.1 (CLS)
- [ ] First contentful paint < 2s
- [ ] Image load time < 500ms

---

## Debugging Tools

```javascript
// Console debugging
window.innerWidth                    // Check screen size
document.querySelector('[role="complementary"]')  // Find sidebar
getComputedStyle(element).opacity    // Check actual opacity
getComputedStyle(element).pointerEvents  // Check pointer events

// Dev Tools
Right-click > Inspect > Computed    // View final CSS
Ctrl+Shift+C (Windows)              // Element picker
Cmd+Option+I (Mac)                  // Dev tools
```

---

## Deployment Checklist

```
Pre-Launch
  ☐ All PNG files transparent (no white background)
  ☐ Images optimized (< 500KB each)
  ☐ Mobile testing on real devices
  ☐ Desktop testing on multiple browsers
  ☐ Accessibility audit (WCAG 2.1)
  ☐ Performance budget met

Launch
  ☐ Deploy to production
  ☐ Monitor error logs
  ☐ A/B test opacity levels
  ☐ Collect user feedback

Post-Launch
  ☐ Analytics on hover rates
  ☐ Metrics on drag frequency
  ☐ Feedback on mascot visibility
  ☐ Plan for improvements
```

---

## Quick Links

- 📖 [Full Responsive Guide](./AI_MENTOR_RESPONSIVE_GUIDE.md)
- 🚀 [Quick Reference](./AI_MENTOR_QUICK_REFERENCE.md)
- 💻 Component Files:
  - `src/components/FloatingAIMentor.tsx`
  - `src/components/AIMentorSidebar.tsx`
  - `src/components/ResponsiveAIMentorLayout.tsx`

---

**Last Updated:** 2026-01-08  
**Version:** 1.0 - Architecture Overview
