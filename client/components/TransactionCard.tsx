// components/TransactionCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Define a specific type for the transaction prop for better type safety
type TransactionProps = {
    transaction: {
        id: number;
        amount: number;
        receiver: string;
        status: string;
        createdAt: string;
    } | null | undefined;
};

export default function TransactionCard({ transaction }: TransactionProps) {
    // **FIX:** Add a guard clause to prevent crashes if transaction data is invalid
    if (!transaction || !transaction.status || !transaction.receiver) {
        // Render nothing or a placeholder if the data is incomplete
        return null; 
    }

    const isSuccess = transaction.status.toLowerCase() === 'success';

    return (
        <View style={styles.card}>
            <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{transaction.receiver.charAt(0)}</Text>
                </View>
                <View>
                    <Text style={styles.receiver}>{transaction.receiver}</Text>
                    <Text style={styles.date}>{new Date(transaction.createdAt).toDateString()}</Text>
                </View>
            </View>
            <View style={styles.rightContent}>
                <Text style={[styles.amount, { color: isSuccess ? Colors.text : Colors.danger }]}>
                    {isSuccess ? `₹${transaction.amount.toLocaleString()}` : 'Failed'}
                </Text>
                <Ionicons
                    name={isSuccess ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={isSuccess ? Colors.success : Colors.danger}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
    leftContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
    receiver: { fontSize: 16, fontWeight: '600', color: Colors.text },
    date: { color: Colors.textSecondary, fontSize: 14 },
    rightContent: { alignItems: 'flex-end', flexDirection: 'row', gap: 4 },
    amount: { fontSize: 16, fontWeight: 'bold' },
});
