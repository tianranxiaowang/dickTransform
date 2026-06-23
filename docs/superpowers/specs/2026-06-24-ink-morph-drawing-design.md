# Ink Morph Drawing Page Design

## Goal

Build a single-page gag web app where the player draws freely on a white canvas with a black brush. After the player clicks the finish button, the drawing animates as if the ink is pulled into a target hand-drawn outline. The target outline is scaled and centered according to the player's drawing bounds, so the final result feels like the player's own drawing transformed.

## Product Scope

The first version is a compact web page, not a desktop app or full game. It includes:

- A white drawing canvas.
- One black brush with a fixed, comfortable stroke width.
- A finish button that starts the transformation.
- A reset button that clears the page and allows another drawing.
- A short animation that morphs the user's drawn ink into the target shape.

Out of scope for the first version:

- Brush customization.
- Undo and redo.
- Export or gallery features.
- Scoring, timers, sound effects, or multiple levels.

## User Flow

1. The player opens the page and sees the blank white canvas.
2. The player draws any shape using mouse or touch input.
3. The player clicks the finish button.
4. The app calculates the bounds of the player's drawing.
5. The target outline is fitted into those bounds while preserving its proportions.
6. The player's stroke samples animate toward points along the target outline.
7. The final frame stabilizes into a black hand-drawn outline.
8. The player can click reset to start again.

## Visual Direction

The page should feel simple and slightly absurd, but the interface should stay clean. The canvas is the main object on screen. The drawing area uses a white background and black ink only. Controls are minimal and should not compete with the canvas.

The target outline is based on the user-provided reference image style: rough hand-drawn line art, black stroke on white canvas. The implementation should represent the target as a set of normalized vector-like paths rather than embedding the screenshot directly, so it can be scaled to the player's drawing.

## Architecture

The implementation should be a small browser app. A Vite or similarly lightweight frontend setup is appropriate because the workspace is currently empty and the feature is canvas-heavy.

Core modules:

- Drawing input: captures pointer events and stores user strokes as arrays of points.
- Stroke sampling: resamples drawn strokes into a stable number of particles or sample points.
- Target shape: stores normalized path point data for the final outline.
- Fitting: computes the player's drawing bounds and maps target points into that area.
- Morph animation: interpolates sample points from their drawn positions to the fitted target positions.
- Renderer: draws the live strokes during drawing and draws animated points or short segments during transformation.
- UI state: manages idle, drawing, morphing, complete, and reset states.

## Transformation Algorithm

During drawing, each stroke is stored as ordered points. When the player finishes:

1. Flatten all stroke points.
2. Resample or distribute them into a fixed-size particle list.
3. Generate a matching list of target points from the normalized target outline.
4. Fit the target points into the player's drawing bounds, using the drawing center and a scale based on the drawing's width and height.
5. Pair source particles with target points by normalized path order. If there are more source particles than target points, repeat or interpolate target samples. If there are fewer source particles, downsample target points.
6. Animate each particle with easing from source to target over a fixed duration.
7. At the end, draw target-adjacent particles as short connected segments so the outline reads as a drawing rather than disconnected dots.

This keeps the effect robust even if the player draws random scribbles.

## Error Handling and Edge Cases

- If the player clicks finish without drawing, the app should ignore the action or show a small non-intrusive hint.
- If the drawing bounds are extremely small, the app should use a minimum target size centered on the canvas.
- While morphing, drawing input should be disabled.
- Reset should cancel any current animation frame and return to a clean canvas.
- The canvas should handle device pixel ratio so lines do not look blurry.
- The app should support mouse and touch through pointer events.

## Testing and Verification

Manual verification should cover:

- Drawing with mouse.
- Drawing with touch or simulated touch if available.
- Clicking finish after a normal drawing.
- Clicking finish after a tiny mark.
- Clicking finish with no drawing.
- Reset during or after animation.
- Desktop and narrow mobile viewport screenshots.

Automated or scripted checks should include:

- A build check.
- A browser smoke test that loads the page.
- A canvas nonblank check after drawing and after transformation.

## Implementation Notes

Keep the first version small and dependency-light. Prefer the Canvas 2D API for drawing and animation. Do not add heavy graphics libraries unless the simple canvas implementation cannot meet the visual requirement.
