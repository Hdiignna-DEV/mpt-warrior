# 🧠 AI Mentor Quick Reference

**Tl;dr** - Smart mascot yang berubah layout sesuai ukuran layar. Mobile = draggable bubble, Desktop = sidebar.

---

## 🚀 Quick Start

### 1. Wrap your page dengan responsive layout:
```tsx
import { ResponsiveAIMentorLayout } from '@/components/ResponsiveAIMentorLayout';

export default function MyPage() {
  return (
    <ResponsiveAIMentorLayout mentorPose="vision" mentorActive={false}>
      <YourContent />
    </ResponsiveAIMentorLayout>
  );
}
```

### 2. Atau gunakan langsung untuk more control:

**Mobile:**
```tsx
import { FloatingAIMentorBubble } from '@/components/FloatingAIMentor';

// Renders di bottom-right, draggable, expandable
<FloatingAIMentorBubble pose="vision" isActive={false} />
```

**Desktop:**
```tsx
import { AIMentorSidebar } from '@/components/AIMentorSidebar';

// Fixed 20% sidebar, smooth opacity on hover
<AIMentorSidebar pose="vision" isActive={false} />
```

---

## 🎨 Poses (5 options)

```tsx
mentorPose = 'onboarding' // 🫡 Welcome, login
mentorPose = 'vision'     // 📸 Default, chart analysis
mentorPose = 'victory'    // 🎖️ Profit, achievement
mentorPose = 'warning'    // ⚠️ Risk, alert
mentorPose = 'empty'      // 🤔 Error, loading
```

---

## 💡 Key Features

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Position | Bottom-right | Right/Left sidebar |
| Size | 80x80px | Half/full body |
| Opacity | 25% → 100% | 25% → 100% |
| Interaction | Drag + Click | Hover |
| Width | - | 20% of screen |

---

## 🎯 Common Use Cases

### AI Mentor Page
```tsx
const [mentorPose, setMentorPose] = useState<'vision' | 'victory'>('vision');

// Change pose when user gets profit
useEffect(() => {
  if (profit > 0) setMentorPose('victory');
}, [profit]);

return (
  <ResponsiveAIMentorLayout mentorPose={mentorPose} mentorActive>
    <ChatComponent />
  </ResponsiveAIMentorLayout>
);
```

### Login Page with Left Sidebar
```tsx
// Desktop: Left sidebar with Commander Arka
import { AIMentorSidebarLeft } from '@/components/AIMentorSidebar';

return (
  <div className="grid md:grid-cols-1 lg:grid-cols-5">
    <AIMentorSidebarLeft pose="onboarding" />
    <div className="lg:col-span-4">
      <LoginForm />
    </div>
  </div>
);
```

### Dashboard with Activity Indicator
```tsx
<ResponsiveAIMentorLayout 
  mentorPose={mentorActive ? 'victory' : 'vision'}
  mentorActive={mentorActive}
>
  <Dashboard />
</ResponsiveAIMentorLayout>
```

---

## ✅ Opacity Behavior

