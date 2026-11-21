// Colors and shape definitions used across the app.

export const COLORS = {
  background: '#F5F3EE',
  card: '#FFFFFF',
  border: '#E6E1D8',
  ink: '#1F2430',
  muted: '#6B7280',
  accent: '#4F46E5',
  danger: '#DC4C3F',
};

// Every shape type the user can drag onto the canvas.
// width/height are in pixels, radius is the corner radius.
export const SHAPES = {
  circle: { label: 'Circle', width: 72, height: 72, radius: 36, color: '#F2705E' },
  square: { label: 'Square', width: 72, height: 72, radius: 10, color: '#1FB5A3' },
  rectangle: { label: 'Rectangle', width: 120, height: 64, radius: 10, color: '#F5B841' },
  pill: { label: 'Pill', width: 120, height: 48, radius: 24, color: '#8B5CF6' },
};

export const SHAPE_TYPES = Object.keys(SHAPES);
