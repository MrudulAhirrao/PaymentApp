// app/(app)/transactions/[id].tsx


import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import api from '../../../services/api';
import { useEffect, useState } from 'react';

type Transaction = {
  id: number;
  amount: number;
  receiver: string;
  method: string;
  status: string;
  createdAt: string;
};

export default function TransactionDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const transactionId = Array.isArray(id) ? id[0] : id;
            const fetchTransaction = async () => {
                try {
                    const response = await api.get(`/payments/${transactionId}`);
                    setTransaction(response.data);
                } catch (error) {
                    console.error("Failed to fetch transaction details:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTransaction();
        }
    }, [id]);

    if (loading) {
        return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color={Colors.primary} /></SafeAreaView>;
    }

    if (!transaction) {
        return <SafeAreaView style={styles.container}><Text style={styles.errorText}>Transaction not found.</Text></SafeAreaView>;
    }
    
    const isSuccess = transaction.status.toLowerCase() === 'success';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.receiptHeader}>
                    <Ionicons name={isSuccess ? "receipt" : "alert-circle"} size={60} color={isSuccess ? Colors.primary : Colors.danger} />
                    <Text style={styles.receiptAmount}>₹{transaction.amount.toLocaleString()}</Text>
                    <Text style={styles.receiptStatus}>
                        Payment to {transaction.receiver} was {isSuccess ? 'successful' : 'failed'}.
                    </Text>
                </View>
                <View style={styles.detailsCard}>
                    <Text style={styles.cardTitle}>Details</Text>
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Date</Text><Text style={styles.detailValue}>{new Date(transaction.createdAt).toDateString()}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Time</Text><Text style={styles.detailValue}>{new Date(transaction.createdAt).toLocaleTimeString()}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Method</Text><Text style={styles.detailValue}>{transaction.method}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Status</Text><Text style={[styles.detailValue, {color: isSuccess ? Colors.primary : Colors.danger}]}>{transaction.status}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLabel}>Transaction ID</Text><Text style={styles.detailValue} selectable>{transaction.id}</Text></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    receiptHeader: { alignItems: 'center', padding: 24, backgroundColor: Colors.surface },
    receiptAmount: { fontSize: 48, fontWeight: 'bold', color: Colors.text, marginVertical: 8 },
    receiptStatus: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
    detailsCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 12, padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
    detailLabel: { fontSize: 16, color: Colors.textSecondary },
    detailValue: { fontSize: 16, fontWeight: '600', color: Colors.text, maxWidth: '60%' },
    errorText: { textAlign: 'center', marginTop: 50, color: Colors.danger, fontSize: 18 },
});
