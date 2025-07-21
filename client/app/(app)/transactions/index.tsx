// app/(app)/transactions/index.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TransactionCard from '../../../components/TransactionCard';
import Colors from '../../../constants/Colors';
import api from '../../../services/api';

type Transaction = {
  id: number;
  amount: number;
  receiver: string;
  method: string;
  status: string;
  createdAt: string;
};

export default function TransactionListScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/payments');
            // **FIX:** Ensure the response data is a valid array before setting state
            if (Array.isArray(response.data)) {
                setTransactions(response.data);
            } else {
                console.error("API did not return an array:", response.data);
                setTransactions([]); // Default to an empty array if data is invalid
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            setTransactions([]); // Also default to empty on API error
        } finally {
            setLoading(false);
        }
    };

    // useFocusEffect will refetch data every time the screen comes into view
    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            fetchTransactions();
        }, [])
    );

    const Header = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>All Transactions</Text>
            <TouchableOpacity>
                <Ionicons name="search-outline" size={26} color={Colors.text} />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
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
            <FlatList
                data={transactions}
                // **FIX:** A safer keyExtractor that handles undefined items or missing IDs
                keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({ item }) => {
                    // Add a check to prevent rendering invalid items
                    if (!item) return null;
                    return (
                        <TouchableOpacity onPress={() => router.push(`/(app)/transactions/${item.id}`)}>
                            <TransactionCard transaction={item} />
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchTransactions} colors={[Colors.primary]} />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
    emptyText: { textAlign: 'center', marginTop: 50, color: Colors.textSecondary, fontSize: 16 },
});
