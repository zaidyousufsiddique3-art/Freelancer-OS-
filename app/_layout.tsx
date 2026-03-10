import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { paperTheme, COLORS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';
import { initAuthListener } from '../services/auth';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <StatusBar style="light" />
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' }
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
