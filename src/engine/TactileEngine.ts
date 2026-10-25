/**
 * Achromatic Tactile Glass Shared Singleton WebGL Engine
 * Zero Runtime Dependencies: Pure React, TypeScript, WebGL2 and Canvas 2D.
 */


export interface TactileGlassParams {
  radius?: number;
  refraction: number;
  thickness: number;
  bevelWidth: number;
  frost: number;
  dispersion: number;
  sheen: number;
  lightAngle?: number;
  angle?: number;
  darkness: number;
  rim: number;
  // Fluid / Caustic dynamics (aliased for unified design system)
  fluidBright: number;
  fluidSpeed: number;
  fluidScale: number;
  fluidAuraWidth?: number;
  fluidCenter?: number;
  auroraFlow?: number;
  causticBright?: number;
  causticSpeed?: number;
  causticScale?: number;
  hoverBright: number;
  lightTrack: number;
  clickWave: number;
}

export interface TactileGlassInstance {
  id: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  getParams: () => TactileGlassParams;
  // Interaction coordinates and animated state
  curHover: number;
  targetHover: number;
  curMouseX: number;
  curMouseY: number;
  targetMouseX: number;
  targetMouseY: number;
  clickPos: [number, number];
  clickTime: number;
  visible: boolean;
  textMask?: string;
  textFont?: string;
  textLetterSpacing?: string;
  textPadding?: number;
  isAudioDeck?: boolean;
  getRect?: () => [number, number, number, number] | null;
  getSwitchThumb?: () => [number, number, number] | [number, number, number, number] | null;
  tilt?: { rotX: number; rotY: number; scale: number; focalLength?: number } | null;
}

export const BUTTON_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 4,
  thickness: 8,
  bevelWidth: 2,
  frost: 2,
  dispersion: 88,
  sheen: 12,
  lightAngle: 24,
  darkness: 0,
  rim: 16,
  fluidBright: 36,
  fluidSpeed: 80,
  fluidScale: 24,
  fluidAuraWidth: 8,
  fluidCenter: 32,
  auroraFlow: 100,
  hoverBright: 264,
  lightTrack: 100,
  clickWave: 100,
};

export const SWITCH_ON_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 2,
  thickness: 8,
  bevelWidth: 2,
  frost: 16,
  dispersion: 80,
  sheen: 40,
  lightAngle: 24,
  darkness: 0,
  rim: 48,
  fluidBright: 48,
  fluidSpeed: 80,
  fluidScale: 16,
  fluidAuraWidth: 12,
  fluidCenter: 0,
  auroraFlow: 0,
  hoverBright: 256,
  lightTrack: 100,
  clickWave: 96,
};

export const SWITCH_OFF_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 72,
  thickness: 16,
  bevelWidth: 4,
  frost: 80,
  dispersion: 0,
  sheen: 16,
  lightAngle: 24,
  darkness: 24,
  rim: 40,
  fluidBright: 32,
  fluidSpeed: 0,
  fluidScale: 4,
  fluidAuraWidth: 32,
  fluidCenter: 96,
  auroraFlow: 0,
  hoverBright: 144,
  lightTrack: 100,
  clickWave: 96,
};

export const TABS_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 2,
  thickness: 8,
  bevelWidth: 2,
  frost: 8,
  dispersion: 80,
  sheen: 24,
  lightAngle: 24,
  darkness: 0,
  rim: 48,
  fluidBright: 40,
  fluidSpeed: 80,
  fluidScale: 8,
  fluidAuraWidth: 12,
  fluidCenter: 0,
  auroraFlow: 64,
  hoverBright: 256,
  lightTrack: 100,
  clickWave: 96,
};

export const CARD_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 88,
  thickness: 88,
  bevelWidth: 8,
  frost: 24,
  dispersion: 96,
  sheen: 24,
  lightAngle: 24,
  darkness: 8,
  rim: 24,
  fluidBright: 32,
  fluidSpeed: 88,
  fluidScale: 56,
  fluidAuraWidth: 28,
  fluidCenter: 0,
  auroraFlow: 100,
  hoverBright: 200,
  lightTrack: 100,
  clickWave: 96,
};

export const PROMPT_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 88,
  thickness: 72,
  bevelWidth: 3,
  frost: 4,
  dispersion: 96,
  sheen: 12,
  lightAngle: 24,
  darkness: 0,
  rim: 16,
  fluidBright: 24,
  fluidSpeed: 64,
  fluidScale: 16,
  fluidAuraWidth: 16,
  fluidCenter: 0,
  auroraFlow: 100,
  hoverBright: 200,
  lightTrack: 100,
  clickWave: 96,
};

export const HEADING_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 80,
  thickness: 48,
  bevelWidth: 2,
  frost: 40,
  dispersion: 80,
  sheen: 24,
  lightAngle: 24,
  angle: 24,
  darkness: 0,
  rim: 16,
  fluidBright: 80,
  fluidSpeed: 80,
  fluidScale: 8,
  fluidAuraWidth: 2,
  fluidCenter: 8,
  auroraFlow: 0,
  hoverBright: 96,
  lightTrack: 100,
  clickWave: 96,
};

export const AUDIO_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 88,
  thickness: 88,
  bevelWidth: 8,
  frost: 4,
  dispersion: 96,
  sheen: 16,
  lightAngle: 24,
  angle: 24,
  darkness: 0,
  rim: 16,
  fluidBright: 24,
  fluidSpeed: 64,
  fluidScale: 48,
  fluidAuraWidth: 40,
  fluidCenter: 32,
  auroraFlow: 100,
  hoverBright: 144,
  lightTrack: 100,
  clickWave: 96,
};

export const BACKGROUND_DEFAULT_PARAMS: Omit<TactileGlassParams, "radius"> = {
  refraction: 80,
  thickness: 88,
  bevelWidth: 0,
  frost: 0,
  dispersion: 96,
  sheen: 0,
  lightAngle: 0,
  angle: 0,
  darkness: 0,
  rim: 0,
  fluidBright: 12,
  fluidSpeed: 40,
  fluidScale: 48,
  fluidAuraWidth: 64,
  fluidCenter: 12,
  auroraFlow: 100,
  hoverBright: 128,
  lightTrack: 100,
  clickWave: 56,
};

