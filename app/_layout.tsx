import { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { paperTheme, COLORS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';
import { initAuthListener, signOutUser } from '../services/auth';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Force logout on first load for the current tab session so it defaults to onboarding
    if (Platform.OS === 'web') {
      if (!sessionStorage.getItem('app_started')) {
        signOutUser().catch(() => { });
        sessionStorage.setItem('app_started', 'true');
      }
    }

    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#C1F21D" />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' }
        }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="task/[id]"
                options={{ headerShown: true, title: 'Task Details' }}
              />
              <Stack.Screen
                name="chat/[id]"
                options={{ headerShown: true, title: 'Chat' }}
              />
              <Stack.Screen
                name="offers/[taskId]"
                options={{ headerShown: true, title: 'Offers' }}
              />
            </>
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
      </View>
    </PaperProvider>
  );
}
