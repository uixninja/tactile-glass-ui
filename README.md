# Tactile Glass UI

Real-time **WebGL2 optical glass components** for React — physical Snell refraction, concentric SDF bevel normals, RGB chromatic dispersion, procedural FBM liquid caustics, and interactive pointer shockwaves.

All components on a page share a single offscreen WebGL2 rendering context (`SharedCausticEngine`) with true premultiplied alpha transparency, native `backdrop-filter` frost blur over any DOM background (grids, gradients, images), automatic parent WebGL canvas compositing when nested inside `<TactileBackground>`, and automatic idle pausing when offscreen or when the browser tab is inactive.

---

## Installation

```bash
npm install tactile-glass-ui@latest
```

Design system CSS tokens and structural rules are injected automatically when importing from `'tactile-glass-ui'`.

---

## Components

| Component | Geometry & Dimensions | Description |
| :--- | :--- | :--- |
| `<TactileButton>` | `56px` capsule (`shape="pill"`) or `56×56px` circle (`shape="circle"`) | Primary call-to-action buttons and circular icon triggers. |
| `<TactileSwitch>` | `104×56px` capsule with `48px` conformal thumb | Binary state toggles with independent `ON` and `OFF` refractive profiles. |
| `<TactileTabs>` | `56px` capsule bar with `48px` sliding indicator | Segmented view switchers with keyboard arrow navigation. |
| `<TactilePromptInput>` | Up to `580px` wide, `24px` radius, auto-expanding multiline | AI chat and agent prompt composers with context trigger, mode pill, and submit action. |
| `<TactileHeading>` / `<TactileGlassWord>` | Fluid display typography (`edt2d` sub-pixel SDF glyph domes) | Hero `h1` headlines where a focal keyword is rendered as frameless 3D liquid glass. |
| `<TactileCreditCard>` | `444px` wide (`ISO/IEC 7810 ID-1` ratio `~1.586`), `24px` radius | Interactive 3D perspective payment, membership, or tier cards with raycast tilt. |
| `<TactileAudioPlayer>` | `480×304px` deck, `32px` radius, molded transport domes | Spatial audio player deck with 70-band live spectrum and scrubbable timeline. |
| `<TactileBackground>` | Full-width section panel (`min-height: 360px`, `16px` radius) | Hero section and feature block glass backdrop panels with perimeter bevel refraction and caustic aura. |
| `<TactileGlassFx>` | Adapts to host DOM element size and `border-radius` | Universal wrapper that applies physical glass optics to any custom React element. |

---

## Quick Start

```tsx
import {
  TactileButton,
  TactileSwitch,
  TactileTabs,
  TactilePromptInput,
  TactileHeading,
  TactileCreditCard,
  TactileAudioPlayer,
  TactileBackground,
  TactileGlassFx,
} from "tactile-glass-ui";

export function Example() {
  return (
    <TactileBackground>
      <TactileHeading
        title="Engineered for Tactile Precision"
        highlight="Tactile"
      />
      <TactileButton onClick={() => {}}>
        Explore Components
      </TactileButton>
    </TactileBackground>
  );
}
```

---

## AI Agent Integration (`SKILL.md`)

This repository includes [`SKILL.md`](./SKILL.md) — a structured integration specification for AI coding agents (Claude Code, Cursor, Windsurf, Google Antigravity) covering surface audit rules, optical restraint guidelines, component recipes, and all 18 physical shader props.

---

## License

MIT © [uixNinja](https://github.com/uixninja)
