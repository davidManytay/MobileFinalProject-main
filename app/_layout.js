import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// This is the main layout of the app
// It wraps your stack navigator with the AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const [isRouterReady, setRouterReady] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // The initial render might not have the router ready.
    // We wait for the first segment to be available.
    if (segments.length > 0) {
      setRouterReady(true);
    }
  }, [segments]);

  useEffect(() => {
    if (!isRouterReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) router.replace('/(auth)');
    else if (user && inAuthGroup) router.replace('/(tabs)/');
  }, [user, isRouterReady]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plan" options={{ title: 'Generated Lesson Plan' }} />
    </Stack>
  );
}
