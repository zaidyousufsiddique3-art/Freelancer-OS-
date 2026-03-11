import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import TaskCard from '../../components/TaskCard';
import StatusBadge from '../../components/StatusBadge';
import { Task, TaskStatus } from '../../types';
import { subscribeUserProjects } from '../../services/tasks';

type ProjectFilter = 'active' | 'completed' | 'all';

export default function ProjectsScreen() {
  const user = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState<ProjectFilter>('active');
  const [projects, setProjects] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeUserProjects(user.id, user.role, (tasks) => {
      setProjects(tasks);
    });
    return () => unsubscribe();
  }, [user]);

  const filteredProjects = projects.filter((p) => {
    if (filter === 'active') return ['assigned', 'in_progress'].includes(p.status);
    if (filter === 'completed') return p.status === 'completed';
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={(v) => setFilter(v as ProjectFilter)}
          buttons={[
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'all', label: 'All' },
          ]}
        />
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={() => router.push(`/task/${item.id}`)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No projects yet</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'active'
                ? 'Your active projects will appear here'
                : 'Completed projects will show up here'}
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
    backgroundColor: '#FFFFFF',
  },
  filterContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
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
    color: '#111111',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
