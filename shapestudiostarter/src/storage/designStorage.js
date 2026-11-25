import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@shape-studio/designs';

// Return every saved design (newest first), or [] if nothing is saved yet.
export async function getDesigns() {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

// Add a design. If a design with the same id exists, it is replaced (used by Edit).
export async function saveDesign(design) {
  const designs = await getDesigns();
  const others = designs.filter((d) => d.id !== design.id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([design, ...others]));
}

// Return the design with this id, or null if it does not exist.
export async function getDesignById(id) {
  const designs = await getDesigns();
  return designs.find((d) => d.id === id) || null;
}

// Remove the design with this id.
export async function deleteDesign(id) {
  const designs = await getDesigns();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(designs.filter((d) => d.id !== id)));
}
