import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const COURSES = ['Starter', 'Main', 'Dessert'];

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'add' | 'list'
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // Form state
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<any>({});

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: any = {};
    if (!dishName.trim()) newErrors.dishName = 'Dish name is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!course) newErrors.course = 'Please select a course.';
    if (!price.trim()) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Enter a valid price greater than 0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price),
    };

    setMenuItems((prev: any[]) => [...prev, newItem]);
    resetForm();
    Alert.alert('Success', `"${newItem.dishName}" was added to the menu.`);
  };

  // ---------- Screens ----------

  const renderHome = () =>
    React.createElement(
      View,
      { style: styles.centered },
      React.createElement(Text, { style: styles.title }, "Chef's Menu Manager"),
      React.createElement(Text, { style: styles.subtitle }, 'Manage your menu items'),
      React.createElement(
        TouchableOpacity,
        { style: styles.button, onPress: () => setScreen('add') },
        React.createElement(Text, { style: styles.buttonText }, '+ Add New Item')
      ),
      React.createElement(
        TouchableOpacity,
        { style: [styles.button, styles.buttonSecondary], onPress: () => setScreen('list') },
        React.createElement(Text, { style: styles.buttonText }, `View Menu (${menuItems.length})`)
      )
    );

  const renderAdd = () =>
    React.createElement(
      KeyboardAvoidingView,
      { style: { flex: 1 }, behavior: Platform.OS === 'ios' ? 'padding' : undefined },
      React.createElement(
        ScrollView,
        { contentContainerStyle: styles.formContainer },
        React.createElement(Text, { style: styles.title }, 'Add Menu Item'),
        React.createElement(Text, { style: styles.label }, 'Dish Name'),
        React.createElement(TextInput, {
          style: [styles.input, errors.dishName && styles.inputError],
          placeholder: 'Enter dish name...',
          value: dishName,
          onChangeText: setDishName,
        }),
        errors.dishName && React.createElement(Text, { style: styles.errorText }, errors.dishName),
        React.createElement(Text, { style: styles.label }, 'Description'),
        React.createElement(TextInput, {
          style: [styles.input, styles.multiline, errors.description && styles.inputError],
          placeholder: 'Enter description...',
          value: description,
          onChangeText: setDescription,
          multiline: true,
        }),
        errors.description && React.createElement(Text, { style: styles.errorText }, errors.description),
        React.createElement(Text, { style: styles.label }, 'Course'),
        React.createElement(
          View,
          { style: [styles.pickerWrapper, errors.course && styles.inputError] },
          React.createElement(
            Picker,
            {
              selectedValue: course,
              onValueChange: (itemValue: unknown) => setCourse(String(itemValue ?? '')),
            },
            React.createElement(Picker.Item, { label: 'Select a course...', value: '' }),
            ...COURSES.map((c) => React.createElement(Picker.Item, { key: c, label: c, value: c }))
          )
        ),
        errors.course && React.createElement(Text, { style: styles.errorText }, errors.course),
        React.createElement(Text, { style: styles.label }, 'Price (R)'),
        React.createElement(TextInput, {
          style: [styles.input, errors.price && styles.inputError],
          placeholder: '0.00',
          value: price,
          onChangeText: setPrice,
          keyboardType: 'decimal-pad',
        }),
        errors.price && React.createElement(Text, { style: styles.errorText }, errors.price),
        React.createElement(
          TouchableOpacity,
          { style: styles.button, onPress: handleSave },
          React.createElement(Text, { style: styles.buttonText }, 'Save Item')
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: [styles.button, styles.buttonSecondary],
            onPress: () => {
              resetForm();
              setScreen('home');
            },
          },
          React.createElement(Text, { style: styles.buttonText }, 'Back to Home')
        )
      )
    );

  const renderList = () =>
    React.createElement(
      View,
      { style: styles.listContainer },
      React.createElement(Text, { style: styles.title }, 'Menu List'),
      React.createElement(FlatList, {
        data: menuItems,
        keyExtractor: (item: any) => item.id,
        contentContainerStyle: { flexGrow: 1 },
        ListEmptyComponent: React.createElement(
          View,
          { style: styles.centered },
          React.createElement(
            Text,
            { style: styles.emptyText },
            'No menu items have been added yet.\nTap "Add New Item" to get started.'
          )
        ),
        renderItem: ({ item }: any) =>
          React.createElement(
            View,
            { style: styles.card },
            React.createElement(
              View,
              { style: styles.cardRow },
              React.createElement(Text, { style: styles.cardTitle }, item.dishName),
              React.createElement(Text, { style: styles.cardPrice }, `R${item.price.toFixed(2)}`)
            ),
            React.createElement(Text, { style: styles.cardCourse }, item.course),
            React.createElement(Text, { style: styles.cardDescription }, item.description)
          ),
      }),
      React.createElement(
        TouchableOpacity,
        { style: styles.button, onPress: () => setScreen('add') },
        React.createElement(Text, { style: styles.buttonText }, '+ Add New Item')
      ),
      React.createElement(
        TouchableOpacity,
        { style: [styles.button, styles.buttonSecondary], onPress: () => setScreen('home') },
        React.createElement(Text, { style: styles.buttonText }, 'Back to Home')
      )
    );

  return React.createElement(
    SafeAreaView,
    { style: styles.safe },
    React.createElement(StatusBar, { barStyle: 'dark-content' }),
    screen === 'home' && renderHome(),
    screen === 'add' && renderAdd(),
    screen === 'list' && renderList()
  );
}

const COLORS = {
  primary: '#B5403A',
  secondary: '#5A5A5A',
  background: '#FFF8F0',
  card: '#FFFFFF',
  text: '#2B2B2B',
  error: '#C62828',
  border: '#D9CFC4',
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 32,
  },
  formContainer: {
    padding: 20,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cardCourse: {
    fontSize: 14,
    color: COLORS.secondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});
