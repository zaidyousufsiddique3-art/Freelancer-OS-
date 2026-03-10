import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category } from '../types';
import { CATEGORIES } from '../constants/categories';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';

interface CategoryPickerProps {
  selected: Category | Category[] | null;
  onSelect: (category: Category) => void;
  multiple?: boolean;
}

export default function CategoryPicker({ selected, onSelect, multiple }: CategoryPickerProps) {
  const isSelected = (key: Category): boolean => {
    if (multiple && Array.isArray(selected)) {
      return selected.includes(key);
    }
    return selected === key;
  };

  return (
    <View style={styles.grid}>
      {CATEGORIES.map((cat) => {
        const active = isSelected(cat.key);
        return (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.item,
              active && { backgroundColor: cat.color + '15', borderColor: cat.color },
            ]}
            onPress={() => onSelect(cat.key)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={cat.icon as any}
              size={28}
              color={active ? cat.color : COLORS.textLight}
            />
            <Text
              style={[
                styles.label,
                active && { color: cat.color, fontWeight: '700' },
              ]}
              numberOfLines={2}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    width: '30%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    backgroundColor: '#111111',
    minHeight: 100,
  },
  label: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
});
