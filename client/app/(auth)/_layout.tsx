// app/(auth)/_layout.tsx
// Purpose: Defines the stack navigator for authentication screens.

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerTitle: 'Create Account', headerBackTitle: 'Login' }} />
    </Stack>
  );
}