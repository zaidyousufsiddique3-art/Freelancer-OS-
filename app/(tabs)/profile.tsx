import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { getCategoryInfo } from '../../constants/categories';
import { signOutUser } from '../../services/auth';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);

  const handleSignOut = async () => {
    await signOutUser();
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <Avatar.Text
          size={80}
          label={user.name.charAt(0).toUpperCase()}
          style={{ backgroundColor: '#C1F21D' }}
          labelStyle={{ color: '#000000', fontWeight: '800' }}
        />
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.roleBadge}>
          <MaterialCommunityIcons
            name={user.role === 'client' ? 'account-search' : 'briefcase'}
            size={14}
            color="#000000"
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

      {/* Logout Button - RED */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#FFFFFF" />
          <Text style={styles.signOutLabel}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 60,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: SPACING.md,
    backgroundColor: '#FFFFFF',
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111111',
    marginTop: 20,
    letterSpacing: -1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C1F21D',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    textTransform: 'uppercase',
  },
  email: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
  },
  divider: {
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bio: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#111111',
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
    backgroundColor: '#EF4444',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  signOutLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