export const VERTEX_SHADER = `#version 300 es
  in vec2 a_pos;
  out vec2 v_uv;
  void main() {
    v_uv = (a_pos + 1.0) * 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = `#version 300 es
  precision highp float;
  in vec2 v_uv;
  out vec4 fragColor;

  uniform vec2 u_resolution;
  uniform sampler2D u_src;
  uniform float u_srcComposite;
  uniform sampler2D u_textMask;
  uniform float u_isText;
  uniform float u_isAudioDeck;
  uniform vec4 u_switchThumb;
  uniform vec4 u_rect;
  uniform float u_radius;
  uniform float u_useBackdrop;
  uniform vec4 u_tilt;
  uniform vec3 u_bgColor;

  // Glass optic parameters
  uniform float u_refraction;
  uniform float u_thickness;
  uniform float u_bevelWidth;
  uniform float u_frost;
  uniform float u_dispersion;
  uniform float u_sheen;
  uniform float u_lightAngle;
  uniform float u_darkness;
  uniform float u_rim;
  uniform float u_time;

  // Fluid caustic uniforms
  uniform float u_fluidBright;
  uniform float u_fluidSpeed;
  uniform float u_fluidScale;
  uniform float u_fluidAuraWidth;
  uniform float u_fluidCenter;
  uniform float u_auroraFlow;

  // Interactivity uniforms
  uniform vec2 u_mousePos;
  uniform float u_hoverStrength;
  uniform float u_lightTrack;
  uniform float u_hoverBright;
  uniform vec2 u_clickPos;
  uniform float u_clickTime;
  uniform float u_clickWave;


  float smax(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return max(a, b) + h * h * k * 0.25;
  }

  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    vec2 u = max(-q, 0.0);
    float inner = -(u.x * u.y) / max(length(u), 1e-4);
    return inner + length(max(q, 0.0)) - r;
  }

  float opSmoothUnion(float d1, float d2, float k) {
    vec2 u = max(vec2(k - d1, k - d2), vec2(0.0));
    return max(k, min(d1, d2)) - length(u);
  }

  float sdAudioDeck(vec2 p, vec2 b, float r) {
    float s = b.x / 240.0;
    float dCard = sdRoundRect(p, b, r);
    float dPlay = length(p - vec2(0.0, -b.y)) - 40.0 * s;
    float dPrev = length(p - vec2(-64.0 * s, -b.y)) - 28.0 * s;
    float dNext = length(p - vec2(64.0 * s, -b.y)) - 28.0 * s;
    float dBridge = length(p - vec2(clamp(p.x, -64.0 * s, 64.0 * s), -b.y)) - 9.0 * s;
    float dBtns = opSmoothUnion(opSmoothUnion(dPlay, min(dPrev, dNext), 2.0 * s), dBridge, 2.0 * s);
    return opSmoothUnion(dCard, dBtns, 2.0 * s);
  }

  float evalLensSDF(vec2 p, vec2 b, float r) {
    if (u_isAudioDeck > 0.5) {
      return sdAudioDeck(p, b, r);
    }
    return sdRoundRect(p, b, r);
  }

  // Domain-Warped Silky Fluid Caustic Field (Deep S-curls, soft rounded crests, zero straight sticks or grid tears)
  float getCausticWave(vec2 p, float t, float frostAmt, float dispOffset) {
    p *= 0.95;

    // 1. Primary S-curve vortex warp (tight enough to curve visibly inside edge auras)
    float w1 = sin(p.x * 1.85 + p.y * 0.55 + t * 0.62) * 0.62 +
               cos(p.y * 1.95 - p.x * 0.65 - t * 0.48) * 0.58;
    vec2 pWarp = p + vec2(
      cos(w1 * 2.25 + p.y * 1.15 + t * 0.45),
      sin(w1 * 2.25 - p.x * 1.15 - t * 0.35)
    ) * 0.56;

    // 2. Secondary swirl modulation so waves bend into flowing S-ribbons instead of straight sticks or square grids
    float swirl = sin(pWarp.y * 1.75 - pWarp.x * 1.25 + t * 0.52) * 0.75;
    float w2 = sin(pWarp.x * 2.05 + pWarp.y * 1.35 - t * 0.58 + swirl) * 0.58 +
               cos(pWarp.y * 2.30 - pWarp.x * 0.95 + t * 0.50 - swirl * 0.6) * 0.42;

    float w2_disp = w2 + dispOffset;
    // Intrinsic optical softness (0.022) eliminates hard laser "sticks" and prevents razor tears on refracted text
    float wAbs = sqrt(w2_disp * w2_disp + 0.022 + frostAmt * frostAmt * 0.045);
    float width = 0.11 + frostAmt * 0.16;
    float ridge = width / (pow(wAbs, 1.50) + width);
    float halo = exp(-wAbs * 1.65) * 0.50;
    return ridge * 0.68 + halo;
  }

  // Interactively warps fluid coordinate field based on cursor presence and click splash
  vec2 warpFluid(vec2 p, vec2 pSurf, vec2 mouseNorm, float hoverAmt, vec2 clickNorm, float clickDt, float clickAmt) {
    // 1. Smooth fingertip displacement: zero displacement at exact touch point, smooth outward swell
    if (hoverAmt > 0.001) {
      vec2 dMouse = pSurf - mouseNorm;
      float rMouse = length(dMouse);
      float radius = 0.90;
      float mouseInf = smoothstep(radius, 0.0, rMouse);
      
      vec2 push = dMouse * (mouseInf * 0.70);
      vec2 swirl = vec2(-dMouse.y, dMouse.x) * (mouseInf * 0.45);
      
      p += (push + swirl) * hoverAmt;
    }
    
    // 2. Click impulse: physical liquid undulation / splash wave expanding from tap point
    if (clickAmt > 0.001 && clickDt >= 0.0 && clickDt < 0.90) {
      vec2 dClick = pSurf - clickNorm;
      float rClick = length(dClick);
      float waveSpeed = 2.8;
      float waveFront = clickDt * waveSpeed;
      float waveWidth = 0.35 + clickDt * 0.30;
      float ring = smoothstep(waveWidth, 0.0, abs(rClick - waveFront));
      float decay = (1.0 - clickDt / 0.90) * exp(-clickDt * 2.2);
      
      vec2 waveDir = rClick > 1e-4 ? dClick / rClick : vec2(0.0);
      float splashDisplacement = ring * sin((rClick - waveFront) * 7.5) * decay * (clickAmt * 0.50);
      p += waveDir * splashDisplacement;
    }
    
    return p;
  }

  float getFluidExcitation(vec2 pSurf, vec2 mouseNorm, float hoverAmt, float hoverBright, vec2 clickNorm, float clickDt, float clickAmt) {
    float glow = 0.0;
    float brightScale = hoverBright * 0.01;
    
    // Faint bioluminescent / caustic awakening directly under the finger
    if (hoverAmt > 0.001) {
      float rMouse = length(pSurf - mouseNorm);
      float mouseInf = smoothstep(0.85, 0.0, rMouse);
      glow += mouseInf * hoverAmt * (brightScale * 0.45);
    }
    
    // Fluid splash glow expanding with the liquid wave
    if (clickAmt > 0.001 && clickDt >= 0.0 && clickDt < 0.90) {
      float rClick = length(pSurf - clickNorm);
      float waveFront = clickDt * 2.8;
      float waveWidth = 0.35 + clickDt * 0.30;
      float ring = smoothstep(waveWidth, 0.0, abs(rClick - waveFront));
      float decay = (1.0 - clickDt / 0.90) * exp(-clickDt * 2.2);
      glow += ring * decay * clickAmt * (brightScale * 0.70);
    }
    
    return glow;
  }

  vec4 sampleBackdropRGBA(vec2 uv) {
    if (u_srcComposite < -0.5) {
      return vec4(0.0);
    }
    vec2 uvSafe = 1.0 - abs(1.0 - abs(uv));
    if (u_srcComposite > 1.5) {
      vec4 s = texture(u_src, vec2(uvSafe.x, 1.0 - uvSafe.y));
      return vec4(s.rgb * s.a, s.a);
    }
    if (u_srcComposite > 0.5) {
      vec4 s = texture(u_src, uvSafe);
      return vec4(s.rgb + u_bgColor * (1.0 - s.a), 1.0);
    }
    vec2 uvTex = vec2(uvSafe.x, 1.0 - uvSafe.y);
    return vec4(mix(u_bgColor, vec3(1.0), texture(u_src, uvTex).a), 1.0);
  }

  vec4 sampleFrostedRGBA(vec2 uv, float frostAmt) {
    if (u_srcComposite < -0.5) {
      return vec4(0.0);
    }
    vec4 centerCol = sampleBackdropRGBA(uv);
    if (frostAmt <= 0.01) return centerCol;

    // Real GPU Frosted Glass Diffusion (Golden-Angle Fermat Spiral Blur)
    vec2 texel = 1.0 / u_resolution;
    float radius = frostAmt * 40.0;
    
    vec4 accumCol = centerCol * 0.20;
    float totalW = 0.20;

    for (int i = 1; i <= 10; i++) {
      float fi = float(i);
      float r = sqrt(fi / 10.0) * radius;
      float theta = fi * 2.3999632;
      vec2 offset = vec2(cos(theta), sin(theta)) * r * texel;
      
      float w = exp(-0.5 * (r * r) / max(radius * radius * 0.4, 1.0));
      accumCol += sampleBackdropRGBA(uv + offset) * w;
      totalW += w;
    }

    return accumCol / totalW;
  }

  vec4 renderSingleGlassLens(vec2 screenPx, vec4 rect, float radius, bool isThumb, out float outBaseAlpha) {
    outBaseAlpha = 1.0;
    vec2 center = rect.xy + rect.zw * 0.5;
    vec2 localPx = screenPx - center;
    vec2 halfSize = rect.zw * 0.5;

    // Interactive 3D Perspective Raycast projection for tilted surfaces
    if (!isThumb && u_tilt.w > 0.5) {
      float d = u_tilt.w;
      float rx = u_tilt.x;
      float ry = u_tilt.y;
      float sc = max(u_tilt.z, 0.001);

      float cosX = cos(rx), sinX = sin(rx);
      float cosY = cos(ry), sinY = sin(ry);

      // Plane normal in CSS 3D camera coordinates (Rotate around Y then around X)
      vec3 N = vec3(sinY, -cosY * sinX, cosY * cosX);

      // WebGL localPx has Y up, CSS 3D camera has Y down
      vec3 V = vec3(localPx.x, -localPx.y, -d);
      float denom = dot(V, N);
      if (abs(denom) > 1e-5) {
        float tHit = (-d * N.z) / denom;
        vec3 P = vec3(tHit * V.x, tHit * V.y, d * (1.0 - tHit));

        // Inverse RotateX (by -rx)
        vec3 P1 = vec3(P.x, P.y * cosX + P.z * sinX, -P.y * sinX + P.z * cosX);
        // Inverse RotateY (by -ry)
        vec3 P0 = vec3(P1.x * cosY - P1.z * sinY, P1.y, P1.x * sinY + P1.z * cosY);

        // Scale and convert back to WebGL localPx (Y up)
        localPx = vec2(P0.x, -P0.y) / sc;
      }
    }

    float coverage = 0.0;
    vec2 norm = vec2(0.0);
    float distIn = 0.0;

    if (u_isText > 0.5) {
      vec2 textUV = (screenPx - rect.xy) / rect.zw;
      if (textUV.x < 0.0 || textUV.x > 1.0 || textUV.y < 0.0 || textUV.y > 1.0) {
        return vec4(0.0);
      }
      vec2 maskUV = vec2(textUV.x, 1.0 - textUV.y);
      vec4 tData = texture(u_textMask, maskUV);
      coverage = tData.a;
      if (coverage <= 0.005) return vec4(0.0);

      distIn = tData.r * 32.0;

      // 32-bit floating point continuous normal from GPU hardware bilinear central difference
      vec2 texel = 1.0 / rect.zw;
      vec2 step = texel * 1.5;
      float d_r  = texture(u_textMask, maskUV + vec2(step.x, 0.0)).r;
      float d_l  = texture(u_textMask, maskUV - vec2(step.x, 0.0)).r;
      float d_t  = texture(u_textMask, maskUV + vec2(0.0, step.y)).r;
      float d_b  = texture(u_textMask, maskUV - vec2(0.0, step.y)).r;
      float d_tr = texture(u_textMask, maskUV + vec2(step.x, step.y)).r;
      float d_tl = texture(u_textMask, maskUV + vec2(-step.x, step.y)).r;
      float d_br = texture(u_textMask, maskUV + vec2(step.x, -step.y)).r;
      float d_bl = texture(u_textMask, maskUV + vec2(-step.x, -step.y)).r;

      float dx = -( (d_tr + 2.0 * d_r + d_br) - (d_tl + 2.0 * d_l + d_bl) );
      float dy = -( (d_tr + 2.0 * d_t + d_tl) - (d_br + 2.0 * d_b + d_bl) );

      norm = vec2(dx, dy);
      float nLen = length(norm);
      if (nLen > 1e-4) norm /= nLen;
      else norm = vec2(0.0);

      // Smooth 3D dome profile: 2D normal tilt smoothly decays to 0 at the top of the bevel/apex,
      // completely eliminating medial axis crease lines, harsh step cliffs, and rectangular offset cutouts!
      float bVal = max(u_bevelWidth, 0.5);
      float strokeRad = max(bVal * 1.2, 4.0);
      float domeTilt = cos(clamp(distIn / strokeRad, 0.0, 1.0) * 1.5707963);
      norm *= domeTilt;
    } else if (isThumb) {
      float sdf = length(localPx) - radius;
      coverage = 1.0 - smoothstep(-0.75, 0.75, sdf);
      if (coverage <= 0.0) return vec4(0.0);
      float rLen = length(localPx);
      norm = rLen > 1e-4 ? localPx / rLen : vec2(0.0, 1.0);
      distIn = -sdf;
    } else {
      float effRad = min(radius, min(halfSize.x, halfSize.y));
      float sdf = evalLensSDF(localPx, halfSize, effRad);
      coverage = 1.0 - smoothstep(-0.75, 0.75, sdf);
      if (coverage <= 0.0) return vec4(0.0);

      // Analytical Normal from smooth SDF for outer border & bevel
      float eps = 1.0;
      float dx = evalLensSDF(localPx + vec2(eps, 0.0), halfSize, effRad) -
                 evalLensSDF(localPx - vec2(eps, 0.0), halfSize, effRad);
      float dy = evalLensSDF(localPx + vec2(0.0, eps), halfSize, effRad) -
                 evalLensSDF(localPx - vec2(0.0, eps), halfSize, effRad);
      float gLen = length(vec2(dx, dy));
      norm = gLen > 1e-4 ? vec2(dx, dy) / gLen : vec2(0.0);

      distIn = -sdf;
    }

    bool isFullBleed = (!isThumb && u_isText < 0.5 && radius <= 0.01 && u_bevelWidth <= 0.01);
    if (isFullBleed) {
      coverage = 1.0;
    }

    // 1. Edge Bevel Refraction strictly on perimeter (distIn < bWidthVal)
    float bWidthVal = max(u_bevelWidth, 0.5);
    float bevelSlope = 0.0;
    if (u_bevelWidth > 0.01 && distIn < bWidthVal) {
      float t = distIn / bWidthVal;
      bevelSlope = (1.0 - t) / max(sqrt(max(1.0 - (1.0 - t) * (1.0 - t), 0.001)), 0.15) * clamp(u_bevelWidth, 0.0, 1.0);
    }
    float edgeTaper = isFullBleed ? 1.0 : smoothstep(0.0, 1.8, distIn);
    float thicknessScale = 0.35 + (u_thickness * 0.01) * 1.3;
    float bevelRefr = (u_refraction * 0.001) * thicknessScale;
    vec2 dispBevel = norm * (bevelSlope * 0.85 * bevelRefr);
    if (u_isText > 0.5) {
      float bRad = max(u_bevelWidth * 1.2, 4.0);
      float t = clamp(distIn / bRad, 0.0, 1.0);
      bevelSlope = (1.0 - t) / max(sqrt(max(1.0 - (1.0 - t) * (1.0 - t), 0.001)), 0.2) * clamp(u_bevelWidth * 0.4 + 0.6, 0.0, 1.5);
      dispBevel = norm * (bevelSlope * 0.85 * bevelRefr);
    } else if (u_isAudioDeck > 0.5) {
      // Subtle molded-glass refraction along the outer Boolean union arc of the transport buttons
      float s = halfSize.x / 240.0;
      vec2 pPlay = localPx - vec2(0.0, -halfSize.y);
      vec2 pPrev = localPx - vec2(-64.0 * s, -halfSize.y);
      vec2 pNext = localPx - vec2(64.0 * s, -halfSize.y);
      float dPlay = length(pPlay) - 40.0 * s;
      float dPrev = length(pPrev) - 28.0 * s;
      float dNext = length(pNext) - 28.0 * s;
      float dSec = min(dPrev, dNext);
      vec2 nPlay = length(pPlay) > 1e-4 ? pPlay / length(pPlay) : vec2(0.0, 1.0);
      vec2 nSec = dPrev < dNext
        ? (length(pPrev) > 1e-4 ? pPrev / length(pPrev) : vec2(0.0, 1.0))
        : (length(pNext) > 1e-4 ? pNext / length(pNext) : vec2(0.0, 1.0));
      float innerTransition = smoothstep(1.5 * s, bWidthVal, distIn);
      float playMask = smoothstep(1.0 * s, 5.0 * s, distIn + dPlay) * smoothstep(0.0, 4.0 * s, dSec) * innerTransition;
      float secMask = smoothstep(1.0 * s, 5.0 * s, distIn + dSec) * smoothstep(0.0, 4.0 * s, dPlay) * innerTransition;
      float playEdge = smoothstep(-1.0 * s, 1.0 * s, -dPlay) * exp(-max(-dPlay, 0.0) / (3.2 * s)) * playMask;
      float secEdge = smoothstep(-1.0 * s, 1.0 * s, -dSec) * exp(-max(-dSec, 0.0) / (2.8 * s)) * secMask;
      dispBevel += (nPlay * playEdge * 0.45 + nSec * secEdge * 0.35) * bevelRefr;
    } else if (u_switchThumb.z > 0.5 && u_switchThumb.w > 0.5) {
      vec2 pThumb = localPx - u_switchThumb.xy;
      vec2 halfThumb = u_switchThumb.zw;
      float capRad = min(halfThumb.x, halfThumb.y);
      float segHalf = max(halfThumb.x - capRad, 0.0);
      vec2 qExact = vec2(pThumb.x - clamp(pThumb.x, -segHalf, segHalf), pThumb.y);
      float dThumb = length(qExact) - capRad;
      if (dThumb < 2.0) {
        vec2 pNorm = qExact / max(capRad, 1.0);
        float r2 = clamp(dot(pNorm, pNorm), 0.0, 1.0);
        float thumbTaper = smoothstep(-0.75, 0.75, -dThumb);
        float thumbBevel = pow(r2, mix(2.0, 0.8, clamp(u_bevelWidth / 15.0, 0.0, 1.0)));
        dispBevel += pNorm * (thumbBevel * 0.65 * bevelRefr * thumbTaper);
      }
    }
    float contourFactor = (1.0 - smoothstep(0.0, bWidthVal * 1.25, distIn)) * clamp(u_bevelWidth, 0.0, 1.0);

    // 2. Liquid Surface & Dome Refraction across element body (100% continuous, zero creases, zero ovals)
    float btnHeight = max(halfSize.y * 2.0, 1.0);
    float frostVal = u_frost * 0.01;
    float fluidT = u_time * (u_fluidSpeed * 0.01);
    float fluidSc = 0.40 + u_fluidScale * 0.04;

    vec2 localMouse = isThumb ? (u_mousePos - u_switchThumb.xy) : u_mousePos;
    vec2 localClick = isThumb ? (u_clickPos - u_switchThumb.xy) : u_clickPos;
    vec2 pPhys = (localPx / btnHeight) * 1.15;
    vec2 mouseNorm = (localMouse / btnHeight) * 1.15;
    vec2 clickNorm = (localClick / btnHeight) * 1.15;
    float fluidPull = u_hoverStrength * (u_lightTrack * 0.01);
    float hoverGlow = u_hoverStrength;
    float clickAmt = u_clickWave * 0.01;
    float clickDt = u_time - u_clickTime;

    // Physical surface coordinate on the button (unrefracted by glass)
    vec2 pSurf = (localPx / btnHeight) * fluidSc;
    vec2 pSurf_warped = warpFluid(pSurf, pPhys, mouseNorm, fluidPull, clickNorm, clickDt, clickAmt);

    // Dynamic 2D isotropic fluid gradient refraction: wave crests naturally refract light in 2D
    float epsF = 0.04;
    float gradFrost = max(frostVal, 0.28);
    float fDx = getCausticWave(pSurf_warped + vec2(epsF, 0.0), fluidT, gradFrost, 0.0) -
                getCausticWave(pSurf_warped - vec2(epsF, 0.0), fluidT, gradFrost, 0.0);
    float fDy = getCausticWave(pSurf_warped + vec2(0.0, epsF), fluidT, gradFrost, 0.0) -
                getCausticWave(pSurf_warped - vec2(0.0, epsF), fluidT, gradFrost, 0.0);
    vec2 fluidGrad = vec2(fDx, fDy) / (2.0 * epsF);
    fluidGrad /= (1.0 + length(fluidGrad) * 0.22);

    // Smooth exponential rim aura decay: tight, seamless falloff hugging the bevel chamfer
    // Tightly confined to the bevel edge, with delicate exponential fade onto the immediate perimeter (2-4px)
    float rimDist = max(distIn - bWidthVal, 0.0);
    float auraWidth = max(u_fluidAuraWidth, 1.0);
    float auraDecay = exp(-rimDist / max(auraWidth * 0.65, 0.75)) * (1.0 - smoothstep(0.0, auraWidth * 2.0, rimDist));
    float fluidPresence = max(contourFactor, auraDecay);

    // Liquid refraction ripples are focused strictly where fluid is present (bevel + aura)
    // The central core remains 100% pure optical dome magnification without soapy fluid turbulence!
    float centerFluidFactor = clamp(u_fluidCenter * 0.01, 0.0, 1.0);
    float refrFluidWeight = mix(centerFluidFactor, 1.0, fluidPresence);

    float fluidBend = (u_refraction * 0.0004) * (0.35 + (u_thickness * 0.01) * 0.95);
    vec2 dispFluid = fluidGrad * (fluidBend * refrFluidWeight);

    // Gentle isotropic convex glass magnification (smooth C-infinity dome profile)
    vec2 dispDome = vec2(0.0);
    float domeBend = (u_thickness * 0.00015) * (u_refraction * 0.01);
    if (u_isText > 0.5) {
      dispDome = -norm * (domeBend * 3.5);
    } else {
      vec2 pIso = localPx / (halfSize.y * 1.5);
      float domeProfile = 1.0 / (1.0 + dot(pIso, pIso) * 0.35);
      dispDome = -pIso * (domeProfile * domeBend);
    }

    // Total displacement: strictly tapered to zero at boundary
    vec2 disp = (dispBevel + dispFluid + dispDome) * edgeTaper;

    // Prismatic dispersion spread factor on the bevel chamfer and perimeter
    float dispSpread = (u_dispersion * 0.01) * (contourFactor * 0.85 + 0.15);

    // 3. Chromatic Background Refraction (smooth spectral split without negative delta)
    vec4 bgSample = sampleFrostedRGBA(v_uv - disp, frostVal);
    vec3 bgSpectral = bgSample.rgb;
    float bgAlpha = bgSample.a;

    if (dispSpread > 0.0005 && bgAlpha > 0.001) {
      vec2 dR = disp * (1.0 - dispSpread * 0.85);
      vec2 dY = disp * (1.0 - dispSpread * 0.40);
      vec2 dC = disp * (1.0 + dispSpread * 0.40);
      vec2 dB = disp * (1.0 + dispSpread * 0.85);

      vec4 sR_bg = sampleFrostedRGBA(v_uv - dR, frostVal);
      vec4 sY_bg = sampleFrostedRGBA(v_uv - dY, frostVal);
      vec4 sC_bg = sampleFrostedRGBA(v_uv - dC, frostVal);
      vec4 sB_bg = sampleFrostedRGBA(v_uv - dB, frostVal);

      float rEdge = sR_bg.r * 0.60 + sY_bg.r * 0.40;
      float gEdge = sY_bg.g * 0.35 + bgSample.g * 0.30 + sC_bg.g * 0.35;
      float bEdge = sC_bg.b * 0.40 + sB_bg.b * 0.60;
      bgSpectral = vec3(rEdge, gEdge, bEdge);
      bgAlpha = (sR_bg.a + sY_bg.a + bgSample.a + sC_bg.a + sB_bg.a) * 0.20;
    }

    vec2 hitPxG = (v_uv - (dispBevel + dispDome + dispFluid * 0.25) * edgeTaper) * u_resolution;

    // Interactive fluid coordinate for the element body
    vec2 pG_raw = (hitPxG - center) / btnHeight * fluidSc;
    vec2 pG_warped = warpFluid(pG_raw, pPhys, mouseNorm, fluidPull, clickNorm, clickDt, clickAmt);
    
    // Pure fluid caustic field
    float fG_body = getCausticWave(pG_warped, fluidT, frostVal, 0.0);

    // Dynamic polar border beam orbiting the perimeter (for buttons and prompt box)
    float beamSpeed = u_fluidSpeed * 0.015;
    float aspect = halfSize.x / max(halfSize.y, 1.0);
    float theta = atan(localPx.y * aspect, localPx.x);
    float beamPhase = theta - u_time * beamSpeed;

    // Smooth traveling wave along the rim
    // Dynamic comet crest that sweeps along the border beam
    float cosB = cos(beamPhase);
    float beamHead = pow(clamp(cosB * 0.5 + 0.5, 0.0, 1.0), 3.5);
    float beamGlow = pow(clamp(cosB * 0.5 + 0.5, 0.0, 1.0), 1.8) * 0.35;
    float beamProfile = beamHead * 1.5 + beamGlow;
    float flowAmt = clamp(u_auroraFlow * 0.01, 0.0, 1.0);
    float flowMod = mix(1.0, beamProfile * 1.4 + 0.08, flowAmt);

    // Dynamic rainbow polar aurora chromatic phase (border beam style)
    // Seamless 2pi-periodic spectrum without branch-cut seams across the negative X axis
    vec3 polarRainbow = 0.55 + 0.45 * cos(beamPhase + vec3(0.0, 2.0944, 4.1888));
    vec3 auroraColor = polarRainbow;

    if (u_isText > 0.5) {
      // Smooth continuous spectral gradient across the word with slow organic breathing drift
      float xSpan = (localPx.x / max(halfSize.x, 1.0)) * 0.5 + 0.5;
      float slowDrift = u_time * (u_fluidSpeed * 0.0035);
      float textPhase = xSpan * 3.14159265 * 1.35 + slowDrift;
      auroraColor = 0.55 + 0.45 * cos(textPhase + vec3(0.0, 2.0944, 4.1888));

      // Organic liquid caustic shimmer: gentle luminous wave breathing through the living fluid
      float waveShimmer = 0.82 + 0.28 * cos(xSpan * 4.71239 - u_time * (u_fluidSpeed * 0.008));
      flowMod = mix(1.0, waveShimmer * 1.25, flowAmt);
    }

    // Edge fluid mask (confined to bevel & tight edge aura; Center Clarity drives pure colorless refraction on panels)
    float edgeFluidMask = fluidPresence * flowMod;
    float fluidMask = u_isText > 0.5 ? mix(centerFluidFactor, 1.0, edgeFluidMask) : edgeFluidMask;

    float dispFactor = clamp(u_dispersion * 0.01, 0.0, 1.0);
    vec3 causticTint = mix(vec3(1.0), auroraColor, dispFactor);

    // Fluid illumination on the glass rim
    float fluidGlow = getFluidExcitation(pPhys, mouseNorm, hoverGlow, u_hoverBright, clickNorm, clickDt, clickAmt);
    if (u_isText > 0.5 && hoverGlow > 0.001) {
      // For typography: bathe the entire word in luminous caustic glow, with gentle focus on the cursor
      float xDist = abs(pPhys.x - mouseNorm.x);
      float textHoverFalloff = exp(-xDist * 0.5);
      float wordAmbientHover = hoverGlow * (u_hoverBright * 0.01) * 0.45;
      fluidGlow = max(fluidGlow, wordAmbientHover * (0.60 + 0.40 * textHoverFalloff));
    }
    float fluidEdgeFade = isFullBleed ? 1.0 : smoothstep(0.0, 1.8, distIn);
    float causticBrightScale = (u_fluidBright * 0.01) + fluidGlow;
    float totalFluidFactor = causticBrightScale * fluidEdgeFade * fluidMask;

    // Caustic highlight: monochromatic wave modulated by iridescent aurora tint
    vec3 causticEmission = causticTint * (fG_body * totalFluidFactor * edgeTaper);
    if (dispSpread > 0.0005) {
      vec3 prismAccent = 0.55 + 0.45 * cos(beamPhase * 2.0 + vec3(0.0, 2.0944, 4.1888));
      causticEmission += (prismAccent - 0.45) * (fG_body * totalFluidFactor * edgeTaper * clamp(u_dispersion * 0.012, 0.0, 1.0) * (1.0 + contourFactor * 1.5));
    }

    // Smoked Glass Absorption Tint (obsidian glass)
    float absorptionScale = 0.5 + (u_thickness * 0.01) * 0.8;
    float darkFactor = clamp((u_darkness * 0.01) * absorptionScale, 0.0, 0.95);
    float bevelThickness = 1.0 - bevelSlope * 0.35;
    float darkAtten = darkFactor * bevelThickness * 0.85;
    vec3 obsidianTint = u_bgColor * 0.45;

    // Clean, crisp achromatic specular gleam strictly on the contour facing light
    vec2 lightDir2D = vec2(cos(u_lightAngle), sin(u_lightAngle));
    float lightAlign = dot(norm, lightDir2D);

    float textFade = u_isText > 0.5 ? smoothstep(0.08, 0.85, coverage) : 1.0;
    float bevelPeak = smoothstep(0.0, 1.0, distIn) * (1.0 - smoothstep(1.0, bWidthVal + 1.2, distIn)) * textFade;
    float mainGleam = pow(clamp(lightAlign, 0.0, 1.0), 16.0) * bevelPeak * (u_sheen * 0.01) * 1.5;
    float backGleam = pow(clamp(-lightAlign, 0.0, 1.0), 8.0) * bevelPeak * (u_rim * 0.01) * 0.7;
    float edgeRim = pow(clamp(1.0 - distIn / 2.5, 0.0, 1.0), 2.0) * edgeTaper * (0.35 + 0.5 * clamp(lightAlign * 0.5 + 0.5, 0.0, 1.0)) * (u_rim * 0.01) * 0.85 * textFade;

    if (u_isText > 0.5) {
      // Single continuous physical glass bevel highlight:
      // Organic exponential profile hugging the outer perimeter with zero double-contours or square cutouts
      float gleamWidth = max(u_bevelWidth * 1.4, 2.4);
      float gleamFalloff = exp(-distIn / gleamWidth) * edgeTaper * textFade;
      mainGleam = pow(clamp(lightAlign, 0.0, 1.0), 14.0) * gleamFalloff * (u_sheen * 0.01) * 1.8;
      backGleam = pow(clamp(-lightAlign, 0.0, 1.0), 7.0) * gleamFalloff * (u_rim * 0.01) * 0.75;
      edgeRim = pow(clamp(1.0 - distIn / max(u_bevelWidth * 1.6, 2.8), 0.0, 1.0), 1.6) * edgeTaper *
                (0.35 + 0.55 * clamp(lightAlign * 0.5 + 0.5, 0.0, 1.0)) * (u_rim * 0.01) * 0.85 * textFade;
    }

    // Prismatic chromatic sheen on the bevel gleam
    float prismAngle = dot(vec2(-norm.y, norm.x), lightDir2D);
    vec3 gleamColor = vec3(1.0);
    if (u_dispersion > 1.0) {
      float gleamDisp = (u_dispersion * 0.01) * 0.55;
      gleamColor = vec3(
        1.0 + prismAngle * gleamDisp * 0.65,
        1.0 - abs(prismAngle) * gleamDisp * 0.35,
        1.0 - prismAngle * gleamDisp * 0.65
      );
    }

    vec3 lensCol = vec3(0.0);
    if (u_srcComposite < -0.5 || u_srcComposite > 1.5) {
      float domTransparency = 1.0 - bgAlpha;
      float absorbAlpha = darkAtten * 0.75;
      outBaseAlpha = clamp(bgAlpha + absorbAlpha * domTransparency, 0.0, 1.0);

      vec3 baseCol = bgSpectral * (1.0 - absorbAlpha) + (u_bgColor * 0.35) * (absorbAlpha * domTransparency);
      vec3 opticalEmit = causticEmission * (1.0 - darkAtten * 0.65);

      if (u_isText > 0.5) {
        float bRad = max(u_bevelWidth * 1.2, 4.0);
        float strokeDome = cos(clamp(distIn / bRad, 0.0, 1.0) * 1.5707963);
        float glyphFresnel = (0.045 + 0.095 * strokeDome) * (0.45 + (u_refraction * 0.01) * 0.55) * (0.45 + frostVal * 0.55) * (1.0 - darkAtten * 0.7) * textFade;
        opticalEmit += mix(vec3(1.0), auroraColor, dispFactor * 0.40) * (glyphFresnel * domTransparency);
      } else if (!isFullBleed) {
        float bevelFresnel = contourFactor * (0.04 + (u_refraction * 0.01) * 0.06) * (0.5 + (u_thickness * 0.01) * 0.5) * edgeTaper;
        float frostVeil = (frostVal * 0.03 + (u_sheen * 0.01) * 0.012) * (1.0 - darkAtten * 0.7) * edgeTaper;
        opticalEmit += (vec3(bevelFresnel) * gleamColor + vec3(frostVeil)) * domTransparency;
      }

      lensCol = baseCol + opticalEmit + (mainGleam + backGleam) * gleamColor + vec3(edgeRim);
    } else {
      outBaseAlpha = 1.0;
      vec3 baseSample = bgSpectral + causticEmission;
      lensCol = mix(baseSample, obsidianTint, darkAtten);
      lensCol += (mainGleam + backGleam) * gleamColor + vec3(edgeRim);
    }

    if (u_isAudioDeck > 0.5) {
      // Convex molded-glass dome relief along the mutual Boolean union boundary of the transport buttons
      float s = halfSize.x / 240.0;
      vec2 pPlay = localPx - vec2(0.0, -halfSize.y);
      vec2 pPrev = localPx - vec2(-64.0 * s, -halfSize.y);
      vec2 pNext = localPx - vec2(64.0 * s, -halfSize.y);
      float rPlay = length(pPlay);
      float rPrev = length(pPrev);
      float rNext = length(pNext);
      float dPlay = rPlay - 40.0 * s;
      float dPrev = rPrev - 28.0 * s;
      float dNext = rNext - 28.0 * s;
      float dSec = min(dPrev, dNext);

      vec2 nPlay = rPlay > 1e-4 ? pPlay / rPlay : vec2(0.0, 1.0);
      vec2 nSec = dPrev < dNext
        ? (rPrev > 1e-4 ? pPrev / rPrev : vec2(0.0, 1.0))
        : (rNext > 1e-4 ? pNext / rNext : vec2(0.0, 1.0));

      float innerTransition = smoothstep(1.5 * s, bWidthVal, distIn);
      float playMask = smoothstep(1.0 * s, 5.0 * s, distIn + dPlay) * smoothstep(0.0, 4.0 * s, dSec) * innerTransition;
      float secMask = smoothstep(1.0 * s, 5.0 * s, distIn + dSec) * smoothstep(0.0, 4.0 * s, dPlay) * innerTransition;
      float distPlay = -dPlay;
      float distSec = -dSec;
      float playTaper = smoothstep(-0.8 * s, 0.8 * s, distPlay) * clamp(rPlay / (40.0 * s), 0.0, 1.0);
      float secTaper = smoothstep(-0.8 * s, 0.8 * s, distSec) * clamp(min(rPrev, rNext) / (28.0 * s), 0.0, 1.0);

      float playSheenProf = playTaper * (1.0 - smoothstep(1.0 * s, bWidthVal + 1.2 * s, max(distPlay, 0.0))) * playMask;
      float secSheenProf = secTaper * (1.0 - smoothstep(1.0 * s, bWidthVal * 0.85 + 1.2 * s, max(distSec, 0.0))) * secMask;
      float playRimProf = playTaper * pow(clamp(1.0 - max(distPlay, 0.0) / (2.5 * s), 0.0, 1.0), 2.0) * playMask;
      float secRimProf = secTaper * pow(clamp(1.0 - max(distSec, 0.0) / (2.2 * s), 0.0, 1.0), 2.0) * secMask;

      float alignPlay = dot(nPlay, lightDir2D);
      float alignSec = dot(nSec, lightDir2D);

      float playGleam = (pow(clamp(alignPlay, 0.0, 1.0), 8.0) * (u_sheen * 0.01) * 0.85 +
                         pow(clamp(-alignPlay, 0.0, 1.0), 6.0) * (u_rim * 0.01) * 0.35) * playSheenProf;
      float secGleam = (pow(clamp(alignSec, 0.0, 1.0), 8.0) * (u_sheen * 0.01) * 0.72 +
                        pow(clamp(-alignSec, 0.0, 1.0), 6.0) * (u_rim * 0.01) * 0.28) * secSheenProf;

      float playEdgeRim = playRimProf * (0.25 + 0.55 * clamp(alignPlay * 0.5 + 0.5, 0.0, 1.0)) * (u_rim * 0.01) * 0.48;
      float secEdgeRim = secRimProf * (0.22 + 0.50 * clamp(alignSec * 0.5 + 0.5, 0.0, 1.0)) * (u_rim * 0.01) * 0.40;

      vec2 nDome = dPlay < dSec ? nPlay : nSec;
      float domePrism = dot(vec2(-nDome.y, nDome.x), lightDir2D);
      vec3 domeGleamColor = vec3(1.0);
      if (u_dispersion > 1.0) {
        float gDisp = (u_dispersion * 0.01) * 0.55;
        domeGleamColor = vec3(
          1.0 + domePrism * gDisp * 0.65,
          1.0 - abs(domePrism) * gDisp * 0.35,
          1.0 - domePrism * gDisp * 0.65
        );
      }

      lensCol += (playGleam + secGleam) * domeGleamColor + vec3(playEdgeRim + secEdgeRim);
    }

    return vec4(lensCol, coverage);
  }

  vec4 renderGlassLens(vec2 screenPx, vec4 rect, float radius) {
    float baseAlpha = 1.0;
    vec4 lens = renderSingleGlassLens(screenPx, rect, radius, false, baseAlpha);
    if (u_switchThumb.z > 0.5 && u_switchThumb.w > 0.5 && lens.a > 0.0) {
      vec2 trackCenter = rect.xy + rect.zw * 0.5;
      vec2 thumbCenter = trackCenter + u_switchThumb.xy;
      vec2 halfThumb = u_switchThumb.zw;
      float capRad = min(halfThumb.x, halfThumb.y);
      float segHalf = max(halfThumb.x - capRad, 0.0);
      vec2 pThumb = screenPx - thumbCenter;
      vec2 qExact = vec2(pThumb.x - clamp(pThumb.x, -segHalf, segHalf), pThumb.y);
      float dThumb = length(qExact) - capRad;
      if (dThumb <= 2.0) {
        float distThumb = -dThumb;
        float thumbTaper = smoothstep(-0.75, 0.75, distThumb);

        // Normalized radial coordinates from capsule medial axis: r in [0, 1], r2 = r^2 in [0, 1]
        vec2 pNorm = qExact / max(capRad, 1.0);
        float r2 = clamp(dot(pNorm, pNorm), 0.0, 1.0);
        vec2 nThumb = length(qExact) > 1e-4 ? qExact / length(qExact) : vec2(0.0, 1.0);

        float frostVal = u_frost * 0.01;
        float sheenAmt = u_sheen * 0.01;
        float rimAmt = u_rim * 0.01;

        // Smooth C-infinity bevel cushion: flatter central plateau, gentler bevel closer to the perimeter
        float domeExp = mix(1.85, 0.85, clamp(u_bevelWidth / 15.0, 0.0, 1.0));
        float smoothDome = pow(r2, domeExp);
        float softEdge = pow(r2, 4.8);

        vec2 lightDir2D = vec2(cos(u_lightAngle), sin(u_lightAngle));
        float alignSmooth = dot(pNorm, lightDir2D);
        float alignEdge = dot(nThumb, lightDir2D);

        // Delicate 3D bevel lighting (less bulging/puffy, more refined flat-topped glass lens)
        float darkFade = 1.0 - clamp(u_darkness * 0.01, 0.0, 0.9);
        float primaryGlow = pow(clamp(alignSmooth * 0.5 + 0.5, 0.0, 1.0), 2.2) * sheenAmt * 0.28;
        float counterGlow = pow(clamp(-alignSmooth * 0.5 + 0.5, 0.0, 1.0), 2.4) * rimAmt * 0.20;
        float ambientDome = (sheenAmt * 0.09 + rimAmt * 0.09 + frostVal * 0.04) * darkFade;
        // Soft achromatic frosted glass base fill so the interior is evenly translucent
        float innerTranslucentFill = (0.05 + frostVal * 0.07 + sheenAmt * 0.04) * darkFade;
        float domeCushion = (primaryGlow + counterGlow + ambientDome) * smoothDome + innerTranslucentFill;

        // Delicate outer glass rim at r -> 1
        float dirRim = 0.45 + 0.55 * max(pow(clamp(alignEdge * 0.5 + 0.5, 0.0, 1.0), 2.2),
                                         pow(clamp(-alignEdge * 0.5 + 0.5, 0.0, 1.0), 2.2) * 0.85);
        float edgeHighlight = softEdge * dirRim * (rimAmt * 0.24 + sheenAmt * 0.12);

        // Subtle chromatic dispersion flare on the bevel (driven by Dispersion slider)
        float domePrism = dot(vec2(-pNorm.y, pNorm.x), lightDir2D);
        vec3 domeGleamColor = vec3(1.0);
        if (u_dispersion > 1.0) {
          float gDisp = (u_dispersion * 0.01) * 0.25;
          domeGleamColor = vec3(
            1.0 + domePrism * gDisp * 0.50,
            1.0 - abs(domePrism) * gDisp * 0.22,
            1.0 - domePrism * gDisp * 0.50
          );
        }

        // Purely additive optical glass dome over the transparent refracted capsule (zero opaque darkening!)
        lens.rgb += ((domeCushion + edgeHighlight) * domeGleamColor) * thumbTaper;
      }
    }
    if (u_srcComposite < -0.5 || u_srcComposite > 1.5) {
      float coverage = lens.a;
      vec3 clampedRGB = clamp(lens.rgb, 0.0, 1.0);
      float lightPeak = max(clampedRGB.r, max(clampedRGB.g, clampedRGB.b));
      float finalAlpha = clamp(baseAlpha + lightPeak * (1.0 - baseAlpha), 0.0, 1.0) * coverage;
      return vec4(clampedRGB * coverage, finalAlpha);
    }
    return vec4(lens.rgb * lens.a, lens.a);
  }

  void main() {
    if (u_useBackdrop > 0.5) {
      float a = texture(u_src, vec2(v_uv.x, 1.0 - v_uv.y)).a;
      fragColor = vec4(vec3(a), a);
      return;
    }
    vec2 screenPx = v_uv * u_resolution;
    fragColor = renderGlassLens(screenPx, u_rect, u_radius);
  }