- **Idle:** 25% (visible but subtle, doesn't block content)
- **Hover/Active:** 100% (fully visible)
- **Mobile dragging:** Smooth position changes
- **Desktop hovering:** Smooth opacity fade

**Why 25%?** 
- Mascot visible but transparent
- Charts/text readable underneath
- `pointer-events: none` = clicks pass through

---

## 🔧 Props Reference

### ResponsiveAIMentorLayout
```tsx
<ResponsiveAIMentorLayout 
  children={ReactNode}           // Your content
  mentorPose={'vision'}          // Pose type
  mentorActive={false}           // Highlight state
  position={'right'}             // 'right' or 'left'
/>
```

### FloatingAIMentorBubble (Mobile)
```tsx
<FloatingAIMentorBubble 
  pose={'vision'}                // Pose type
  isActive={false}               // Pulse indicator
  message={'Hello!'}             // Modal message
  onClose={() => {}}             // Close callback
  isVisible={true}               // Toggle visibility
/>
```

### AIMentorSidebar (Desktop Right)
```tsx
<AIMentorSidebar 
  pose={'vision'}                // Pose type
  isActive={false}               // Pulse indicator
  opacity={25}                   // Base opacity %
  children={<p>Extra</p>}        // Optional content
/>
```

### AIMentorSidebarLeft (Desktop Left)
```tsx
<AIMentorSidebarLeft 
  pose={'onboarding'}            // Pose type
  isActive={false}               // Pulse indicator
  opacity={25}                   // Base opacity %
  children={null}                // Optional content
/>
```

---

## 📱 Responsive Breakpoints

- **Mobile:** < 768px (Tailwind `md:` breakpoint)
  - Uses `FloatingAIMentorBubble`
  - Bottom-right corner
  - Draggable, expandable

- **Tablet/Desktop:** ≥ 768px
  - Uses `AIMentorSidebar`
  - Fixed 20% width
  - Smooth hover effects

---

## 🎬 Visual States

### Mobile Floating Bubble
```
Idle (25% opacity)         Hover (100%)           Expanded (Modal)
┌─────────┐              ┌─────────┐            ┌──────────────┐
│ 👤 (faint)│            │ 👤 (bright)          │ 💬 Message   │
│        │              │ 📍 Drag │            │ [Close]      │
└─────────┘              └─────────┘            └──────────────┘
```

### Desktop Sidebar
```
Idle (25%)                 Hover (100%)
┌──────────┐              ┌──────────┐
│ 👤 (faint)│              │ 👤 (bright)
│        │              │ 💡 Action │
│        │              └──────────┘
└──────────┘
```

---

## 🚨 Common Mistakes

❌ **Don't:** Use window size in SSR  
```tsx
const isMobile = window.innerWidth < 768;  // SSR error!
```
✅ **Do:** Use useEffect with hydration check
```tsx
useEffect(() => {
  setIsMobile(window.innerWidth < 768);
}, []);
```

---

❌ **Don't:** Use static opacity  
```tsx
className="opacity-30"  // Doesn't change on hover
```
✅ **Do:** Use dynamic opacity
```tsx
style={{ opacity: currentOpacity / 100 }}
```

---

❌ **Don't:** Forget transparent PNG  
```
commander-arka.png  // White background
```
✅ **Do:** Use transparent PNG
```
commander-arka.png  // Transparent background
```

---

## 🐛 Quick Debugging

**Mascot not showing?**
- Check if file exists: `public/images/mascots/commander-arka-{pose}.png`
- Verify PNG is transparent (not white background)
- Check browser console for 404 errors

**Opacity not changing?**
- Inspect element: Is `pointer-events: none` set correctly?
- Check if hover is triggering `setIsHovering(true)`
- Look for CSS conflicts overriding opacity

**Mobile dragging not working?**
- Test on actual mobile device (not just browser resize)
- Check touch event handlers in console
- Verify boundary calculation in code

**Layout wrong on desktop?**
- Sidebar should be 20% width (`w-1/5`)
- Content should use `lg:pr-1/5` or `lg:pl-1/5`
- Check responsive classes are applied correctly

---

## 📊 File Structure

```
src/
├── components/
│   ├── FloatingAIMentor.tsx          ← Mobile bubble
│   ├── AIMentorSidebar.tsx           ← Desktop sidebars
│   ├── ResponsiveAIMentorLayout.tsx  ← Auto-switch wrapper
│   └── ChatUIEnhancers.tsx           ← Pose types
└── app/
    ├── login/page.tsx                ← Uses AIMentorSidebarLeft
    ├── ai-mentor/page.tsx            ← Uses ResponsiveAIMentorLayout
    └── dashboard/page.tsx            ← Uses ResponsiveAIMentorLayout

public/
└── images/
    └── mascots/
        ├── commander-arka-onboarding.png
        ├── commander-arka-vision.png
        ├── commander-arka-victory.png
        ├── commander-arka-warning.png
        └── commander-arka-empty.png
```

---

## ⚡ Performance Tips

1. **Use lazy loading on images**
   ```tsx
   loading="lazy"
   priority={false}
   ```

2. **Memoize pose changes**
   ```tsx
   const memoizedPose = useMemo(() => mentorPose, [mentorPose]);
   ```

3. **Use CSS transforms instead of position**
   ```tsx
   opacity: 0.25  // GPU accelerated ✅
   display: none  // Causes reflow ❌
   ```

---

## 🎓 Learning Path

1. **Read:** [Full Responsive Guide](./AI_MENTOR_RESPONSIVE_GUIDE.md)
2. **Reference:** This Quick Reference
3. **Code:** Check component source files
4. **Test:** Resize browser, test on mobile
5. **Deploy:** Follow deployment checklist

---

**Last Updated:** 2026-01-08  
**Version:** 1.0 - Initial Release
