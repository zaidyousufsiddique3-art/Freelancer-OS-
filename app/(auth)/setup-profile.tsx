import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CategoryPicker from '../../components/CategoryPicker';
import { Category, UserRole } from '../../types';
import { signUp, updateUserProfile } from '../../services/auth';

export default function SetupProfileScreen() {
  const params = useLocalSearchParams<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    country?: string;
    password?: string;
    role?: string;
  }>();

  const [serviceTitle, setServiceTitle] = useState('');
  const [bio, setBio] = useState(''); // Service description
  const [priceRange, setPriceRange] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // If we randomly arrive without pass data or role is client, go back to role selection
    if (!params.email || params.role !== 'freelancer') {
      router.replace('/(auth)/role-select');
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories([cat]); // Only allowing one primary service category as it's common for service registration
  };

  const handleComplete = async () => {
    if (!serviceTitle.trim() || !bio.trim() || !priceRange.trim() || !deliveryTime.trim() || selectedCategories.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields and select a category.');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${params.firstName?.trim() || ''} ${params.lastName?.trim() || ''}`.trim();

      // 1. Create the user account FIRST
      await signUp(
        params.email!,
        params.password!,
        fullName,
        params.role as UserRole
      );

      // 2. Immediately update the profile with the mandatory Service details
      await updateUserProfile({
        serviceTitle: serviceTitle.trim(),
        bio: bio.trim(), // Acts as Service Description
        priceRange: priceRange.trim(),
        deliveryTime: deliveryTime.trim(),
        skills: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        categories: selectedCategories,
      });

      // 3. User is now registered + service created -> Dashboard
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>Register Your Service</Text>
        <Text style={styles.subtitle}>
          This is mandatory. Describe your service to create your account.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Title <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            value={serviceTitle}
            onChangeText={setServiceTitle}
            mode="outlined"
            placeholder="e.g. Professional Web Design"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            outlineColor="#E5E5E5"
            activeOutlineColor="#C1F21D"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Category <Text style={{ color: 'red' }}>*</Text></Text>
          <CategoryPicker
            selected={selectedCategories.length > 0 ? selectedCategories[0] : null}
            onSelect={toggleCategory}
            multiple={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Description <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Describe what you will do, your process, and what the client gets..."
            style={styles.textArea}
            outlineStyle={styles.inputOutline}
            outlineColor="#E5E5E5"
            activeOutlineColor="#C1F21D"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.section, styles.halfField]}>
            <Text style={styles.sectionTitle}>Price Range <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              value={priceRange}
              onChangeText={setPriceRange}
              mode="outlined"
              placeholder="$50 - $200"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor="#E5E5E5"
              activeOutlineColor="#C1F21D"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={[styles.section, styles.halfField]}>
            <Text style={styles.sectionTitle}>Delivery Time <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              value={deliveryTime}
              onChangeText={setDeliveryTime}
              mode="outlined"
              placeholder="e.g. 3 Days"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor="#E5E5E5"
              activeOutlineColor="#C1F21D"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills (Comma separated)</Text>
          <TextInput
            value={skills}
            onChangeText={setSkills}
            mode="outlined"
            placeholder="React, Design, Excel"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            outlineColor="#E5E5E5"
            activeOutlineColor="#C1F21D"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Complete button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            loading && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={[
            styles.completeButtonText,
            loading && styles.completeButtonTextDisabled,
          ]}>
            {loading ? 'Creating Account...' : 'Register My Service'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 70 : 56,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 24,
    fontWeight: '400',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    height: 48,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    minHeight: 100,
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  completeButton: {
    backgroundColor: '#C1F21D',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  completeButtonDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  completeButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
