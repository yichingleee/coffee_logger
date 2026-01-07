# Dashboard Silk Background Plan

## Concept
- **Goal**: Replace the static dashboard backdrop with a full-viewport, flowing “silk” canvas that sits behind both the New Brew and Data Log columns.
- **Mood**: Deep charcoal base with animated silver filaments. The canvas should feel like moonlit silk—dark, moody, and punctuated by luminous highlights rather than a bright sheet.
- **Memorability**: The background should be a signature visual with soft movement that complements the amber/orange UI without washing out foreground cards.

## Visual & Motion Direction
- Build two layers: a matte charcoal gradient wash and animated silver lines that wander diagonally.
- Thin filaments should travel slowly, occasionally converging into brighter threads to mimic fabric catches. Lines should feel organic—curvy and irregular rather than evenly spaced—by warping their paths with noise.
- Target 25–35 second cycles per wave; subtle parallax between layers reinforces depth without raising overall brightness.

## Technical Approach
1. **Rendering**: Same `<canvas>` strategy as before, but blend a dark base directly inside the shader so the entire viewport feels charcoal even where content doesn’t cover it.
2. **Shaders/Geometry**:
   - Vertex shader keeps gentle displacement using sine waves; amplitude tied to pointer distance to preserve sense of fabric.
   - Fragment shader layers: (a) charcoal gradient base (`#050505 → #101214`), (b) soft vignette, (c) flowing filament mask derived from multi-frequency sine functions to create line-like highlights.
   - Use `pow`-based shaping (`line = pow(abs(sin(...)), 8.0)`) to get thin lines; modulate brightness with scroll/pointer.
   - Highlight palette anchored at `#9ca5b5` and `#cdd5df` (cool silver) so highlights pop without turning white.
3. **Performance**:
   - Keep geometry resolution moderate (128 segments) since filament detail happens in fragment shader.
   - Same optimizations: clamp pixel ratio, pause on hidden tab, respect reduce-motion.
   - Add uniform for base darkening so we can tweak brightness without code changes.

### Implementation Details
- **Component skeleton**:
  ```tsx
  const SilkBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
      const { renderer, scene, camera, uniforms } = initScene(canvasRef.current);
      let rafId = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(rafId);
        dispose(renderer, scene);
      };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
  };
  ```
- **Scene setup**:
  - Orthographic camera at `z = 1` looking at origin to keep plane flat to screen.
  - Plane geometry sized to cover viewport `2 x 2` units; 128 subdivisions strike a balance between displacement smoothness and perf.
  - Uniforms: `u_time`, `u_mouse`, `u_scroll`, `u_baseA`, `u_baseB`, `u_silverA`, `u_silverB`, `u_darkening`.
  - Vertex shader: dual sine offsets on `uv.x` & `uv.y` create gentle lift; amplitude modulates with pointer energy for interactive feel.
- **Shader logic**:
  - Base color = mix(`u_baseA`, `u_baseB`) using a slow-moving radial gradient plus vignette to anchor darkness.
  - Organic filament mask = start with rotated UVs, then warp them with cheap smooth noise. Feed warped coordinates into layered sine strokes and take higher powers to get thin, irregular highlights.
  - Highlights = mix base with `u_silverA/B`; `u_scroll` nudges hue slightly and adds a faint glimmer. Slight noise-based flicker keeps the lines alive.
  - Final alpha clamped around `0.75` to keep background dark while still revealing subtle movement.
- **Interactions**:
  - Pointer move updates `u_mouse` (normalized -1..1). Use this vector to slightly change `u_amplitude` and `speed`.
  - Scroll listener accumulates delta, decays over time, and feeds `u_scrollDelta` to gently shift hue/brightness.
  - When tab hidden (`visibilitychange`), pause RAF to save power.
- **Fallback**:
  - If WebGL context creation fails, render a CSS animated gradient background as a simplified backup (`background: linear-gradient(...)` with keyframes).

## Interaction Layer
- Tie wave speed/amplitude to cursor distance from center: subtle acceleration when users move the mouse, easing back when idle.
- Optionally adjust hue within a ±5° range on scroll to feel responsive while maintaining the white/silver palette.

## Implementation Tasks
1. Scaffold a `SilkBackground` React component that creates/removes the canvas, handles resize, and runs the animation loop.
2. Integrate it into the dashboard layout beneath content layers (`position: fixed` or `absolute` with `-z-10`), ensuring no layout shift.
3. Wire pointer/scroll listeners with debounced state updates to drive shader uniforms.
4. Add accessibility guardrails (`prefers-reduced-motion`, pause when tab hidden).
5. Document configuration knobs (colors, speed, amplitude) for future tweaking.

## Minimalist Generative Art Revision Plan
### Concept
Replace the complex filament shader with a minimalist, deterministic line field: a sparse set of flowing, silver strokes that glide on a dark ground. The lines follow a gently warped grid to feel organic but remain structured and calm.

### Parameters
- `seed`: string, required, used for deterministic randomness.
- `lineCount`: 24–48 total strokes.
- `segmentCount`: 40–80 points per stroke.
- `gridScale`: 0.12–0.2 (controls flow field granularity).
- `warpStrength`: 0.18–0.35 (controls curvature irregularity).
- `lineWidth`: 0.6–1.2 px (varies per stroke).
- `alphaRange`: 0.08–0.22 (subtle opacity band).
- `palette`: base `#070504`, mid `#14100c`, highlight `#e1d8cb`.
- `tempo`: 0.02–0.05 (phase step per frame).

### Algorithmic Plan (Canvas 2D)
1. Initialize a seeded RNG and build a low-resolution flow field grid: each cell stores an angle derived from a smooth function of `(x, y, seed)`.
2. Create `lineCount` strokes with random start positions in normalized space. For each stroke, iterate `segmentCount` steps:
   - Sample the flow angle at the current position.
   - Apply a small deterministic jitter based on seed (bounded by `warpStrength`).
   - Advance the point by a fixed step length (scaled by `gridScale`) and store it.
3. Render: for each stroke, draw a polyline with slight per‑segment alpha modulation (sinusoidal + seed) using the silver highlight color; keep background filled with the dark base gradient.
4. Motion: update the flow field angle phase slowly (`tempo`), and re-project strokes by a small offset along the field instead of regenerating every frame.
5. Interaction: map pointer distance to a subtle `warpStrength` increase; apply scroll to a mild global phase shift.

### Performance & Tuning Notes
- Recompute the flow field at low resolution only when size or seed changes; per-frame only update phase.
- Cache stroke point arrays and re-render at 30–45 FPS to reduce cost.
- Maintain negative space: cap `lineCount` and enforce minimum spacing between stroke start points.
