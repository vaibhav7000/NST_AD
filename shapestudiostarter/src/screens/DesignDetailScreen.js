import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import DesignPreview from '../components/DesignPreview';
import { formatDate } from '../components/DesignCard';
import { COLORS, SHAPES, SHAPE_TYPES } from '../constants/theme';
import { deleteDesign, getDesignById } from '../storage/designStorage';

// Shows one saved design. This is the second screen of the "Saved" tab's stack.
export default function DesignDetailScreen({ route, navigation }) {
  const [design, setDesign] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    getDesignById(route.params.designId).then(setDesign);
  }, [route.params.designId]);

  const handleDelete = async () => {
    await deleteDesign(design.id);
    navigation.goBack();
  };

  if (!design) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.muted}>Loading design…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{formatDate(design.createdAt)}</Text>

      <DesignPreview design={design} width={Math.min(width - 32, 480)} />

      <View style={styles.stats}>
        {SHAPE_TYPES.map((type) => (
          <View key={type} style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: SHAPES[type].color }]} />
            <Text style={styles.statText}>
              {design.shapes.filter((s) => s.type === type).length} {SHAPES[type].label}
            </Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.edit} onPress={() => navigation.navigate('Draw', { design })}>
        <Text style={styles.editText}>Edit design</Text>
      </Pressable>

      <Pressable style={styles.delete} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete design</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  title: {
    alignSelf: 'stretch',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
  },
  muted: {
    color: COLORS.muted,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statText: {
    fontSize: 14,
    color: COLORS.ink,
  },
  edit: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  editText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  delete: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  deleteText: {
    color: COLORS.danger,
    fontWeight: '600',
  },
});
