# 🧠 AI Mentor Responsive Design Guide

## Overview

AI Mentor (Commander Arka) is now fully responsive with intelligent layout switching based on screen size. This guide explains the architecture, components, and best practices for the new system.

**Key Concept:** Smart, context-aware layout that adapts to screen size while maintaining visual appeal and functionality.

---

## 📱 Layout Breakdown

### Mobile (<768px) - Smart Floating Bubble

**Design Principles:**
- Minimalist, non-intrusive floating avatar in bottom-right corner
- User can drag to prevent blocking important UI elements
- Click to expand and see full message/advice
- Dynamic opacity: 25% idle → 100% on hover/active

**Features:**
- ✅ Draggable avatar (80x80px) with touch support
- ✅ Prevents off-screen positioning with boundary detection
- ✅ Visual hint "📍 Drag" on hover
- ✅ Smooth opacity transitions (pointer-events: none when idle)
- ✅ Expanded modal with half-body mascot on click
- ✅ Active state pulse indicator for notifications

**Implementation:**
- Component: `FloatingAIMentorBubble`
- File: `src/components/FloatingAIMentor.tsx`

```tsx
// Usage in any component
<FloatingAIMentorBubble 
  pose="vision"           // 'onboarding' | 'vision' | 'victory' | 'warning' | 'empty'
  isActive={false}        // Highlight with pulse animation
  message="Hello!"        // Message shown in expanded modal
  onClose={() => {}}      // Callback when closed
  isVisible={true}        // Toggle visibility
/>
```

**CSS Classes:**
- `.opacity-25` → Idle state (subtle, allows clicks through)
- `.opacity-100` → Active/Hover state
- `.cursor-grab` → Ready to drag
- `.cursor-grabbing` → Currently dragging

---

### Tablet/Desktop (≥768px) - Fixed Sidebar

**Design Principles:**
- Fixed 20% width sidebar on right or left
- Displays half-body or full-body mascot
- Dynamic opacity: 25% idle → 100% on hover
- Pointer-events: none when idle (clicks pass through to main content)
- Backdrop blur for visual polish

**Features:**
- ✅ Responsive 20% width layout
- ✅ Smooth hover-activated opacity
- ✅ Active indicator with pulse animation
- ✅ Optional "Ask Advice" quick action button
- ✅ Semantic HTML with proper ARIA labels
- ✅ Lazy image loading for performance

**Implementation:**
- Component (Right): `AIMentorSidebar`
- Component (Left): `AIMentorSidebarLeft`
- File: `src/components/AIMentorSidebar.tsx`

```tsx
// Right sidebar (most pages)
<AIMentorSidebar 
  pose="vision"        // 'onboarding' | 'vision' | 'victory' | 'warning' | 'empty'
  isActive={false}     // Highlight state
  opacity={25}         // Base opacity percentage
  children={<p>Extra content</p>}  // Optional children
/>

// Left sidebar (login, onboarding)
<AIMentorSidebarLeft 
  pose="onboarding"
  isActive={false}
  opacity={25}
  children={null}
/>
```

**CSS Benefits:**
- `.z-30` → Proper stacking (below modals but above main content)
- `.pointer-events-none` → Allows clicks to pass through when idle
- `.backdrop-blur-sm` → Frosted glass effect
- `.transition-all duration-300` → Smooth opacity changes

---

## 🎯 Responsive Layout Component

The `ResponsiveAIMentorLayout` component automatically switches layouts based on screen size.

**Features:**
- ✅ Automatic mobile detection (<768px threshold)
- ✅ Hydration-safe (prevents SSR/client mismatch)
- ✅ Configurable sidebar position (left/right)
- ✅ Proper content area spacing for desktop

**Usage:**
```tsx
// Wrap your page content
<ResponsiveAIMentorLayout 
  mentorPose="vision"
  mentorActive={false}
  position="right"  // 'right' or 'left'
>
  {/* Your page content goes here */}
  <YourPageContent />
</ResponsiveAIMentorLayout>
```

**What It Does:**
- **Mobile:** Renders `FloatingAIMentorBubble`
- **Desktop:** Renders `AIMentorSidebar` or `AIMentorSidebarLeft`
- **Content:** Adds proper padding/margin for sidebar
- **Hydration:** Waits for client-side mount before rendering

---

## 🎨 Commander Arka Poses

Five distinct pose types for different scenarios:

