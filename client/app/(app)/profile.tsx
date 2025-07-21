// app/(app)/profile.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../_layout';
import { logout } from '../../utils/auth';
import Colors from '../../constants/Colors';

type ProfileOptionProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  onPress: () => void;
};

const ProfileOption = ({ icon, text, onPress }: ProfileOptionProps) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <Ionicons name={icon} size={24} color={Colors.textSecondary} />
    <Text style={styles.optionText}>{text}</Text>
    <Ionicons name="chevron-forward-outline" size={22} color={Colors.textSecondary} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://placehold.co/100x100/E8F0FE/1A73E8?text=A' }} style={styles.avatar} />
        <Text style={styles.profileName}>Admin User</Text>
        <Text style={styles.profileEmail}>admin@test.com</Text>
      </View>

      <View style={styles.qrCard}>
        <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=admin@test.com' }} style={styles.qrCode} />
        <Text style={styles.qrText}>Your QR Code</Text>
      </View>

      <View style={styles.menuSection}>
        <ProfileOption icon="card-outline" text="Payment Methods" onPress={() => {}} />
        <ProfileOption icon="person-add-outline" text="Invite Friends" onPress={() => {}} />
        <ProfileOption icon="settings-outline" text="App Settings" onPress={() => {}} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={Colors.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  profileHeader: { alignItems: 'center', paddingVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  profileEmail: { fontSize: 16, color: Colors.textSecondary },
  qrCard: { margin: 16, padding: 20, backgroundColor: Colors.surface, borderRadius: 16, alignItems: 'center' },
  qrCode: { width: 150, height: 150 },
  qrText: { marginTop: 12, fontSize: 16, fontWeight: '500', color: Colors.textSecondary },
  menuSection: { marginHorizontal: 16, backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden' },
  optionRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionText: { flex: 1, fontSize: 16, color: Colors.text },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, margin: 16, padding: 16, borderRadius: 12, backgroundColor: '#FCE8E6' },
  logoutText: { color: Colors.danger, fontSize: 16, fontWeight: 'bold' },
});