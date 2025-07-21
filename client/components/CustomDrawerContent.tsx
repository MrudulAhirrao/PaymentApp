// components/CustomDrawerContent.tsx

import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../app/_layout';
import { logout } from '../utils/auth';
import Colors from '../constants/Colors';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { setAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    router.replace('/(auth)/login');
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View style={styles.header}>
        {/* --- IMAGE SOURCE CHANGED TO A URI --- */}
        <Image 
          source={{ uri: 'https://img.icons8.com/color/96/google-pay-india.png' }} 
          style={styles.logo} 
        />
      </View>
      
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      <TouchableOpacity style={styles.footerItem} onPress={() => {}}>
        <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
        <Text style={styles.footerText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={Colors.textSecondary} />
        <Text style={styles.footerText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    footerText: {
        color: Colors.textSecondary,
        fontWeight: '500',
        fontSize: 16
    }
});