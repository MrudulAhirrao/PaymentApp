// app/_layout.tsx
// Purpose: Corrected root navigator that prevents navigation before the layout is mounted.

import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';

// Define the authentication context
const AuthContext = React.createContext<{ 
  isAuthenticated: boolean; 
  setAuthenticated: (isAuthenticated: boolean) => void; 
} | null>(null);

// Custom hook to easily access auth state
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Main navigation and authentication logic component
function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, setAuthenticated } = useAuth();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        setAuthenticated(!!token); // Set authenticated to true if token exists, false otherwise
      } catch (e) {
        console.error("Error loading token from storage", e);
      } finally {
        setLoading(false); // Loading is complete
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    // 1. Guard clause: Do nothing if we are still loading
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // 2. If the user is not authenticated and is not in the auth group,
    //    redirect them to the login page.
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } 
    // 3. If the user is authenticated and is in the auth group (e.g., on the login page),
    //    redirect them to the main app dashboard.
    else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [isAuthenticated, isLoading, segments]); // Dependencies for the effect

  // Show a loading indicator while the token is being checked
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // Once loading is complete, render the current route
  return <Slot />;
}

// The main export which provides the context to the rest of the app
export default function RootLayout() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </AuthContext.Provider>
  );
}