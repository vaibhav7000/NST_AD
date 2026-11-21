import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableShape from '../components/DraggableShape';
import ShapePalette from '../components/ShapePalette';
import { COLORS, SHAPES } from '../constants/theme';
import { saveDesign } from '../storage/designStorage';

export default function DrawScreen({ route }) {
  const [shapes, setShapes] = useState([]);
  // When editing a saved design, we keep it here so Save overwrites it.
  const [editing, setEditing] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [message, setMessage] = useState('');
  const canvasRef = useRef(null);

  // Saved design opened with the Edit button: load it onto the canvas.
  const editDesign = route?.params?.design;
  useEffect(() => {
    if (editDesign) {
      setEditing(editDesign);
      setShapes(editDesign.shapes);
    }
  }, [editDesign]);

  const addShape = (type, x, y) => {
    setShapes((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, type, x, y }]);
  };

  // Tap on a palette shape: add it near the top-left corner.
  const handleTap = (type) => {
    const offset = (shapes.length % 6) * 16;
    addShape(type, 16 + offset, 16 + offset);
  };

  // Drop from the palette: convert screen position to canvas position.
  const handleDrop = (type, pageX, pageY) => {
    canvasRef.current.measureInWindow((canvasX, canvasY, width, height) => {
      const { width: w, height: h } = SHAPES[type];
      const x = pageX - canvasX;
      const y = pageY - canvasY;
      const centerInside = x + w / 2 > 0 && x + w / 2 < width && y + h / 2 > 0 && y + h / 2 < height;
      if (!centerInside) return; // dropped outside the canvas

      addShape(
        type,
        Math.min(Math.max(x, 0), width - w),
        Math.min(Math.max(y, 0), height - h)
      );
    });
  };

  const moveShape = (id, x, y) => {
    setShapes((prev) => prev.map((shape) => (shape.id === id ? { ...shape, x, y } : shape)));
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 1800);
  };

  const handleSave = async () => {
    if (shapes.length === 0) {
      showMessage('Add a shape first');
      return;
    }
    const design = {
      id: editing ? editing.id : Date.now().toString(),
      createdAt: editing ? editing.createdAt : new Date().toISOString(),
      canvas: canvasSize,
      shapes,
    };

    await saveDesign(design);
    setShapes([]);
    setEditing(null);
    showMessage('Saved to your designs');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {message || `${shapes.length} ${shapes.length === 1 ? 'shape' : 'shapes'} on canvas`}
        </Text>
        <Pressable style={[styles.button, styles.ghost]} onPress={() => setShapes([])}>
          <Text style={styles.ghostText}>Clear</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.primary]} onPress={handleSave}>
          <Text style={styles.primaryText}>Save</Text>
        </Pressable>
      </View>

      <View
        ref={canvasRef}
        style={styles.canvas}
        onLayout={(e) => setCanvasSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })}
      >
        {shapes.length === 0 && (
          <Text style={styles.empty}>Your canvas is empty.{'\n'}Drag shapes here from the tray below.</Text>
        )}
        {shapes.map((shape) => (
          <DraggableShape key={shape.id} shape={shape} bounds={canvasSize} onMove={moveShape} />
        ))}
      </View>

      <ShapePalette onDrop={handleDrop} onTap={handleTap} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  count: {
    flex: 1,
    fontSize: 14,
    color: COLORS.muted,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  ghost: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  ghostText: {
    color: COLORS.ink,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: COLORS.accent,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  canvas: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
