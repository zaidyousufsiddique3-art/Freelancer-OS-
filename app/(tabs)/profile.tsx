import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, Button, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { getCategoryInfo } from '../../constants/categories';
import { signOutUser } from '../../services/auth';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOutUser();
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <Avatar.Text
          size={80}
          label={user.name.charAt(0).toUpperCase()}
          style={{ backgroundColor: COLORS.primary }}
        />
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.roleBadge}>
          <MaterialCommunityIcons
            name={user.role === 'client' ? 'account-search' : 'briefcase'}
            size={14}
            color={COLORS.primary}
          />
          <Text style={styles.roleText}>
            {user.role === 'client' ? 'Client' : 'Freelancer'}
          </Text>
        </View>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Bio */}
      {user.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>
      ) : null}

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.chipContainer}>
            {user.skills.map((skill) => (
              <Chip key={skill} style={styles.skillChip} textStyle={styles.skillText}>
                {skill}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Categories */}
      {user.categories && user.categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {user.role === 'freelancer' ? 'Work Categories' : 'Hiring Categories'}
          </Text>
          <View style={styles.chipContainer}>
            {user.categories.map((cat) => {
              const info = getCategoryInfo(cat);
              return (
                <Chip
                  key={cat}
                  style={[styles.categoryChip, { backgroundColor: info.color + '15' }]}
                  textStyle={[styles.categoryText, { color: info.color }]}
                  icon={() => (
                    <MaterialCommunityIcons
                      name={info.icon as any}
                      size={14}
                      color={info.color}
                    />
                  )}
                >
                  {info.label}
                </Chip>
              );
            })}
          </View>
        </View>
      )}

      <Divider style={styles.divider} />

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.signOutButton}
          labelStyle={styles.signOutLabel}
          icon="logout"
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingBottom: 60,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.md,
    backgroundColor: '#000000',
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 20,
    letterSpacing: -1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  email: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
  },
  divider: {
    backgroundColor: '#1E293B',
    marginVertical: 10,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bio: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    backgroundColor: '#111111',
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryChip: {
    height: 32,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  signOutButton: {
    borderColor: '#EF4444',
    borderRadius: 12,
    borderWidth: 1.5,
    height: 52,
    justifyContent: 'center',
  },
  signOutLabel: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});
