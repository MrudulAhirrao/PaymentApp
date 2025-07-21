// app/(app)/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TransactionCard from '../../components/TransactionCard';
import Colors from '../../constants/Colors';
import api from '../../services/api';
import { isAxiosError } from 'axios';

// --- TYPE DEFINITIONS for API data ---
type Stats = {
  totalRevenue: number;
  totalCount: number;
  failedCount: number;
};

type Transaction = {
  id: number;
  amount: number;
  receiver: string;
  method: string;
  status: string;
  createdAt: string; // This matches your backend entity
};

type ActionButtonProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    text: string;
    onPress: () => void;
};

const ActionButton = ({ icon, text, onPress }: ActionButtonProps) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <View style={styles.actionIconContainer}>
            <Ionicons name={icon} size={24} color={Colors.primary} />
        </View>
        <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
);

const Header = () => (
    <View style={styles.header}>
        <View>
            <Text style={styles.headerWelcome}>Hello, Admin</Text>
            <Text style={styles.headerDate}>{new Date().toDateString()}</Text>
        </View>
        <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color={Colors.text} />
        </TouchableOpacity>
    </View>
);

export default function DashboardScreen() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // No need to set loading true here, useFocusEffect handles initial load
            const [statsRes, transactionsRes] = await Promise.all([
                api.get('/payments/stats'),
                api.get('/payments'),
            ]);
            setStats(statsRes.data);
            if (Array.isArray(transactionsRes.data)) {
                setRecentTransactions(transactionsRes.data.slice(0, 2));
            }
        } catch (error) {
            if (isAxiosError(error)) {
                console.error("Failed to fetch dashboard data:", error.response?.data || error.message);
            } else {
                console.error("An unexpected error occurred:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    // useFocusEffect refetches data every time the screen is viewed
    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            fetchData();
        }, [])
    );

    if (loading && !stats) {
        return (
            <SafeAreaView style={styles.container}>
                <Header />
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Revenue</Text>
                    <Text style={styles.balanceAmount}>₹{stats?.totalRevenue.toLocaleString('en-IN') || '0.00'}</Text>
                </LinearGradient>

                <View style={styles.actionsContainer}>
                    <ActionButton icon="paper-plane-outline" text="Send" onPress={() => router.push('/(app)/add-payment')} />
                    <ActionButton icon="scan-outline" text="Scan QR" onPress={() => router.push('/(app)/scanner')} />
                </View>

                <View style={styles.transactionsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => router.push('/(app)/transactions')}>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    {recentTransactions.map(tx => (
                        <TouchableOpacity key={tx.id} onPress={() => router.push(`/(app)/transactions/${tx.id}`)}>
                            <TransactionCard transaction={tx} />
                        </TouchableOpacity>
                    ))}
                    {recentTransactions.length === 0 && !loading && (
                        <Text style={styles.noTransactionsText}>No recent transactions found.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    headerWelcome: { color: Colors.textSecondary, fontSize: 16 },
    headerDate: { color: Colors.text, fontSize: 20, fontWeight: 'bold' },
    balanceCard: { margin: 16, padding: 24, borderRadius: 20, elevation: 10, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
    balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
    balanceAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 8 },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, paddingHorizontal: 16 },
    actionItem: { alignItems: 'center', gap: 8 },
    actionIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
    actionText: { color: Colors.textSecondary, fontWeight: '600' },
    transactionsSection: { paddingHorizontal: 16, marginTop: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
    viewAll: { color: Colors.primary, fontWeight: '600' },
    noTransactionsText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 20 },
});
