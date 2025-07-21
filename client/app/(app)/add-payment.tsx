// app/(app)/add-payment.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import api from '../../services/api';
import { isAxiosError } from 'axios';
import Animated, { FadeIn } from 'react-native-reanimated';

type KeypadButtonProps = {
    value: string;
    onPress: (value: string) => void;
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { alignItems: 'center', padding: 16, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Colors.border },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
    recipientInput: {
        height: 50,
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.border,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text,
    },
    amountContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 24 },
    currencySymbol: { fontSize: 40, color: Colors.textSecondary, fontWeight: '300' },
    amountText: { fontSize: 80, fontWeight: 'bold', color: Colors.text, marginLeft: 8 },
    keypadContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    keypadButton: { width: '33.33%', height: 80, justifyContent: 'center', alignItems: 'center' },
    keypadButtonText: { fontSize: 32, color: Colors.text },
    payButton: { margin: 16, backgroundColor: Colors.primary, padding: 18, borderRadius: 12, alignItems: 'center' },
    payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    statusOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.95)', justifyContent: 'center', alignItems: 'center', gap: 20 },
    statusIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
    statusTitle: { fontSize: 24, fontWeight: 'bold' },
    statusMessage: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 },
    tryAgainButton: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, marginTop: 20 },
    tryAgainText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const KeypadButton = ({ value, onPress }: KeypadButtonProps) => (
    <TouchableOpacity style={styles.keypadButton} onPress={() => onPress(value)}>
        {value === 'backspace' ? <Ionicons name="backspace-outline" size={32} color={Colors.text} /> : <Text style={styles.keypadButtonText}>{value}</Text>}
    </TouchableOpacity>
);

export default function AddPaymentScreen() {
    const [amount, setAmount] = useState('');
    const [receiver, setReceiver] = useState(''); // State for the receiver's name
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
    const router = useRouter();

    const handleKeyPress = (key: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (key === 'backspace') setAmount(prev => prev.slice(0, -1));
        else if (key === '.' && amount.includes('.')) return;
        else if (amount.length < 10) setAmount(prev => prev + key);
    };

    const handlePayment = async () => {
        if (!receiver.trim()) {
            alert('Please enter a receiver.');
            return;
        }
        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        
        setLoading(true);
        try {
            const paymentData = { 
                amount: numericAmount, 
                receiver: receiver.trim(), // Use the dynamic receiver name
                status: 'Success', 
                method: 'UPI' 
            };
            await api.post('/payments', paymentData);
            setPaymentStatus('success');
        } catch (error) {
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    const resetScreen = (goBack: boolean) => {
        setAmount('');
        setReceiver('');
        setPaymentStatus('idle');
        if (goBack) {
            router.back();
        }
    };

    if (paymentStatus === 'success') {
        return (
            <Animated.View style={styles.statusOverlay} entering={FadeIn}>
                <View style={[styles.statusIconContainer, { backgroundColor: Colors.primaryLight }]}>
                    <Ionicons name="checkmark-circle-outline" size={60} color={Colors.primary} />
                </View>
                <Text style={[styles.statusTitle, { color: Colors.primary }]}>Payment Successful!</Text>
                <Text style={styles.statusMessage}>You have successfully sent ₹{parseFloat(amount).toLocaleString()} to {receiver}.</Text>
                <TouchableOpacity style={styles.tryAgainButton} onPress={() => resetScreen(true)}>
                    <Text style={styles.tryAgainText}>Done</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
    
    if (paymentStatus === 'failed') {
        return (
            <Animated.View style={styles.statusOverlay} entering={FadeIn}>
                <View style={[styles.statusIconContainer, { backgroundColor: Colors.dangerLight }]}>
                    <Ionicons name="close-circle-outline" size={60} color={Colors.danger} />
                </View>
                <Text style={[styles.statusTitle, { color: Colors.danger }]}>Payment Failed</Text>
                <Text style={styles.statusMessage}>We couldn't process your payment. Please check your connection and try again.</Text>
                <TouchableOpacity style={styles.tryAgainButton} onPress={() => resetScreen(false)}>
                    <Text style={styles.tryAgainText}>Try Again</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Send Money</Text>
                <TextInput
                    style={styles.recipientInput}
                    placeholder="Enter Receiver's Name or ID"
                    placeholderTextColor={Colors.textSecondary}
                    value={receiver}
                    onChangeText={setReceiver}
                />
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <Text style={styles.amountText} numberOfLines={1} adjustsFontSizeToFit>{amount || '0'}</Text>
            </View>
            <View style={styles.keypadContainer}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map(key => (
                    <KeypadButton key={key} value={key} onPress={handleKeyPress} />
                ))}
            </View>
            <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payButtonText}>Proceed to Pay</Text>}
            </TouchableOpacity>
        </SafeAreaView>
    );
}