`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("TactileGlassEngine: Shader compile error", gl.getShaderInfoLog(s));
  }
  return s;
}

function createGlassProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("TactileGlassEngine: Program link error", gl.getProgramInfoLog(prog));
  }
  return prog;
}

function parseCssColorToRGB(raw: string): [number, number, number] | null {
  const s = raw.trim();
  if (!s || s === "transparent") return null;
  if (s.startsWith("#")) {
    const hex = s.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255,
      ];
    }
    if (hex.length >= 6) {
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
      ];
    }
  }
  const m = s.match(/rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
  if (m) {
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (a <= 0.01) return null;
    return [
      Math.min(255, Math.max(0, parseFloat(m[1]))) / 255,
      Math.min(255, Math.max(0, parseFloat(m[2]))) / 255,
      Math.min(255, Math.max(0, parseFloat(m[3]))) / 255,
    ];
  }
  return null;
}

function resolveElementBgColor(el: HTMLElement | null): [number, number, number] {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    let cur: HTMLElement | null = el?.parentElement || document.body;
    while (cur) {
      const bg = window.getComputedStyle(cur).backgroundColor;
      const parsed = parseCssColorToRGB(bg);
      if (parsed) return parsed;
      cur = cur.parentElement;
    }
    const tokenBg = window.getComputedStyle(document.documentElement).getPropertyValue("--bg-canvas");
    const parsedToken = parseCssColorToRGB(tokenBg);
    if (parsedToken) return parsedToken;
  }
  return [0, 0, 0];
}

function edt1d(f: Float32Array, d: Float32Array, v: Int32Array, z: Float32Array, n: number) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

function edt2d(grid: Uint8Array, w: number, h: number): Float32Array {
  const INF = 1e9;
  const d = new Float32Array(w * h);
  const maxDim = Math.max(w, h);
  const f = new Float32Array(maxDim);
  const v = new Int32Array(maxDim);
  const z = new Float32Array(maxDim + 1);

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      f[y] = grid[y * w + x] ? INF : 0;
    }
    edt1d(f, f, v, z, h);
    for (let y = 0; y < h; y++) d[y * w + x] = f[y];
  }

  for (let y = 0; y < h; y++) {
    const rowOffset = y * w;
    for (let x = 0; x < w; x++) f[x] = d[rowOffset + x];
    edt1d(f, f, v, z, w);
    for (let x = 0; x < w; x++) d[rowOffset + x] = Math.sqrt(f[x]);
  }
  return d;
}

function buildTextMaskSDFData(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  text: string,
  font: string,
  letterSpacing: string,
  drawX: number,
  drawY: number
): Uint8ClampedArray {
  ctx.clearRect(0, 0, cw, ch);
  ctx.font = font;
  if ("letterSpacing" in ctx) {
    (ctx as any).letterSpacing = letterSpacing && letterSpacing !== "normal" ? letterSpacing : "0px";
  }
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, drawX, drawY);

  const imgData = ctx.getImageData(0, 0, cw, ch);
  const data = imgData.data;
  const len = cw * ch;
  const grid = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    grid[i] = data[i * 4 + 3] >= 128 ? 1 : 0;
  }

  const dist = edt2d(grid, cw, ch);
  const refinedDist = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const d = dist[i];
    const alpha = data[i * 4 + 3];
    if (alpha === 0) {
      refinedDist[i] = 0;
    } else if (d <= 2.0) {
      refinedDist[i] = Math.max(0, d - 1.0 + alpha / 255.0);
    } else {
      refinedDist[i] = d;
    }
  }

  const tempDist = new Float32Array(len);
  const smoothDist = new Float32Array(len);
  const k0 = 6.0 / 16.0, k1 = 4.0 / 16.0, k2 = 1.0 / 16.0;

  for (let y = 0; y < ch; y++) {
    const yOff = y * cw;
    for (let x = 0; x < cw; x++) {
      const xm2 = Math.max(0, x - 2);
      const xm1 = Math.max(0, x - 1);
      const xp1 = Math.min(cw - 1, x + 1);
      const xp2 = Math.min(cw - 1, x + 2);
      tempDist[yOff + x] =
        refinedDist[yOff + x] * k0 +
        (refinedDist[yOff + xm1] + refinedDist[yOff + xp1]) * k1 +
        (refinedDist[yOff + xm2] + refinedDist[yOff + xp2]) * k2;
    }
  }

  for (let y = 0; y < ch; y++) {
    const yOff = y * cw;
    const ym2 = Math.max(0, y - 2) * cw;
    const ym1 = Math.max(0, y - 1) * cw;
    const yp1 = Math.min(ch - 1, y + 1) * cw;
    const yp2 = Math.min(ch - 1, y + 2) * cw;
    for (let x = 0; x < cw; x++) {
      smoothDist[yOff + x] =
        tempDist[yOff + x] * k0 +
        (tempDist[ym1 + x] + tempDist[yp1 + x]) * k1 +
        (tempDist[ym2 + x] + tempDist[yp2 + x]) * k2;
    }
  }

  for (let i = 0; i < len; i++) {
    const pixelIdx = i * 4;
    const alpha = data[pixelIdx + 3];
    if (alpha === 0) {
      data[pixelIdx] = 0;
      data[pixelIdx + 1] = 0;
      data[pixelIdx + 2] = 0;
      data[pixelIdx + 3] = 0;
    } else {
      data[pixelIdx] = Math.min(255, Math.round(smoothDist[i] * 8.0));
      data[pixelIdx + 1] = 0;
      data[pixelIdx + 2] = 0;
    }
  }

  return data;
}

export class SharedCausticEngine {
  private glCanvas: HTMLCanvasElement | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private quadBuf: WebGLBuffer | null = null;
  private bgTexture: WebGLTexture | null = null;
  private compositeCanvas: HTMLCanvasElement | null = null;
  private compositeCtx: CanvasRenderingContext2D | null = null;
  private compositeTexture: WebGLTexture | null = null;
  private textMaskCanvas: HTMLCanvasElement | null = null;
  private textMaskCtx: CanvasRenderingContext2D | null = null;
  private textMaskTextures = new Map<string, { tex: WebGLTexture; key: string }>();

  // Uniform locations
  private uSrc: WebGLUniformLocation | null = null;
  private uSrcComposite: WebGLUniformLocation | null = null;
  private uTextMask: WebGLUniformLocation | null = null;
  private uIsText: WebGLUniformLocation | null = null;
  private uResolution: WebGLUniformLocation | null = null;
  private uRect: WebGLUniformLocation | null = null;
  private uRadius: WebGLUniformLocation | null = null;
  private uUseBackdrop: WebGLUniformLocation | null = null;
  private uTilt: WebGLUniformLocation | null = null;
  private uBgColor: WebGLUniformLocation | null = null;

  private uRefraction: WebGLUniformLocation | null = null;
  private uThickness: WebGLUniformLocation | null = null;
  private uBevelWidth: WebGLUniformLocation | null = null;
  private uFrost: WebGLUniformLocation | null = null;
  private uDispersion: WebGLUniformLocation | null = null;
  private uSheen: WebGLUniformLocation | null = null;
  private uLightAngle: WebGLUniformLocation | null = null;
  private uDarkness: WebGLUniformLocation | null = null;
  private uRim: WebGLUniformLocation | null = null;
  private uTime: WebGLUniformLocation | null = null;

  private uFluidBright: WebGLUniformLocation | null = null;
  private uFluidSpeed: WebGLUniformLocation | null = null;
  private uFluidScale: WebGLUniformLocation | null = null;
  private uFluidAuraWidth: WebGLUniformLocation | null = null;
  private uFluidCenter: WebGLUniformLocation | null = null;
  private uAuroraFlow: WebGLUniformLocation | null = null;

  private uMousePos: WebGLUniformLocation | null = null;
  private uHoverStrength: WebGLUniformLocation | null = null;
  private uLightTrack: WebGLUniformLocation | null = null;
  private uHoverBright: WebGLUniformLocation | null = null;
  private uClickPos: WebGLUniformLocation | null = null;
  private uClickTime: WebGLUniformLocation | null = null;
  private uClickWave: WebGLUniformLocation | null = null;
  private uIsAudioDeck: WebGLUniformLocation | null = null;
  private uSwitchThumb: WebGLUniformLocation | null = null;


  private instances = new Map<string, TactileGlassInstance>();
  private animId: number | null = null;
  private startTime = performance.now();
  private isTabVisible = true;

  constructor() {
    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = () => {
    this.isTabVisible = !document.hidden;
    if (!this.isTabVisible) {
      this.stopLoop();
    } else if (this.instances.size > 0 && !this.animId) {
      this.startLoop();
    }
  };

  private initGL(): boolean {
    if (this.gl) return true;
    if (typeof window === "undefined") return false;

    this.glCanvas = document.createElement("canvas");
    this.glCanvas.width = 512;
    this.glCanvas.height = 256;

    const gl = this.glCanvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) return false;
    this.gl = gl;

    this.prog = createGlassProgram(gl);

    this.quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(this.prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this.uSrc = gl.getUniformLocation(this.prog, "u_src");
    this.uSrcComposite = gl.getUniformLocation(this.prog, "u_srcComposite");
    this.uTextMask = gl.getUniformLocation(this.prog, "u_textMask");
    this.uIsText = gl.getUniformLocation(this.prog, "u_isText");
    this.uResolution = gl.getUniformLocation(this.prog, "u_resolution");
    this.uRect = gl.getUniformLocation(this.prog, "u_rect");
    this.uRadius = gl.getUniformLocation(this.prog, "u_radius");
    this.uUseBackdrop = gl.getUniformLocation(this.prog, "u_useBackdrop");
    this.uTilt = gl.getUniformLocation(this.prog, "u_tilt");
    this.uBgColor = gl.getUniformLocation(this.prog, "u_bgColor");

    this.uRefraction = gl.getUniformLocation(this.prog, "u_refraction");
    this.uThickness = gl.getUniformLocation(this.prog, "u_thickness");
    this.uBevelWidth = gl.getUniformLocation(this.prog, "u_bevelWidth");
    this.uFrost = gl.getUniformLocation(this.prog, "u_frost");
    this.uDispersion = gl.getUniformLocation(this.prog, "u_dispersion");
    this.uSheen = gl.getUniformLocation(this.prog, "u_sheen");
    this.uLightAngle = gl.getUniformLocation(this.prog, "u_lightAngle");
    this.uDarkness = gl.getUniformLocation(this.prog, "u_darkness");
    this.uRim = gl.getUniformLocation(this.prog, "u_rim");
    this.uTime = gl.getUniformLocation(this.prog, "u_time");

    this.uFluidBright = gl.getUniformLocation(this.prog, "u_fluidBright");
    this.uFluidSpeed = gl.getUniformLocation(this.prog, "u_fluidSpeed");
    this.uFluidScale = gl.getUniformLocation(this.prog, "u_fluidScale");
    this.uFluidAuraWidth = gl.getUniformLocation(this.prog, "u_fluidAuraWidth");
    this.uFluidCenter = gl.getUniformLocation(this.prog, "u_fluidCenter");
    this.uAuroraFlow = gl.getUniformLocation(this.prog, "u_auroraFlow");

    this.uMousePos = gl.getUniformLocation(this.prog, "u_mousePos");
    this.uHoverStrength = gl.getUniformLocation(this.prog, "u_hoverStrength");
    this.uLightTrack = gl.getUniformLocation(this.prog, "u_lightTrack");
    this.uHoverBright = gl.getUniformLocation(this.prog, "u_hoverBright");
    this.uClickPos = gl.getUniformLocation(this.prog, "u_clickPos");
    this.uClickTime = gl.getUniformLocation(this.prog, "u_clickTime");
    this.uClickWave = gl.getUniformLocation(this.prog, "u_clickWave");
    this.uIsAudioDeck = gl.getUniformLocation(this.prog, "u_isAudioDeck");
    this.uSwitchThumb = gl.getUniformLocation(this.prog, "u_switchThumb");


    // Backdrop texture
    this.bgTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.bgTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );

    return true;
  }

  public register(inst: TactileGlassInstance) {
    this.instances.set(inst.id, inst);
    if (!this.gl) this.initGL();
    if (this.instances.size === 1) {
      this.startLoop();
    }
  }

  public unregister(id: string) {
    this.instances.delete(id);
    const cached = this.textMaskTextures.get(id);
    if (cached && this.gl) {
      this.gl.deleteTexture(cached.tex);
    }
    this.textMaskTextures.delete(id);
    if (this.instances.size === 0) {
      this.stopLoop();
    }
  }

  private startLoop() {
    if (this.animId !== null) return;
    const tick = () => {
      this.renderFrame();
      if (this.instances.size > 0 && this.isTabVisible) {
        this.animId = requestAnimationFrame(tick);
      } else {
        this.animId = null;
      }
    };
    this.animId = requestAnimationFrame(tick);
  }

  private stopLoop() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  public getTime(): number {
    return (performance.now() - this.startTime) * 0.001;
  }

  private renderFrame() {
    const gl = this.gl;
    const glCanvas = this.glCanvas;
    const prog = this.prog;
    if (!gl || !glCanvas || !prog) return;

    const t = this.getTime();

    const rects = new Map<TactileGlassInstance, DOMRect>();
    this.instances.forEach((inst) => {
      if (inst.visible) {
        rects.set(inst, inst.canvas.getBoundingClientRect());
      }
    });

    const ordered = Array.from(this.instances.values()).sort((a, b) => {
      const aRoot = a.canvas.parentElement;
      const bRoot = b.canvas.parentElement;
      if (aRoot && aRoot.contains(b.canvas)) return -1;
      if (bRoot && bRoot.contains(a.canvas)) return 1;
      const areaA = a.canvas.width * a.canvas.height;
      const areaB = b.canvas.width * b.canvas.height;
      if (areaA !== areaB) return areaB - areaA;
      return 0;
    });

    ordered.forEach((inst, idx) => {
      if (!inst.visible) return;
      const { canvas, ctx } = inst;
      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) return;

      if (glCanvas.width < w || glCanvas.height < h) {
        glCanvas.width = Math.max(glCanvas.width, w);
        glCanvas.height = Math.max(glCanvas.height, h);
      }

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cr = rects.get(inst) || canvas.getBoundingClientRect();
      const instArea = w * h;
      let parentInst: TactileGlassInstance | undefined;
      for (let i = idx - 1; i >= 0; i--) {
        const prev = ordered[i];
        if (!prev.visible || prev.canvas.width <= 0 || prev.canvas.height <= 0) continue;
        if (prev.canvas.parentElement?.contains(canvas)) {
          parentInst = prev;
          break;
        }
        const pr = rects.get(prev);
        const prevArea = prev.canvas.width * prev.canvas.height;
        if (
          pr &&
          prevArea > instArea * 1.5 &&
          cr.right > pr.left &&
          cr.left < pr.right &&
          cr.bottom > pr.top &&
          cr.top < pr.bottom
        ) {
          parentInst = prev;
          break;
        }
      }

      gl.activeTexture(gl.TEXTURE0);
      if (parentInst && parentInst.canvas.width > 0 && parentInst.canvas.height > 0) {
        if (!this.compositeCanvas) {
          this.compositeCanvas = document.createElement("canvas");
          this.compositeCtx = this.compositeCanvas.getContext("2d");
          this.compositeTexture = gl.createTexture();
        }
        if (this.compositeCanvas.width !== w || this.compositeCanvas.height !== h) {
          this.compositeCanvas.width = w;
          this.compositeCanvas.height = h;
        }
        if (this.compositeCtx && this.compositeTexture) {
          const pr = rects.get(parentInst) || parentInst.canvas.getBoundingClientRect();
          const sx = Math.round((cr.left - pr.left) * dpr);
          const sy = Math.round((cr.top - pr.top) * dpr);
          this.compositeCtx.clearRect(0, 0, w, h);
          this.compositeCtx.drawImage(parentInst.canvas, sx, sy, w, h, 0, 0, w, h);
          gl.bindTexture(gl.TEXTURE_2D, this.compositeTexture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.compositeCanvas);
          if (this.uSrcComposite) gl.uniform1f(this.uSrcComposite, 2.0);
        } else {
          gl.bindTexture(gl.TEXTURE_2D, this.bgTexture);
          if (this.uSrcComposite) gl.uniform1f(this.uSrcComposite, -1.0);
        }
      } else {
        gl.bindTexture(gl.TEXTURE_2D, this.bgTexture);
        if (this.uSrcComposite) gl.uniform1f(this.uSrcComposite, -1.0);
      }
      if (this.uSrc) gl.uniform1i(this.uSrc, 0);

      // Lerp interaction values
      inst.curHover += (inst.targetHover - inst.curHover) * 0.12;
      inst.curMouseX += (inst.targetMouseX - inst.curMouseX) * 0.14;
      inst.curMouseY += (inst.targetMouseY - inst.curMouseY) * 0.14;

      const p = inst.getParams();
      if (!inst.textMask && !inst.isAudioDeck) {
        const blurPx = p.frost > 1 ? Math.round(p.frost * 0.25 * 10) / 10 : 0;
        const bf = blurPx > 0 ? `blur(${blurPx}px)` : "";
        if (canvas.style.backdropFilter !== bf) {
          canvas.style.backdropFilter = bf;
          (canvas.style as any).webkitBackdropFilter = bf;
        }
      }
      const bgCol = resolveElementBgColor(canvas);
      if (this.uBgColor) gl.uniform3f(this.uBgColor, bgCol[0], bgCol[1], bgCol[2]);

      const customRect = inst.getRect ? inst.getRect() : null;
      const rx = customRect ? customRect[0] : 0;
      const ry = customRect ? customRect[1] : 0;
      const rw = customRect ? customRect[2] : w;
      const rh = customRect ? customRect[3] : h;

      gl.uniform2f(this.uResolution, w, h);
      gl.uniform4f(this.uRect, rx, ry, rw, rh);
      gl.uniform1f(this.uRadius, p.radius ?? (rh * 0.5));
      gl.uniform1f(this.uUseBackdrop, 0.0);
      if (this.uIsAudioDeck) gl.uniform1f(this.uIsAudioDeck, inst.isAudioDeck ? 1.0 : 0.0);
      if (this.uSwitchThumb) {
        const swThumb = inst.getSwitchThumb ? inst.getSwitchThumb() : null;
        if (swThumb) {
          const halfW = swThumb[2];
          const halfH = swThumb.length >= 4 ? (swThumb as [number, number, number, number])[3] : swThumb[2];
          gl.uniform4f(this.uSwitchThumb, swThumb[0], swThumb[1], halfW, halfH);
        } else {
          gl.uniform4f(this.uSwitchThumb, 0, 0, 0, 0);
        }
      }

      if (inst.textMask) {
        if (!this.textMaskCanvas) {
          this.textMaskCanvas = document.createElement("canvas");
          this.textMaskCtx = this.textMaskCanvas.getContext("2d", { willReadFrequently: true });
        }
        const font = inst.textFont || `800 ${Math.round(h * 0.72)}px sans-serif`;
        const letterSpacing = inst.textLetterSpacing || "normal";
        const key = `${inst.textMask}_${w}_${h}_${font}_${letterSpacing}`;
        let entry = this.textMaskTextures.get(inst.id);
        if (!entry) {
          const tex = gl.createTexture()!;
          entry = { tex, key: "" };
          this.textMaskTextures.set(inst.id, entry);
        }
        if (entry.key !== key && this.textMaskCtx) {
          entry.key = key;
          if (this.textMaskCanvas.width !== w || this.textMaskCanvas.height !== h) {
            this.textMaskCanvas.width = w;
            this.textMaskCanvas.height = h;
          }
          this.textMaskCtx.font = font;
          if ("letterSpacing" in this.textMaskCtx) {
            (this.textMaskCtx as any).letterSpacing =
              letterSpacing && letterSpacing !== "normal" ? letterSpacing : "0px";
          }
          const m = this.textMaskCtx.measureText(inst.textMask);
          const left = m.actualBoundingBoxLeft ?? 0;
          const right = m.actualBoundingBoxRight ?? m.width;
          const ascent = m.actualBoundingBoxAscent ?? h * 0.36;
          const descent = m.actualBoundingBoxDescent ?? h * 0.1;
          const drawX = Math.round(w * 0.5 - (right - left) * 0.5);
          const drawY = Math.round(h * 0.5 + (ascent - descent) * 0.5);
          const sdfData = buildTextMaskSDFData(
            this.textMaskCtx,
            w,
            h,
            inst.textMask,
            font,
            letterSpacing,
            drawX,
            drawY
          );
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, entry.tex);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, sdfData);
        } else {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, entry.tex);
        }
        if (this.uTextMask) gl.uniform1i(this.uTextMask, 1);
        if (this.uIsText) gl.uniform1f(this.uIsText, 1.0);
      } else {
        if (this.uIsText) gl.uniform1f(this.uIsText, 0.0);
      }

      if (
        inst.tilt &&
        (Math.abs(inst.tilt.rotX) > 0.001 ||
          Math.abs(inst.tilt.rotY) > 0.001 ||
          Math.abs(inst.tilt.scale - 1) > 0.001)
      ) {
        const rotXRad = (inst.tilt.rotX * Math.PI) / 180;
        const rotYRad = (inst.tilt.rotY * Math.PI) / 180;
        const scale = inst.tilt.scale || 1.0;
        const focalLength = (inst.tilt.focalLength || 1000) * dpr;
        if (this.uTilt) gl.uniform4f(this.uTilt, rotXRad, rotYRad, scale, focalLength);
      } else {
        if (this.uTilt) gl.uniform4f(this.uTilt, 0, 0, 1, 0);
      }

      gl.uniform1f(this.uTime, t);

      gl.uniform1f(this.uRefraction, p.refraction);
      gl.uniform1f(this.uThickness, p.thickness);
      gl.uniform1f(this.uBevelWidth, p.bevelWidth * dpr);
      gl.uniform1f(this.uFrost, p.frost);
      gl.uniform1f(this.uDispersion, p.dispersion);
      gl.uniform1f(this.uSheen, p.sheen);
      const angleDeg = p.lightAngle ?? p.angle ?? 24;
      gl.uniform1f(this.uLightAngle, (angleDeg * Math.PI) / 180.0);
      gl.uniform1f(this.uDarkness, p.darkness);
      gl.uniform1f(this.uRim, p.rim);

      const causticBright = p.causticBright ?? p.fluidBright;
      const causticSpeed = p.causticSpeed ?? p.fluidSpeed;
      const causticScale = p.causticScale ?? p.fluidScale;
      gl.uniform1f(this.uFluidBright, causticBright);
      gl.uniform1f(this.uFluidSpeed, causticSpeed);
      gl.uniform1f(this.uFluidScale, causticScale);
      gl.uniform1f(this.uFluidAuraWidth, (p.fluidAuraWidth ?? 4) * dpr);
      gl.uniform1f(this.uFluidCenter, p.fluidCenter ?? 0);
      gl.uniform1f(this.uAuroraFlow, p.auroraFlow ?? 75);

      gl.uniform2f(this.uMousePos, inst.curMouseX, inst.curMouseY);
      gl.uniform1f(this.uHoverStrength, inst.curHover);
      gl.uniform1f(this.uLightTrack, p.lightTrack);
      gl.uniform1f(this.uHoverBright, p.hoverBright);
      gl.uniform2f(this.uClickPos, inst.clickPos[0], inst.clickPos[1]);
      gl.uniform1f(this.uClickTime, inst.clickTime);
      gl.uniform1f(this.uClickWave, p.clickWave);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Fast GPU blit to 2D canvas
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(glCanvas, 0, glCanvas.height - h, w, h, 0, 0, w, h);
    });
  }

  public teardown() {
    this.stopLoop();
    if (this.gl && this.prog) {
      this.textMaskTextures.forEach((entry) => {
        this.gl?.deleteTexture(entry.tex);
      });
      this.textMaskTextures.clear();
      this.gl.deleteProgram(this.prog);
      if (this.quadBuf) this.gl.deleteBuffer(this.quadBuf);
      if (this.bgTexture) this.gl.deleteTexture(this.bgTexture);
      if (this.compositeTexture) this.gl.deleteTexture(this.compositeTexture);
      this.gl = null;
      this.prog = null;
      this.compositeTexture = null;
      this.compositeCanvas = null;
      this.compositeCtx = null;
    }
    if (typeof window !== "undefined") {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }
}

// Module-level singleton instance
let sharedEngineInstance: SharedCausticEngine | null = null;

export function getSharedCausticEngine(): SharedCausticEngine {
  if (!sharedEngineInstance) {
    sharedEngineInstance = new SharedCausticEngine();
  }
  return sharedEngineInstance;
}

/**
 * TactileGlassStage:
 * Drives showcase or viewport fullscreen canvas with scissor testing,
 * background grid upload, and interaction tracking.
 */
export interface StageTargetInfo {
  element: HTMLElement;
  isCircle?: boolean;
  isText?: boolean;
  isAudioDeck?: boolean;
  params: TactileGlassParams;
  tilt?: { rotX: number; rotY: number; scale: number; focalLength?: number } | null;
}

export interface TactileGlassStageConfig {
  getTargets: () => (StageTargetInfo | null | undefined)[];
  onResize?: () => void;
  drawBackground?: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dpr: number,
    time: number,
    offsetX?: number,
    offsetY?: number
  ) => void;
  isBackgroundDynamic?: () => boolean;
  getBackgroundDirtyRect?: () => { x: number; y: number; width: number; height: number } | null;
}

export class TactileGlassStage {
  private canvas: HTMLCanvasElement;
  private config: TactileGlassStageConfig;
  private gl: WebGL2RenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private quadBuf: WebGLBuffer | null = null;

  private bgCanvas: HTMLCanvasElement;
  private bgCtx: CanvasRenderingContext2D | null = null;
  private bgTexture: WebGLTexture | null = null;
  private sceneTexture: WebGLTexture | null = null;
  private sceneTexW = 0;
  private sceneTexH = 0;
  private cleanBgCanvas: HTMLCanvasElement | null = null;
  private cleanBgCtx: CanvasRenderingContext2D | null = null;
  private bgPatchCanvas: HTMLCanvasElement | null = null;
  private bgPatchCtx: CanvasRenderingContext2D | null = null;

  // Uniform locations
  private uResolution: WebGLUniformLocation | null = null;
  private uSrc: WebGLUniformLocation | null = null;
  private uSrcComposite: WebGLUniformLocation | null = null;
  private uTextMask: WebGLUniformLocation | null = null;
  private uIsText: WebGLUniformLocation | null = null;
  private uIsAudioDeck: WebGLUniformLocation | null = null;
  private uSwitchThumb: WebGLUniformLocation | null = null;
  private textMaskCanvas: HTMLCanvasElement | null = null;
  private textMaskCtx: CanvasRenderingContext2D | null = null;
  private textMaskTexture: WebGLTexture | null = null;
  private lastTextMaskKey: string = "";
  private uRect: WebGLUniformLocation | null = null;
  private uRadius: WebGLUniformLocation | null = null;
  private uUseBackdrop: WebGLUniformLocation | null = null;
  private uTilt: WebGLUniformLocation | null = null;
  private uBgColor: WebGLUniformLocation | null = null;

  private uRefraction: WebGLUniformLocation | null = null;
  private uThickness: WebGLUniformLocation | null = null;
  private uBevelWidth: WebGLUniformLocation | null = null;
  private uFrost: WebGLUniformLocation | null = null;
  private uDispersion: WebGLUniformLocation | null = null;
  private uSheen: WebGLUniformLocation | null = null;
  private uLightAngle: WebGLUniformLocation | null = null;
  private uDarkness: WebGLUniformLocation | null = null;
  private uRim: WebGLUniformLocation | null = null;
  private uTime: WebGLUniformLocation | null = null;

  private uFluidBright: WebGLUniformLocation | null = null;
  private uFluidSpeed: WebGLUniformLocation | null = null;
  private uFluidScale: WebGLUniformLocation | null = null;
  private uFluidAuraWidth: WebGLUniformLocation | null = null;
  private uFluidCenter: WebGLUniformLocation | null = null;
  private uAuroraFlow: WebGLUniformLocation | null = null;

  private uMousePos: WebGLUniformLocation | null = null;
  private uHoverStrength: WebGLUniformLocation | null = null;
  private uLightTrack: WebGLUniformLocation | null = null;
  private uHoverBright: WebGLUniformLocation | null = null;
  private uClickPos: WebGLUniformLocation | null = null;
  private uClickTime: WebGLUniformLocation | null = null;
  private uClickWave: WebGLUniformLocation | null = null;


  // Per-element pointer tracking for smooth independent hover & ripple decay
  private pointerStates = new Map<
    HTMLElement,
    {
      targetMouseX: number;
      targetMouseY: number;
      curMouseX: number;
      curMouseY: number;
      targetHover: number;
      curHover: number;
      clickPos: [number, number];
      clickTime: number;
      hasCoords: boolean;
    }
  >();

  private getPointerState(el: HTMLElement) {
    let st = this.pointerStates.get(el);
    if (!st) {
      st = {
        targetMouseX: 0,
        targetMouseY: 0,
        curMouseX: 0,
        curMouseY: 0,
        targetHover: 0,
        curHover: 0,
        clickPos: [-999, -999],
        clickTime: -999.0,
        hasCoords: false,
      };
      this.pointerStates.set(el, st);
    }
    return st;
  }

  private startTime = performance.now();
  private animId: number | null = null;
  private dpr = 1;
  private resizeObserver: ResizeObserver | null = null;
  private isPaused = false;
  private isTabVisible = typeof document !== "undefined" ? !document.hidden : true;

  constructor(canvas: HTMLCanvasElement, config: TactileGlassStageConfig) {
    this.canvas = canvas;
    this.config = config;

    this.bgCanvas = document.createElement("canvas");
    this.bgCtx = this.bgCanvas.getContext("2d");

    this.initGL();
    window.addEventListener("resize", this.handleResize);
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this.canvas);
    }
    this.resize();
    this.syncLoopState();
  }

  private initGL(): boolean {
    const gl = this.canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      console.error("TactileGlassStage: WebGL2 required");
      return false;
    }
    this.gl = gl;

    this.bgTexture = gl.createTexture();
    this.prog = createGlassProgram(gl);
    gl.useProgram(this.prog);

    this.quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(this.prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this.uResolution = gl.getUniformLocation(this.prog, "u_resolution");
    this.uSrc = gl.getUniformLocation(this.prog, "u_src");
    this.uSrcComposite = gl.getUniformLocation(this.prog, "u_srcComposite");
    this.uTextMask = gl.getUniformLocation(this.prog, "u_textMask");
    this.uIsText = gl.getUniformLocation(this.prog, "u_isText");
    this.uIsAudioDeck = gl.getUniformLocation(this.prog, "u_isAudioDeck");
    this.uSwitchThumb = gl.getUniformLocation(this.prog, "u_switchThumb");
    this.uRect = gl.getUniformLocation(this.prog, "u_rect");
    this.uRadius = gl.getUniformLocation(this.prog, "u_radius");
    this.uUseBackdrop = gl.getUniformLocation(this.prog, "u_useBackdrop");
    this.uTilt = gl.getUniformLocation(this.prog, "u_tilt");
    this.uBgColor = gl.getUniformLocation(this.prog, "u_bgColor");

    this.uRefraction = gl.getUniformLocation(this.prog, "u_refraction");
    this.uThickness = gl.getUniformLocation(this.prog, "u_thickness");
    this.uBevelWidth = gl.getUniformLocation(this.prog, "u_bevelWidth");
    this.uFrost = gl.getUniformLocation(this.prog, "u_frost");
    this.uDispersion = gl.getUniformLocation(this.prog, "u_dispersion");
    this.uSheen = gl.getUniformLocation(this.prog, "u_sheen");
    this.uLightAngle = gl.getUniformLocation(this.prog, "u_lightAngle");
    this.uDarkness = gl.getUniformLocation(this.prog, "u_darkness");
    this.uRim = gl.getUniformLocation(this.prog, "u_rim");
    this.uTime = gl.getUniformLocation(this.prog, "u_time");

    this.uFluidBright = gl.getUniformLocation(this.prog, "u_fluidBright");
    this.uFluidSpeed = gl.getUniformLocation(this.prog, "u_fluidSpeed");
    this.uFluidScale = gl.getUniformLocation(this.prog, "u_fluidScale");
    this.uFluidAuraWidth = gl.getUniformLocation(this.prog, "u_fluidAuraWidth");
    this.uFluidCenter = gl.getUniformLocation(this.prog, "u_fluidCenter");
    this.uAuroraFlow = gl.getUniformLocation(this.prog, "u_auroraFlow");

    this.uMousePos = gl.getUniformLocation(this.prog, "u_mousePos");
    this.uHoverStrength = gl.getUniformLocation(this.prog, "u_hoverStrength");
    this.uLightTrack = gl.getUniformLocation(this.prog, "u_lightTrack");
    this.uHoverBright = gl.getUniformLocation(this.prog, "u_hoverBright");
    this.uClickPos = gl.getUniformLocation(this.prog, "u_clickPos");
    this.uClickTime = gl.getUniformLocation(this.prog, "u_clickTime");
    this.uClickWave = gl.getUniformLocation(this.prog, "u_clickWave");


    return true;
  }

  public updateBackground(time: number = 0) {
    const gl = this.gl;
    const bgCtx = this.bgCtx;
    if (!gl || !bgCtx || !this.bgTexture) return;

    if (this.bgCanvas.width !== this.canvas.width || this.bgCanvas.height !== this.canvas.height) {
      this.bgCanvas.width = this.canvas.width;
      this.bgCanvas.height = this.canvas.height;
    }

    if (!this.cleanBgCanvas) {
      this.cleanBgCanvas = document.createElement("canvas");
      this.cleanBgCtx = this.cleanBgCanvas.getContext("2d");
    }
    if (this.cleanBgCanvas.width !== this.canvas.width || this.cleanBgCanvas.height !== this.canvas.height) {
      this.cleanBgCanvas.width = this.canvas.width;
      this.cleanBgCanvas.height = this.canvas.height;
    }

    // Render clean obsidian dot-matrix backdrop once (or upon resize)
    const cCtx = this.cleanBgCtx;
    if (cCtx) {
      cCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      cCtx.fillStyle = "rgba(255, 255, 255, 0.12)";
      const step = Math.round(24 * this.dpr);
      const dotRadius = 1 * this.dpr;
      const startX = Math.floor(step * 0.5) + 0.5;
      const startY = Math.floor(step * 0.5) + 0.5;
      cCtx.beginPath();
      const maxX = this.canvas.width - dotRadius - 1;
      const maxY = this.canvas.height - dotRadius - 1;
      for (let y = startY; y < maxY; y += step) {
        for (let x = startX; x < maxX; x += step) {
          cCtx.moveTo(x + dotRadius, y);
          cCtx.arc(x, y, dotRadius, 0, Math.PI * 2);
        }
      }
      cCtx.fill();
    }

    // Copy clean backdrop to main bgCanvas
    bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    if (this.cleanBgCanvas) {
      bgCtx.drawImage(this.cleanBgCanvas, 0, 0);
    }

    if (this.config.drawBackground) {
      this.config.drawBackground(bgCtx, this.bgCanvas.width, this.bgCanvas.height, this.dpr, time, 0, 0);
    }

    gl.bindTexture(gl.TEXTURE_2D, this.bgTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.bgCanvas);
  }

  private handleResize = () => {
    this.resize();
  };

  public resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const cssW = rect.width > 0 ? rect.width : window.innerWidth;
    const cssH = rect.height > 0 ? rect.height : window.innerHeight;
    this.canvas.width = Math.max(1, Math.round(cssW * this.dpr));
    this.canvas.height = Math.max(1, Math.round(cssH * this.dpr));
    if (this.gl) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.config.onResize) {
      this.config.onResize();
    }
    this.updateBackground();
  }

  private handlePointerCoord(e: { clientX: number; clientY: number }, el: HTMLElement) {
    let r = el.getBoundingClientRect();
    if (el.firstChild && (el.classList.contains("heading-word-target") || el.classList.contains("tactile-glass-word") || (el.childNodes.length === 1 && el.firstChild.nodeType === 3))) {
      const range = document.createRange();
      range.selectNodeContents(el.firstChild);
      const rr = range.getBoundingClientRect();
      if (rr.width > 0 && rr.height > 0) {
        r = rr;
      }
    }
    const cx = r.left + r.width * 0.5;
    const cy = r.top + r.height * 0.5;
    const st = this.getPointerState(el);
    st.targetMouseX = (e.clientX - cx) * this.dpr;
    st.targetMouseY = (cy - e.clientY) * this.dpr;
    if (!st.hasCoords) {
      st.curMouseX = st.targetMouseX;
      st.curMouseY = st.targetMouseY;
      st.hasCoords = true;
    }
  }

  private attachedEls = new Set<HTMLElement>();

  private hasNestedAttachedTarget(parent: HTMLElement, target: EventTarget | null): boolean {
    if (!(target instanceof Node)) return false;
    for (const other of this.attachedEls) {
      if (other !== parent && parent.contains(other) && other.contains(target)) {
        return true;
      }
    }
    return false;
  }

  public attachPointer(el: HTMLElement | null | undefined) {
    if (!el) return;
    this.attachedEls.add(el);
    this.getPointerState(el);
    el.addEventListener("pointerenter", (e) => {
      const st = this.getPointerState(el);
      this.handlePointerCoord(e as PointerEvent, el);
      if (this.hasNestedAttachedTarget(el, e.target)) {
        st.targetHover = 0.0;
        return;
      }
      st.targetHover = 1.0;
    });
    el.addEventListener("pointermove", (e) => {
      const st = this.getPointerState(el);
      this.handlePointerCoord(e as PointerEvent, el);
      if (this.hasNestedAttachedTarget(el, e.target)) {
        st.targetHover = 0.0;
        return;
      }
      st.targetHover = 1.0;
    });
    el.addEventListener("pointerleave", (e) => {
      if ((e as PointerEvent).pointerType === "touch") return;
      const st = this.getPointerState(el);
      st.targetHover = 0.0;
    });
    el.addEventListener("pointercancel", (e) => {
      if ((e as PointerEvent).pointerType === "touch") return;
      const st = this.getPointerState(el);
      st.targetHover = 0.0;
    });
    el.addEventListener("pointerup", (e) => {
      if ((e as PointerEvent).pointerType === "touch") {
        const st = this.getPointerState(el);
        st.targetHover = 0.0;
      }
    });
    el.addEventListener("pointerdown", (e) => {
      if (this.hasNestedAttachedTarget(el, e.target)) return;
      const st = this.getPointerState(el);
      this.handlePointerCoord(e as PointerEvent, el);
      st.targetHover = 1.0;
      st.clickPos = [st.targetMouseX, st.targetMouseY];
      st.clickTime = (performance.now() - this.startTime) * 0.001;
    });
    el.addEventListener(
      "touchstart",
      (e) => {
        const t = (e as TouchEvent).touches[0];
        if (!t) return;
        const st = this.getPointerState(el);
        this.handlePointerCoord(t, el);
        if (this.hasNestedAttachedTarget(el, e.target)) {
          st.targetHover = 0.0;
          return;
        }
        st.targetHover = 1.0;
      },
      { passive: true }
    );
    el.addEventListener(
      "touchmove",
      (e) => {
        const t = (e as TouchEvent).touches[0];
        if (!t) return;
        const st = this.getPointerState(el);
        this.handlePointerCoord(t, el);
        const hitEl = document.elementFromPoint(t.clientX, t.clientY);
        if (!hitEl || !el.contains(hitEl) || this.hasNestedAttachedTarget(el, hitEl)) {
          st.targetHover = 0.0;
          return;
        }
        st.targetHover = 1.0;
      },
      { passive: true }
    );
    const clearTouchHover = () => {
      const st = this.getPointerState(el);
      st.targetHover = 0.0;
    };
    el.addEventListener("touchend", clearTouchHover, { passive: true });
    el.addEventListener("touchcancel", clearTouchHover, { passive: true });
  }

  public resetPointer() {
    this.pointerStates.forEach((st) => {
      st.targetHover = 0.0;
      st.curHover = 0.0;
      st.clickPos = [-999, -999];
      st.clickTime = -999.0;
      st.hasCoords = false;
    });
  }

  private handleVisibilityChange = () => {
    this.isTabVisible = !document.hidden;
    this.syncLoopState();
  };

  public setPaused(paused: boolean) {
    if (this.isPaused === paused) return;
    this.isPaused = paused;
    this.syncLoopState();
  }

  private syncLoopState() {
    if (!this.isPaused && this.isTabVisible) {
      this.startLoop();
    } else {
      this.stopLoop();
    }
  }

  private startLoop() {
    if (this.animId !== null) return;
    const tick = () => {
      if (this.isPaused || !this.isTabVisible) {
        this.animId = null;
        return;
      }
      this.render();
      this.animId = requestAnimationFrame(tick);
    };
    this.animId = requestAnimationFrame(tick);
  }

  private stopLoop() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  public render() {
    const gl = this.gl;
    const prog = this.prog;
    if (!gl || !prog) return;

    const targets = this.config.getTargets().filter(Boolean) as StageTargetInfo[];

    gl.useProgram(prog);

    const t = (performance.now() - this.startTime) * 0.001;

    // Dynamic background sub-region texture update
    if (this.config.isBackgroundDynamic?.() && this.config.drawBackground && this.cleanBgCanvas && this.bgTexture) {
      const dirty = this.config.getBackgroundDirtyRect?.();
      if (dirty && dirty.width > 0 && dirty.height > 0) {
        if (!this.bgPatchCanvas) {
          this.bgPatchCanvas = document.createElement("canvas");
          this.bgPatchCtx = this.bgPatchCanvas.getContext("2d");
        }
        if (this.bgPatchCanvas.width !== dirty.width || this.bgPatchCanvas.height !== dirty.height) {
          this.bgPatchCanvas.width = dirty.width;
          this.bgPatchCanvas.height = dirty.height;
        }

        const pCtx = this.bgPatchCtx;
        if (pCtx) {
          pCtx.clearRect(0, 0, dirty.width, dirty.height);
          pCtx.drawImage(this.cleanBgCanvas, dirty.x, dirty.y, dirty.width, dirty.height, 0, 0, dirty.width, dirty.height);
          this.config.drawBackground(pCtx, dirty.width, dirty.height, this.dpr, t, dirty.x, dirty.y);
          this.bgCtx?.clearRect(dirty.x, dirty.y, dirty.width, dirty.height);
          this.bgCtx?.drawImage(this.bgPatchCanvas, dirty.x, dirty.y);

          gl.bindTexture(gl.TEXTURE_2D, this.bgTexture);
          gl.texSubImage2D(gl.TEXTURE_2D, 0, dirty.x, dirty.y, gl.RGBA, gl.UNSIGNED_BYTE, this.bgPatchCanvas);
        }
      }
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bgTexture);
    if (this.uSrc) gl.uniform1i(this.uSrc, 0);
    if (this.uSrcComposite) gl.uniform1f(this.uSrcComposite, 0.0);

    gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height);
    if (this.uUseBackdrop) gl.uniform1f(this.uUseBackdrop, 1.0);
    const stageBg = resolveElementBgColor(this.canvas);
    if (this.uBgColor) gl.uniform3f(this.uBgColor, stageBg[0], stageBg[1], stageBg[2]);

    // Smooth lerp for per-element hover light tracking
    this.pointerStates.forEach((st) => {
      st.curHover += (st.targetHover - st.curHover) * 0.12;
      st.curMouseX += (st.targetMouseX - st.curMouseX) * 0.14;
      st.curMouseY += (st.targetMouseY - st.curMouseY) * 0.14;
    });

    // 1. Draw entire canvas backdrop once
    gl.disable(gl.BLEND);
    gl.disable(gl.SCISSOR_TEST);
    gl.uniform4f(this.uRect, -9999, -9999, 1, 1);
    gl.uniform1f(this.uRadius, 0);
    gl.uniform1f(this.uFluidBright, 0);
    gl.uniform1f(this.uHoverStrength, 0);
    if (this.uIsText) gl.uniform1f(this.uIsText, 0.0);
    if (this.uIsAudioDeck) gl.uniform1f(this.uIsAudioDeck, 0.0);
    if (this.uSwitchThumb) gl.uniform4f(this.uSwitchThumb, 0, 0, 0, 0);
    if (this.uTilt) gl.uniform4f(this.uTilt, 0, 0, 1, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 2. Render each visible glass lens with scissor clipping and SDF alpha blending
    if (this.uUseBackdrop) gl.uniform1f(this.uUseBackdrop, 0.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.SCISSOR_TEST);

    const canvasRect = this.canvas.getBoundingClientRect();
    const cLeft = canvasRect.left;
    const cTop = canvasRect.top;
    const cHeight = canvasRect.height > 0 ? canvasRect.height : window.innerHeight;

    const renderedBounds: { el: HTMLElement; x: number; y: number; w: number; h: number }[] = [];

    targets.forEach((target) => {
      const el = target.element;
      if (!el || !el.isConnected) return;

      let x: number, y: number, w: number, h: number, rad: number;
      let textPad = 0;
      let textAscent = 0;

      if (target.isText) {
        // High-precision DOM text range measurement
        let textRect = el.getBoundingClientRect();
        if (el.firstChild) {
          const range = document.createRange();
          range.selectNodeContents(el.firstChild);
          const rr = range.getBoundingClientRect();
          if (rr.width > 0 && rr.height > 0) {
            textRect = rr;
          }
        }

        const comp = window.getComputedStyle(el);
        const fs = parseFloat(comp.fontSize) * this.dpr;
        const font = `${comp.fontWeight} ${fs}px ${comp.fontFamily}`;
        const letterSpacing = comp.letterSpacing || "normal";

        if (!this.textMaskCanvas) {
          this.textMaskCanvas = document.createElement("canvas");
          this.textMaskCtx = this.textMaskCanvas.getContext("2d", { willReadFrequently: true });
          this.textMaskTexture = gl.createTexture();
        }
        if (this.textMaskCtx) {
          this.textMaskCtx.font = font;
          if ("letterSpacing" in this.textMaskCtx && letterSpacing !== "normal") {
            (this.textMaskCtx as any).letterSpacing = letterSpacing;
          }
          this.textMaskCtx.textBaseline = "alphabetic";
          this.textMaskCtx.textAlign = "left";
          const text = el.textContent?.trim() || "";
          const metrics = this.textMaskCtx.measureText(text);
          textAscent = Math.round(metrics.fontBoundingBoxAscent || fs * 0.82);
        }

        // Generous padding around the text bounds ensures zero glyph clipping (e.g. wide bearings, italic slant,
        // negative letter-spacing, and outer glass refraction / fluid aura falloff)
        textPad = Math.ceil(32 * this.dpr);

        const textX = Math.round((textRect.left - cLeft) * this.dpr);
        const textY = Math.round((cHeight - (textRect.top - cTop + textRect.height)) * this.dpr);
        const textW = Math.round(textRect.width * this.dpr);
        const textH = Math.round(textRect.height * this.dpr);

        x = textX - textPad;
        y = textY - textPad;
        w = textW + textPad * 2;
        h = textH + textPad * 2;
        rad = 0;
      } else {
        const r = el.getBoundingClientRect();
        const isCircle = target.isCircle || el.classList.contains("btn-circle");
        const side = isCircle ? Math.min(r.width, r.height) : 0;
        const elW = isCircle ? side : (target.tilt ? el.offsetWidth : r.width);
        const elH = isCircle ? side : (target.tilt ? el.offsetHeight : r.height);
        const elLeft = isCircle
          ? r.left + (r.width - side) * 0.5
          : target.tilt
          ? r.left + r.width * 0.5 - elW * 0.5
          : r.left;
        const elTop = isCircle
          ? r.top + (r.height - side) * 0.5
          : target.tilt
          ? r.top + r.height * 0.5 - elH * 0.5
          : r.top;

        x = Math.round((elLeft - cLeft) * this.dpr);
        y = Math.round((cHeight - (elTop - cTop + elH)) * this.dpr);
        w = Math.round(elW * this.dpr);
        h = Math.round(elH * this.dpr);
        const maxRad = Math.min(w, h) * 0.5;
        const rawRad =
          target.params.radius !== undefined
            ? target.params.radius
            : parseFloat(getComputedStyle(el).borderRadius);
        rad = isCircle
          ? maxRad
          : Math.min(
              (Number.isFinite(rawRad) ? rawRad : elH * 0.5) * this.dpr,
              maxRad
            );
      }

      if (w <= 0 || h <= 0) return;

      const pad = target.isText
        ? 0
        : target.tilt || target.isAudioDeck
        ? Math.ceil(64 * this.dpr)
        : Math.ceil(1 * this.dpr);
      const sx0 = Math.max(0, Math.min(this.canvas.width, x - pad));
      const sy0 = Math.max(0, Math.min(this.canvas.height, y - pad));
      const sx1 = Math.max(0, Math.min(this.canvas.width, x + w + pad));
      const sy1 = Math.max(0, Math.min(this.canvas.height, y + h + pad));
      const sw = sx1 - sx0;
      const sh = sy1 - sy0;

      if (sw <= 0 || sh <= 0) return;

      const isOverParentLens = renderedBounds.some(
        (prev) =>
          prev.el.contains(el) ||
          (prev.w * prev.h > w * h * 1.5 &&
            x < prev.x + prev.w &&
            x + w > prev.x &&
            y < prev.y + prev.h &&
            y + h > prev.y)
      );
      renderedBounds.push({ el, x, y, w, h });

      gl.activeTexture(gl.TEXTURE0);
      if (isOverParentLens) {
        if (!this.sceneTexture) {
          this.sceneTexture = gl.createTexture();
        }
        gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
        if (this.sceneTexW !== this.canvas.width || this.sceneTexH !== this.canvas.height) {
          this.sceneTexW = this.canvas.width;
          this.sceneTexH = this.canvas.height;
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.sceneTexW,
            this.sceneTexH,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
          );
        }
        const copyMargin = Math.ceil(64 * this.dpr);
        const cx0 = Math.max(0, sx0 - copyMargin);
        const cy0 = Math.max(0, sy0 - copyMargin);
        const cx1 = Math.min(this.canvas.width, sx1 + copyMargin);
        const cy1 = Math.min(this.canvas.height, sy1 + copyMargin);
        const cw = cx1 - cx0;
        const ch = cy1 - cy0;
        if (cw > 0 && ch > 0) {
          gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, cx0, cy0, cx0, cy0, cw, ch);
        }
        if (this.uSrcComposite) gl.uniform1f(this.uSrcComposite, 1.0);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, this.bgTexture);
        if (this.uSrcComposite) gl.uniform1f(this.uSrcComposite, 0.0);
      }

      gl.scissor(sx0, sy0, sw, sh);
      gl.uniform4f(this.uRect, x, y, w, h);
      gl.uniform1f(this.uRadius, rad);
      if (this.uIsAudioDeck) gl.uniform1f(this.uIsAudioDeck, target.isAudioDeck ? 1.0 : 0.0);
      if (this.uSwitchThumb) {
        const thumbEl = !target.isText
          ? (el.querySelector(".switch-thumb, .tabs-indicator, [data-switch-thumb], [data-tabs-indicator]") as HTMLElement | null)
          : null;
        if (thumbEl) {
          const tr = thumbEl.getBoundingClientRect();
          const br = el.getBoundingClientRect();
          const tx = ((tr.left + tr.width * 0.5) - (br.left + br.width * 0.5)) * this.dpr;
          const ty = ((br.top + br.height * 0.5) - (tr.top + tr.height * 0.5)) * this.dpr;
          const halfW = tr.width * 0.5 * this.dpr;
          const halfH = tr.height * 0.5 * this.dpr;
          gl.uniform4f(this.uSwitchThumb, tx, ty, halfW, halfH);
        } else {
          gl.uniform4f(this.uSwitchThumb, 0, 0, 0, 0);
        }
      }

      if (target.isText) {
        if (!this.textMaskCanvas) {
          this.textMaskCanvas = document.createElement("canvas");
          this.textMaskCtx = this.textMaskCanvas.getContext("2d", { willReadFrequently: true });
          this.textMaskTexture = gl.createTexture();
        }
        const text = el.textContent?.trim() || "";
        const comp = window.getComputedStyle(el);
        const cw = Math.max(1, Math.round(w));
        const ch = Math.max(1, Math.round(h));
        const fs = parseFloat(comp.fontSize) * this.dpr;
        const font = `${comp.fontWeight} ${fs}px ${comp.fontFamily}`;
        const letterSpacing = comp.letterSpacing || "normal";
        const cacheKey = `${text}_${cw}_${ch}_${font}_${letterSpacing}_${textPad}_${textAscent}`;

        if (this.lastTextMaskKey !== cacheKey) {
          this.lastTextMaskKey = cacheKey;
          if (this.textMaskCanvas.width !== cw || this.textMaskCanvas.height !== ch) {
            this.textMaskCanvas.width = cw;
            this.textMaskCanvas.height = ch;
          }
          if (this.textMaskCtx) {
            const data = buildTextMaskSDFData(
              this.textMaskCtx,
              cw,
              ch,
              text,
              font,
              letterSpacing,
              textPad,
              textPad + textAscent
            );

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.textMaskTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cw, ch, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
          }
        } else {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.textMaskTexture);
        }

        if (this.uTextMask) gl.uniform1i(this.uTextMask, 1);
        if (this.uIsText) gl.uniform1f(this.uIsText, 1.0);
      } else {
        if (this.uIsText) gl.uniform1f(this.uIsText, 0.0);
      }

      if (
        target.tilt &&
        (Math.abs(target.tilt.rotX) > 0.001 ||
          Math.abs(target.tilt.rotY) > 0.001 ||
          Math.abs(target.tilt.scale - 1) > 0.001)
      ) {
        const rotXRad = (target.tilt.rotX * Math.PI) / 180;
        const rotYRad = (target.tilt.rotY * Math.PI) / 180;
        const scale = target.tilt.scale || 1.0;
        const focalLength = (target.tilt.focalLength || 1000) * this.dpr;
        if (this.uTilt) {
          gl.uniform4f(this.uTilt, rotXRad, rotYRad, scale, focalLength);
        }
      } else {
        if (this.uTilt) {
          gl.uniform4f(this.uTilt, 0, 0, 1, 0);
        }
      }

      const p = target.params;
      gl.uniform1f(this.uRefraction, p.refraction);
      gl.uniform1f(this.uThickness, p.thickness);
      gl.uniform1f(this.uBevelWidth, p.bevelWidth * this.dpr);
      gl.uniform1f(this.uFrost, p.frost);
      gl.uniform1f(this.uDispersion, p.dispersion);
      gl.uniform1f(this.uSheen, p.sheen);
      const angleDeg = p.lightAngle ?? p.angle ?? 24;
      gl.uniform1f(this.uLightAngle, (angleDeg * Math.PI) / 180.0);
      gl.uniform1f(this.uDarkness, p.darkness);
      gl.uniform1f(this.uRim, p.rim);
      gl.uniform1f(this.uTime, t);

      const causticBright = p.causticBright ?? p.fluidBright;
      const causticSpeed = p.causticSpeed ?? p.fluidSpeed;
      const causticScale = p.causticScale ?? p.fluidScale;
      gl.uniform1f(this.uFluidBright, causticBright);
      gl.uniform1f(this.uFluidSpeed, causticSpeed);
      gl.uniform1f(this.uFluidScale, causticScale);
      gl.uniform1f(this.uFluidAuraWidth, (p.fluidAuraWidth ?? 4) * this.dpr);
      gl.uniform1f(this.uFluidCenter, p.fluidCenter ?? 0);
      gl.uniform1f(this.uAuroraFlow, p.auroraFlow ?? 75);

      gl.uniform1f(this.uLightTrack, p.lightTrack);
      gl.uniform1f(this.uHoverBright, p.hoverBright);
      gl.uniform1f(this.uClickWave, p.clickWave);

      let st = this.pointerStates.get(el);
      if (!st && !this.attachedEls.has(el)) {
        for (const [attEl, attSt] of this.pointerStates.entries()) {
          if (attEl.contains(el) || el.contains(attEl)) {
            st = attSt;
            break;
          }
        }
      }

      gl.uniform1f(this.uHoverStrength, st ? st.curHover : 0.0);
      gl.uniform2f(
        this.uMousePos,
        st ? st.curMouseX : 0.0,
        st ? st.curMouseY : 0.0
      );
      gl.uniform2f(
        this.uClickPos,
        st ? st.clickPos[0] : -999,
        st ? st.clickPos[1] : -999
      );
      gl.uniform1f(this.uClickTime, st ? st.clickTime : -999);


      gl.drawArrays(gl.TRIANGLES, 0, 6);
    });

    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.BLEND);
  }

  public teardown() {
    this.stopLoop();
    window.removeEventListener("resize", this.handleResize);
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.gl && this.prog) {
      this.gl.deleteProgram(this.prog);
      if (this.quadBuf) this.gl.deleteBuffer(this.quadBuf);
      if (this.bgTexture) this.gl.deleteTexture(this.bgTexture);
      if (this.sceneTexture) this.gl.deleteTexture(this.sceneTexture);
      if (this.textMaskTexture) this.gl.deleteTexture(this.textMaskTexture);
      this.gl = null;
      this.prog = null;
      this.sceneTexture = null;
      this.textMaskTexture = null;
      this.cleanBgCanvas = null;
      this.cleanBgCtx = null;
      this.bgPatchCanvas = null;
      this.bgPatchCtx = null;
    }
  }
}