| Pose | Emoji | Use Case | Color Theme |
|------|-------|----------|-------------|
| `onboarding` | 🫡 | Welcome, login, registration | Amber (#fbbf24) |
| `vision` | 📸 | Chart analysis, default state | Blue (#3b82f6) |
| `victory` | 🎖️ | Profit hit, achievement | Green (#22c55e) |
| `warning` | ⚠️ | Risk alert, overtrade warning | Red (#ef4444) |
| `empty` | 🤔 | Error, loading, thinking | Slate (#64748b) |

**Image Files:**
All mascot images must be stored as transparent PNG files at:
```
public/images/mascots/
├── commander-arka-onboarding.png
├── commander-arka-vision.png
├── commander-arka-victory.png
├── commander-arka-warning.png
└── commander-arka-empty.png
```

**Important:** Use transparent PNGs (no white background) for clean integration.

---

## 📐 Opacity Behavior System

The dynamic opacity system ensures mascots don't block important content.

### Opacity States:

```
┌─────────────────────────────────────────┐
│ STATE          │ OPACITY │ POINTER-EVENTS│
├─────────────────────────────────────────┤
│ Idle (mobile)  │   25%   │ auto (clickable)
│ Hover (mobile) │  100%   │ auto            │
│ Active (mobile)│  100%   │ auto            │
│ Expanded       │  100%   │ auto (modal)    │
│                │         │                 │
│ Idle (desktop) │   25%   │ none (passthrough)
│ Hover (desk.)  │  100%   │ auto            │
│ Active (desk.) │  100%   │ auto            │
└─────────────────────────────────────────┘
```

### Benefits:

1. **Content Visibility:** At 25% opacity, charts and important UI remain readable
2. **Non-Blocking:** `pointer-events: none` allows clicking buttons beneath mascot
3. **User Control:** Users can drag (mobile) or hover (desktop) to interact
4. **Smooth Transitions:** CSS transitions make opacity changes fluid

---

## 🔧 Configuration Examples

### Example 1: AI Mentor Page

```tsx
// pages/ai-mentor/page.tsx
import { ResponsiveAIMentorLayout } from '@/components/ResponsiveAIMentorLayout';
import AIMentorChat from '@/components/AIMentorChat';

export default function AIMentorPage() {
  const [mentorPose, setMentorPose] = useState<'vision' | 'victory'>('vision');
  const [mentorActive, setMentorActive] = useState(false);

  const handleChartUpload = () => {
    setMentorPose('vision');
    setMentorActive(true);
  };

  return (
    <ResponsiveAIMentorLayout 
      mentorPose={mentorPose}
      mentorActive={mentorActive}
      position="right"
    >
      <AIMentorChat onChartUpload={handleChartUpload} />
    </ResponsiveAIMentorLayout>
  );
}
```

### Example 2: Login Page with Left Sidebar

```tsx
// app/login/page.tsx
import { AIMentorSidebarLeft } from '@/components/AIMentorSidebar';

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-1 lg:grid-cols-5">
      {/* Desktop: Left sidebar with Commander Arka */}
      <AIMentorSidebarLeft pose="onboarding" isActive={false} opacity={30} />
      
      {/* Mobile: Floating bubble handled in ResponsiveAIMentorLayout */}
      {/* Main form content */}
      <div className="lg:col-span-4">
        <LoginForm />
      </div>
    </div>
  );
}
```

### Example 3: Dashboard with Right Sidebar

```tsx
// app/dashboard/page.tsx
import { ResponsiveAIMentorLayout } from '@/components/ResponsiveAIMentorLayout';

export default function Dashboard() {
  const [mentorActive, setMentorActive] = useState(false);

  // Activate mentor on significant events
  useEffect(() => {
    // Show mentor when user hits profit target
    if (profitStatus === 'victory') {
      setMentorActive(true);
    }
  }, [profitStatus]);

  return (
    <ResponsiveAIMentorLayout 
      mentorPose={profitStatus === 'victory' ? 'victory' : 'vision'}
      mentorActive={mentorActive}
      position="right"
    >
      <DashboardContent />
    </ResponsiveAIMentorLayout>
  );
}
```

---

## 🚀 Best Practices

### 1. Image Optimization

```tsx
// ✅ Good: Lazy loading with Next.js Image
<Image
  src={`/images/mascots/commander-arka-${pose}.png`}
  alt="Commander Arka"
  fill
  className="object-contain drop-shadow-lg"
  loading="lazy"
  priority={false}  // Don't load immediately
/>

// ❌ Bad: Standard img tag
<img src="/images/mascots/commander-arka-vision.png" />
```

### 2. Responsive States

```tsx
// ✅ Good: Use responsive utility detection
useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

// ❌ Bad: Client-only render without hydration check
const isMobile = window.innerWidth < 768;  // SSR error!
```

### 3. Opacity Transitions

```tsx
// ✅ Good: Smooth transitions
className="transition-all duration-300"
style={{ opacity: currentOpacity / 100 }}

// ❌ Bad: Jarring changes
className="opacity-100"  // Jumps instantly
```

### 4. Accessibility

```tsx
// ✅ Good: ARIA labels and semantic HTML
<aside 
  role="complementary"
  aria-label="AI Mentor Assistant"
>

// ❌ Bad: Generic divs
<div className="sidebar">
```

### 5. Mobile UX

```tsx
// ✅ Good: Show drag hint on hover
{!isExpanded && (
  <div className="opacity-0 group-hover:opacity-100">
    📍 Drag
  </div>
)}

// ❌ Bad: Hidden hints
<span className="hidden">Drag me</span>
```

---

## 🐛 Troubleshooting

### Issue: Mascot blocks buttons on mobile

**Solution:** Drag the floating bubble to a different location
- Use the "📍 Drag" hint to reposition
- Boundary detection prevents off-screen movement

### Issue: Opacity not changing on desktop

**Cause:** Check if `pointer-events: none` is preventing hover
```tsx
// Debug: Inspect computed styles
className={`... ${isHovering ? 'pointer-events-auto' : 'pointer-events-none'}`}
```

### Issue: Mobile mascot not showing

**Cause:** Likely not detecting mobile correctly
```tsx
// Fix: Ensure hydration-safe detection
useEffect(() => {
  setIsMobile(window.innerWidth < 768);
}, []);

if (!isHydrated) return null;  // Wait for client mount
```

### Issue: PNG has white background

**Solution:** Recreate the mascot image with transparency
- Use tools like Photoshop, GIMP, or online PNG editors
- Export as PNG-24 with transparency
- Test with `background: transparent` CSS

---

## 📊 Layout Comparison

### Mobile (< 768px)
```
┌─────────────────────┐
│                     │
│   Main Content      │
│                     │
│                     │
│                     │
│         [Avatar]    │ ← Floating bubble (draggable)
└─────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────────────────┐
│ [Sidebar]│ Main Content           │
│ [Avatar] │                        │
│ (20%)    │ (80%)                  │
│          │                        │
└──────────────────────────────────┘
```

### Desktop (> 1024px)
```
┌──────────────────────────────────────┐
│ [Sidebar]│ Main Content              │
│ [Avatar] │                           │
│ Avatar   │ Charts, Forms, etc.       │
│ (20%)    │ (80%)                     │
│          │                           │
└──────────────────────────────────────┘
```

---

## 🎬 Animation States

### Mobile Floating Bubble

| Event | Animation | Duration |
|-------|-----------|----------|
| Hover | Opacity: 25% → 100% | 300ms |
| Drag | Cursor changes + smooth movement | Instant |
| Click | Modal fade-in + scale | 300ms |
| Close | Fade-out | 200ms |

### Desktop Sidebar

| Event | Animation | Duration |
|-------|-----------|----------|
| Mount | Opacity: 25% | - |
| Hover | Opacity: 25% → 100% | 300ms |
| Active | Pulse indicator glow | Infinite |
| Content Update | Fade transition | 300ms |

---

## 🔐 Security & Performance

### Performance Tips

1. **Lazy Load Images:** Use `loading="lazy"`
2. **Memoize Components:** Prevent unnecessary re-renders
3. **CSS Transforms:** Use `opacity` for smooth GPU-accelerated transitions
4. **Avoid Reflow:** Keep fixed positioning for sidebars

### Security

1. **XSS Prevention:** All user inputs sanitized before display
2. **Image Sources:** Only load from `/public/images/` directory
3. **Accessibility:** Use semantic HTML and ARIA labels

---

## 📖 Related Files

- **Components:**
  - `src/components/FloatingAIMentor.tsx` - Mobile floating bubble
  - `src/components/AIMentorSidebar.tsx` - Desktop/tablet sidebars
  - `src/components/ResponsiveAIMentorLayout.tsx` - Auto-switching wrapper
  - `src/components/ChatUIEnhancers.tsx` - Pose types & avatar component

- **Pages Using AI Mentor:**
  - `src/app/login/page.tsx` - Login with left sidebar
  - `src/app/ai-mentor/page.tsx` - AI Mentor chat page
  - `src/app/dashboard/page.tsx` - Dashboard with AI hints

- **Assets:**
  - `public/images/mascots/` - Commander Arka PNG files

---

## 🚢 Deployment Checklist

- [ ] All mascot PNG files have transparent backgrounds
- [ ] Images are optimized and under 500KB each
- [ ] Mobile breakpoint tested at <768px
- [ ] Dragging works smoothly on touch devices
- [ ] Opacity transitions are fluid
- [ ] No console errors in dev tools
- [ ] Accessibility tested with screen readers
- [ ] Performance tested on low-end devices

---

## 📝 Version History

- **v1.0** (2026-01-08) - Initial responsive AI Mentor system
  - Smart floating bubble for mobile
  - Fixed sidebars for desktop/tablet
  - Dynamic opacity system
  - Pose-based mascot states
  - Drag support on mobile

---

**Questions or issues?** Check the troubleshooting section above or review the component source code with detailed comments.
