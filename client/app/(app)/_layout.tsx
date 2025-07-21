// app/(app)/_layout.tsx
// Purpose: Defines the Drawer (Sidebar) Navigator for the main app.

import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function AppLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="index" // This is the Dashboard: app/(app)/index.tsx
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="transactions/index" // This is the List: app/(app)/transactions/index.tsx
        options={{
          drawerLabel: 'Transactions',
          title: 'All Transactions',
          drawerIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
       <Drawer.Screen
        name="add-payment" // This is the Add Payment screen: app/(app)/add-payment.tsx
        options={{
          drawerLabel: 'Add Payment',
          title: 'Add New Payment',
          drawerIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile" // This is the Profile screen: app/(app)/profile.tsx
        options={{
          drawerLabel: 'Profile',
          title: 'My Profile',
          drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />
       <Drawer.Screen
        name="transactions/[id]" // This screen will be hidden from the drawer
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Transaction Details',
        }}
      />
    </Drawer>
  );
}