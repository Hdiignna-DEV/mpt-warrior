# SPRINT 1: AI Mentor Standarisasi Aset & Layout
**Status:** In Progress  
**Target Completion:** Week 1 (Jan 8-12, 2026)

---

## Task 1: ✅ Audit Asset Status
**Completed** - Confirmed 5 pose mascots exist at `/public/images/mascots/`:
- commander-arka-empty.png
- commander-arka-onboarding.png
- commander-arka-victory.png
- commander-arka-vision.png
- commander-arka-warning.png

Current render: Using Next.js Image component with `object-contain`

---

## Task 2: 🔄 Remove White Backgrounds from Mascot Assets

### Current Status
All PNG files need to be verified for:
- ✅ Alpha channel transparency (RGBA format)
- ❌ No white background pixels
- ❌ No semi-transparent white halos

### How to Fix (Quick Reference)
**Option A: Online Tool (Easiest)**
1. Go to https://www.remove.bg/
2. Upload each PNG file
3. Download with transparent background
4. Replace files in `/public/images/mascots/`

**Option B: Photoshop/GIMP (Best Quality)**
1. Open image in GIMP
2. Layer → Transparency → Color to Alpha → Select White
3. File → Export As → PNG (ensure transparency enabled)
4. Replace files

**Option C: Command Line (Batch)**
```bash
# Using ImageMagick (if installed)
convert commander-arka-*.png -transparent white commander-arka-optimized-*.png
```

### Verification Checklist
After processing each file:
- [ ] No white pixels in image
- [ ] Edges are clean/anti-aliased
- [ ] File size < 200KB (optimize with TinyPNG)
- [ ] Renders correctly in dark mode (test in browser)
- [ ] No artifacts or color shifts

---

## Task 3: Fix Component Z-Index & Layout (Side-by-Side)

### Files to Update
1. **src/components/FloatingAIMentor.tsx**
   - Ensure z-index doesn't interfere with main chat
   - Add `pointer-events-none` when not interactive

2. **src/components/AIMentorSidebar.tsx**
   - Desktop: Set fixed width (20%) with proper margin
   - Chat content: Add `lg:pr-1/5` margin to prevent overlap
   - Use `will-change: transform` for performance

3. **src/components/ResponsiveAIMentorLayout.tsx**
   - Ensure grid/flexbox layout prevents stacking
   - Mobile: Stack vertically, desktop: side-by-side

4. **src/app/ai-mentor/page.tsx**
   - Messages container: Add margin for mascot
   - Z-index hierarchy: messages (10) > mascot (5) > background (0)

### Layout Pattern (Flexbox/Grid)
```css
/* Desktop: Side-by-side */
.chat-container {
  display: grid;
  grid-template-columns: 1fr auto; /* Chat | Mascot */
  gap: 1rem;
}

/* Mobile: Stack vertically */
@media (max-width: 768px) {
  .chat-container {
    grid-template-columns: 1fr;
  }
}
```

---

## Task 4: Implement Opacity Modes for Chat Context

### Implementation Points
**Location:** `src/app/ai-mentor/page.tsx`

```typescript
// Add state
const [isScrolling, setIsScrolling] = useState(false);
const [lastMessageTime, setLastMessageTime] = useState<number>(0);

// Monitor scroll
useEffect(() => {
  const handleScroll = () => {
    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 2000); // Reset after 2s idle
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Compute opacity
const mascotOpacity = isScrolling ? 'opacity-30' : 'opacity-100';
```

### CSS Transitions
```css
.mascot {
  transition: opacity 0.3s ease-in-out;
}
```

---

## Task 5: Optimize Mobile Avatar (Draggable Floating)

### New Component: `src/components/MobileAvatarBubble.tsx`
Features:
- Circular avatar (60x60px headshot crop)
- Draggable with Framer Motion or simple touch events
- Fixed position bottom-right
- Taps to expand → Shows full conversation
- Auto-collapse on scroll

### Implementation Strategy
```typescript
// Headshot extraction (CSS crop of full mascot)
<div className="w-15 h-15 rounded-full overflow-hidden bg-slate-800 shadow-lg">
  <img src="/images/mascots/commander-arka-${pose}.png" className="scale-200 -translate-y-8" />
</div>
```

---

## Sprint 1 Checklist
- [ ] Asset transparency verified (all 5 poses)
- [ ] White backgrounds removed
- [ ] Z-index layering implemented
- [ ] Side-by-side layout working (desktop)
- [ ] Mobile stack working
- [ ] Opacity transitions smooth
- [ ] Mobile avatar draggable
- [ ] No text overlap detected
- [ ] Build passes without errors
- [ ] Tested on 3+ screen sizes

---

## Success Criteria
✅ Mascot never overlaps readable text or charts  
✅ Opacity smoothly transitions (0.3s)  
✅ Mobile avatar is draggable and doesn't block interactions  
✅ All 5 poses render with transparent backgrounds  
✅ No layout shift or jank on scroll  

---

## Next Steps
→ Move to **Sprint 2: Database Chat History** once Sprint 1 passes QA
