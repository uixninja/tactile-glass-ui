/// <reference types="vite/client" />
import {
  TactileGlassStage,
  TactileGlassParams,
  StageTargetInfo,
  BUTTON_DEFAULT_PARAMS,
  BACKGROUND_DEFAULT_PARAMS
} from "../engine/TactileEngine";
import { createIcons, ArrowRight, Download } from "lucide";
import skillMarkdown from "../../SKILL.md?raw";

const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement | null;
const heroBgEl = document.getElementById("hero-lens-background") as HTMLElement | null;
const heroBtnEl = document.getElementById("hero-explore-btn") as HTMLElement | null;
const brandBadgeEl = document.querySelector(".brand-badge") as HTMLElement | null;

function toStageParams(def: Omit<TactileGlassParams, "radius">): TactileGlassParams {
  return {
    refraction: def.refraction,
    thickness: def.thickness,
    bevelWidth: def.bevelWidth,
    frost: def.frost,
    dispersion: def.dispersion,
    sheen: def.sheen,
    angle: def.lightAngle ?? def.angle ?? 24,
    darkness: def.darkness,
    rim: def.rim,
    fluidBright: def.fluidBright,
    fluidSpeed: def.fluidSpeed,
    fluidScale: def.fluidScale,
    fluidAuraWidth: def.fluidAuraWidth,
    fluidCenter: def.fluidCenter,
    auroraFlow: def.auroraFlow,
    hoverBright: def.hoverBright,
    lightTrack: def.lightTrack,
    clickWave: def.clickWave
  };
}

const heroBgParams: TactileGlassParams = {
  ...toStageParams(BACKGROUND_DEFAULT_PARAMS),
  radius: 0,
  fluidBright: 20,
  fluidScale: 56,
  fluidAuraWidth: 80,
  clickWave: 0
};
const heroBtnParams = toStageParams(BUTTON_DEFAULT_PARAMS);
const brandBadgeParams: TactileGlassParams = {
  ...heroBtnParams,
  frost: 8,
  fluidBright: 40,
  fluidScale: 4,
  fluidAuraWidth: 32,
  fluidCenter: 0
};

const btnDownloadSkill = document.getElementById("btn-download-skill");
if (btnDownloadSkill) {
  btnDownloadSkill.addEventListener("click", () => {
    const blob = new Blob([skillMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SKILL.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

createIcons({
  icons: {
    ArrowRight,
    Download
  }
});

if (canvas) {
  let lastTitleTop = -1;
  let lastTitleHeight = -1;

  const stage = new TactileGlassStage(canvas, {
    getTargets: (): (StageTargetInfo | null | undefined)[] => {
      const heroTitleEl = document.getElementById("hero-title");
      if (heroTitleEl) {
        const r = heroTitleEl.getBoundingClientRect();
        if (Math.abs(r.top - lastTitleTop) > 0.5 || Math.abs(r.height - lastTitleHeight) > 0.5) {
          lastTitleTop = r.top;
          lastTitleHeight = r.height;
          queueMicrotask(() => stage.updateBackground());
        }
      }
      return [
        heroBgEl ? { element: heroBgEl, params: heroBgParams } : null,
        brandBadgeEl ? { element: brandBadgeEl, params: brandBadgeParams } : null,
        heroBtnEl ? { element: heroBtnEl, params: heroBtnParams } : null
      ];
    },
    drawBackground: (bgCtx, width, height, dpr, _time = 0, offsetX = 0, offsetY = 0) => {
      bgCtx.save();
      const heroTitleEl = document.getElementById("hero-title");
      const lineEls = document.querySelectorAll<HTMLElement>(".hero-title-line");
      const canvasRect = canvas.getBoundingClientRect();
      const comp = heroTitleEl ? window.getComputedStyle(heroTitleEl) : null;
      const computedFontSize = comp
        ? parseFloat(comp.fontSize) * dpr
        : Math.min(80 * dpr, width * 0.115, height * 0.17);
      const fontSize = Math.round(computedFontSize);
      const fontWeight = comp ? comp.fontWeight : "800";
      const fontFamily = comp ? comp.fontFamily : `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", sans-serif`;

      bgCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      if ("letterSpacing" in bgCtx) {
        bgCtx.letterSpacing = comp && comp.letterSpacing && comp.letterSpacing !== "normal" ? comp.letterSpacing : "-0.025em";
      }
      bgCtx.textAlign = "left";
      bgCtx.textBaseline = "alphabetic";
      bgCtx.fillStyle = "rgba(255, 255, 255, 0.92)";

      if (lineEls.length > 0 && canvasRect.width > 0) {
        lineEls.forEach((lineEl) => {
          const lineText = lineEl.textContent?.trim() || "";
          if (!lineText) return;
          const rect = lineEl.getBoundingClientRect();
          const metrics = bgCtx.measureText(lineText);
          const left = metrics.actualBoundingBoxLeft ?? 0;
          const right = metrics.actualBoundingBoxRight ?? metrics.width;
          const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.72;
          const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.18;
          const centerX = (rect.left - canvasRect.left + rect.width * 0.5) * dpr;
          const centerY = (rect.top - canvasRect.top + rect.height * 0.5) * dpr;
          const drawX = Math.round(centerX - (right - left) * 0.5 - offsetX);
          const drawY = Math.round(centerY + (ascent - descent) * 0.5 - offsetY);
          bgCtx.fillText(lineText, drawX, drawY);
        });
      }

      bgCtx.restore();
    }
  });

  if (heroBgEl) stage.attachPointer(heroBgEl);
  if (brandBadgeEl) stage.attachPointer(brandBadgeEl);
  if (heroBtnEl) stage.attachPointer(heroBtnEl);
}
