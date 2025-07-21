// app/(auth)/register.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeInDown, FadeInUp } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import api from '../../services/api';
import { isAxiosError } from 'axios'; // Import the type guard

// --- Reusable Animated Input Component ---
type AnimatedInputProps = {
    placeholder: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    isPassword?: boolean;
    value: string;
    onChangeText: (text: string) => void;
};

const AnimatedTextInput = ({ placeholder, icon, isPassword = false, value, onChangeText }: AnimatedInputProps) => {
    const [isFocused, setFocused] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(!isPassword);
    const isLabelUp = isFocused || !!value;
    const animatedLabelStyle = useAnimatedStyle(() => {
        const top = withTiming(isLabelUp ? -10 : 18, { duration: 200 });
        const fontSize = withTiming(isLabelUp ? 12 : 16, { duration: 200 });
        return { top, fontSize };
    });
    const handleFocus = () => { setFocused(true); };
    const handleBlur = () => { setFocused(false); };
    return (
        <View style={[styles.inputContainer, isFocused && styles.focusedInput]}>
            <Ionicons name={icon} size={22} color={isFocused ? Colors.primary : Colors.textSecondary} style={styles.inputIcon} />
            <View style={styles.fieldWrapper}>
                <Animated.Text style={[styles.label, isFocused && { color: Colors.primary }, animatedLabelStyle]} pointerEvents="none">{placeholder}</Animated.Text>
                <TextInput style={styles.input} onFocus={handleFocus} onBlur={handleBlur} secureTextEntry={!isPasswordVisible} value={value} onChangeText={onChangeText} cursorColor={Colors.primary} autoCapitalize="none" />
            </View>
            {isPassword && (
                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                    <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Missing Fields', 'Please fill out all the details.');
            return;
        }
        setLoading(true);
        try {
            // Use email as the username for simplicity
            await api.post('/auth/register', { username: email, password });
            Alert.alert('Registration Successful', 'You can now sign in.', [
                { text: 'OK', onPress: () => router.push('/(auth)/login') },
            ]);
        } catch (error) {
            // Use the type guard to safely access the error message
            if (isAxiosError(error)) {
                Alert.alert('Registration Failed', error.response?.data?.message || 'An error occurred.');
            } else {
                Alert.alert('Registration Failed', 'An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={styles.header} entering={FadeInDown.duration(1000).springify()}>
                <View style={styles.logoContainer}><Ionicons name="person-add" size={50} color="#fff" /></View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join FinDash today</Text>
            </Animated.View>
            <View style={styles.form}>
                <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()}>
                    <AnimatedTextInput placeholder="Full Name" icon="person-outline" value={name} onChangeText={setName} />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(400).duration(1000).springify()}>
                    <AnimatedTextInput placeholder="Email Address" icon="at-outline" value={email} onChangeText={setEmail} />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(600).duration(1000).springify()}>
                    <AnimatedTextInput placeholder="Password" icon="lock-closed-outline" isPassword value={password} onChangeText={setPassword} />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(800).duration(1000).springify()}>
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                    </TouchableOpacity>
                </Animated.View>
            </View>
            <Animated.View style={styles.footer} entering={FadeInUp.delay(1000).duration(1000).springify()}>
                <Text style={styles.footerText}>
                    Already have an account?{' '}
                    <Link href="/(auth)/login" asChild><Pressable><Text style={styles.link}>Sign In</Text></Pressable></Link>
                </Text>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40 },
    logoContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 32, fontWeight: '800', color: Colors.text },
    subtitle: { fontSize: 18, color: Colors.textSecondary, marginTop: 8 },
    form: { paddingHorizontal: 24, gap: 20 },
    inputContainer: { height: 60, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, flexDirection: 'row' },
    focusedInput: { borderColor: Colors.primary },
    inputIcon: { paddingLeft: 16, alignSelf: 'center' },
    fieldWrapper: { flex: 1, justifyContent: 'center', height: '100%' },
    label: { position: 'absolute', left: 16, color: Colors.textSecondary, backgroundColor: Colors.surface, paddingHorizontal: 4, zIndex: 1 },
    input: { paddingHorizontal: 20, fontSize: 16, color: Colors.text, height: '100%', paddingTop: 12 },
    eyeIcon: { padding: 16, alignSelf: 'center' },
    button: { backgroundColor: Colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    footer: { position: 'absolute', bottom: 0, width: '100%', paddingBottom: 40 },
    footerText: { textAlign: 'center', color: Colors.textSecondary },
    link: { color: Colors.primary, fontWeight: '700' },
});
