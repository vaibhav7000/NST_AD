# Shape Studio: Starter Project

Shape Studio is a drawing app. You drag circles, squares and rectangles onto a canvas, move them around, and save your design so you can look at it later.

**What already works:** the drag-and-drop canvas.
**Your job:** add **navigation** (bottom tabs + a stack) and **storage** (AsyncStorage) so designs can be saved, listed and opened.

---

## Getting started

You need Node.js installed, plus Expo Go on a phone or a simulator on your computer.

```bash
npm install
npx expo start
```

Open the app in **Expo Go** on your phone (scan the QR code), or press `a` for an Android emulator, `i` for the iOS simulator, or `w` for the web.

Try it: drag a shape from the tray at the bottom onto the white canvas, then drag it around. Tapping a shape in the tray also adds it. **Save** does not work yet. That's your job.

---

## Project structure

```
App.js                          Shows only the Draw screen for now      ← Task 1
src/
  constants/theme.js            Colors and shape sizes
  components/
    ShapeView.js                Draws one shape
    DraggableShape.js           A shape on the canvas you can drag
    ShapePalette.js             The tray of 3 shapes at the bottom
    DesignPreview.js            A scaled-down picture of a saved design
    DesignCard.js               One row in the Saved list
  screens/
    DrawScreen.js               Canvas + tray + Clear/Save buttons      ← Task 3
    SavedScreen.js              List of saved designs (styled, no data)  ← Tasks 2, 3
    DesignDetailScreen.js       One saved design (styled, no data)      ← Tasks 2, 3
  storage/
    designStorage.js            Empty storage functions                 ← Task 3
```

All the screens and components are already built and styled. Search the code for `TODO` to find every place you need to change.

---

## How the app should work when you're done

```
Bottom tabs
├── Draw tab    → DrawScreen          (drag shapes, tap Save)
└── Saved tab   → Stack navigator
                  ├── SavedList     → SavedScreen          (list of saved designs)
                  └── DesignDetail  → DesignDetailScreen   (one design + Delete button)
```

1. The user builds a design on the **Draw** tab and taps **Save**.
2. The design is written to AsyncStorage and the canvas clears.
3. The **Saved** tab lists every saved design, newest first.
4. Tapping a design opens the **Design** screen, with a back button to the list.
5. **Delete design** removes it and goes back to the list.
6. Close and reopen the app: the saved designs are still there.

---

## Task 1: Bottom tab navigation

Install React Navigation:

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
```

In `App.js`:

- [ ] Wrap the app in `NavigationContainer`
- [ ] Create a bottom tab navigator with two tabs: **Draw** and **Saved**
- [ ] The Draw tab shows `DrawScreen`
- [ ] Give each tab an icon (hint: `Ionicons` from `@expo/vector-icons`, e.g. `shapes-outline` and `albums-outline`)
- [ ] Remove the temporary header and `SafeAreaView` (the tab navigator handles these)

## Task 2: Stack navigation inside the Saved tab

```bash
npm install @react-navigation/native-stack
```

- [ ] Create a stack navigator (e.g. in `src/navigation/SavedStack.js`) with two screens:
  `SavedList` → `SavedScreen` and `DesignDetail` → `DesignDetailScreen`
- [ ] Use this stack as the component of the **Saved** tab
- [ ] Hide the tab's own header for the Saved tab (`headerShown: false`) so you don't get two headers
- [ ] In `SavedScreen`, tapping a card navigates to `DesignDetail` and passes `{ designId }` as a route param
- [ ] In `DesignDetailScreen`, read `designId` from `route.params`
- [ ] After deleting, go back to the list with `navigation.goBack()`

## Task 3: Save designs with AsyncStorage

```bash
npm install @react-native-async-storage/async-storage
```

- [ ] Implement the four functions in `src/storage/designStorage.js`:
  `getDesigns`, `saveDesign`, `getDesignById`, `deleteDesign`
- [ ] Store all designs as **one JSON array** under one key (AsyncStorage only stores strings)
- [ ] In `DrawScreen`, call `saveDesign(design)` when Save is tapped, then clear the canvas
- [ ] In `SavedScreen`, load the list with `getDesigns()` **every time the tab is focused** (`useFocusEffect`)
- [ ] In `DesignDetailScreen`, load the design with `getDesignById(designId)`
- [ ] The Delete button calls `deleteDesign(designId)`

### The design object

`DrawScreen` already builds this object for you when Save is tapped:

```js
{
  id: '1729580000000',
  createdAt: '2026-10-22T08:30:00.000Z',
  canvas: { width: 358, height: 435 },   // canvas size, used to scale previews
  shapes: [
    { id: '1729579990000-0', type: 'circle',    x: 40,  y: 32 },
    { id: '1729579995000-1', type: 'rectangle', x: 120, y: 210 },
  ],
}
```

---

## Done when…

- [ ] The app has two bottom tabs: Draw and Saved
- [ ] Saving a design clears the canvas and the design appears on the Saved tab
- [ ] Tapping a saved design opens it on its own screen with a working back button
- [ ] Deleting a design removes it from the list
- [ ] Saved designs are still there after the app is fully closed and reopened

## Stretch goals (optional)

- Show the number of saved designs as a badge on the Saved tab (`tabBarBadge`)
- Add an **Edit** button on the Design screen that opens the design back on the Draw tab
- Long-press a shape on the canvas to remove it
- Add a "Delete all" button that clears storage
