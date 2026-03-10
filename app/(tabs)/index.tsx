import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Platform } from 'react-native';
import { Text, Searchbar, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import TaskCard from '../../components/TaskCard';
import { CATEGORIES } from '../../constants/categories';
import { Category, Task } from '../../types';
import { subscribeTasks } from '../../services/tasks';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { tasks, filteredCategory, setFilteredCategory, setTasks } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const isClient = user?.role === 'client';

  useEffect(() => {
    const unsubscribe = subscribeTasks(isClient ? user?.id : undefined, (newTasks) => {
      setTasks(newTasks);
    });
    return () => unsubscribe();
  }, [user]);

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = !filteredCategory || task.category === filteredCategory;
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTaskPress = (task: Task) => {
    router.push(`/task/${task.id}`);
  };

  const handleAccept = (task: Task) => {
    router.push(`/task/${task.id}?action=accept`);
  };

  const handleCounter = (task: Task) => {
    router.push(`/task/${task.id}?action=counter`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={isClient ? 'Search your tasks...' : 'What work are you looking for?'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      {!isClient && (
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ key: null as Category | null, label: 'All' }, ...CATEGORIES.map((c) => ({ key: c.key, label: c.label }))]}
            keyExtractor={(item) => item.label}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <Chip
                selected={filteredCategory === item.key}
                onPress={() => setFilteredCategory(item.key)}
                style={[
                  styles.filterChip,
                  filteredCategory === item.key && styles.filterChipActive,
                ]}
                textStyle={[
                  styles.filterChipText,
                  filteredCategory === item.key && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Chip>
            )}
          />
        </View>
      )}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => handleTaskPress(item)}
            showActions={!isClient && item.status === 'open'}
            onAccept={() => handleAccept(item)}
            onCounter={() => handleCounter(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {isClient ? 'No tasks yet' : 'No jobs available'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isClient
                ? 'Post your first task and get offers in minutes!'
                : 'New jobs will appear here in real time'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: SPACING.xs,
  },
  searchbar: {
    backgroundColor: '#111111',
    borderRadius: 14,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#1E293B',
    height: 52,
  },
  searchInput: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterList: {
    paddingHorizontal: SPACING.md,
    gap: 10,
  },
  filterChip: {
    backgroundColor: '#111111',
    borderColor: '#1E293B',
    height: 36,
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  filterChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
});
