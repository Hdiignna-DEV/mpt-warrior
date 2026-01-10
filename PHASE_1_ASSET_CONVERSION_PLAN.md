# 🎨 PHASE 1.1: Asset Conversion Plan
## WebP Conversion + Transparent Background

**Status**: ⏱️ In Progress  
**Date**: January 10, 2026  
**Goal**: Convert all PNG Arka assets to WebP with transparent backgrounds

---

## 📋 Asset Inventory

### Current Files (PNG format)
Located: `/public/images/mascots/`

```
✅ commander-arka-empty.png
✅ commander-arka-onboarding.png
✅ commander-arka-victory.png
✅ commander-arka-vision.png
✅ commander-arka-warning.png
```

### Conversion Target
```
New Format: WebP
Compression: 50% smaller than PNG
Transparency: Full transparency support
Naming: commander-arka-{pose}.webp
Fallback: Keep PNG for older browsers
```

---

## 🔄 Conversion Process

### Option 1: Manual Conversion (Recommended for now)
1. Open each PNG in image editor (GIMP, Photoshop, or online tool)
2. Verify transparency - remove any white/gray backgrounds
3. Export as WebP with lossless compression
4. Verify file size <100KB each

### Option 2: Batch Script (For future)
```bash
# Convert all PNG to WebP
for file in public/images/mascots/*.png; do
  cwebp -lossless "$file" -o "${file%.png}.webp"
done
```

---

## 📊 Expected Sizes

| Asset | PNG Size | WebP Size (est) |
|-------|----------|-----------------|
| empty | ~80KB | ~40KB |
| onboarding | ~120KB | ~60KB |
| victory | ~110KB | ~55KB |
| vision | ~130KB | ~65KB |
| warning | ~125KB | ~60KB |
| **TOTAL** | **~565KB** | **~280KB** |

**Savings**: ~50% reduction in asset size 🎉

---

## 🔧 Code Changes Required

### 1. Image Import Updates
**File**: `src/components/AIMentorSidebar.tsx`
```typescript
// OLD
<Image
  src={`/images/mascots/commander-arka-${pose}.png`}
  alt={`Commander Arka ${pose}`}
  ...
/>

// NEW (with WebP + PNG fallback)
<picture>
  <source srcSet={`/images/mascots/commander-arka-${pose}.webp`} type="image/webp" />
  <img src={`/images/mascots/commander-arka-${pose}.png`} alt={`Commander Arka ${pose}`} />
</picture>
```

### 2. Next.js Image Optimization
Update `next.config.ts` to include WebP in supported formats:
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
}
```

### 3. CSS Styling
- Ensure transparent backgrounds blend with Dark Mode
- Update opacity: rgba(255, 255, 255, 0.3) for idle state

---

## ✅ Verification Checklist

- [ ] All PNG assets converted to WebP
- [ ] Transparency verified (no white backgrounds)
- [ ] File sizes <100KB each
- [ ] PNG fallbacks created
- [ ] Image imports updated in components
- [ ] Tested in all browsers (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsiveness verified
- [ ] Dark Mode appearance tested
- [ ] Performance: load time <1s

---

## 🎯 Next Steps

1. **Convert assets** (manual or script)
2. **Update component imports** (AIMentorSidebar, FloatingAIMentor)
3. **Test rendering** in different breakpoints
4. **Optimize CSS** for transparency blending
5. **Merge to Phase 1.2** (Desktop Layout)

