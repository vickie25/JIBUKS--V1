import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import apiService from '@/services/api';

const C = {
    navy: '#1a3a8f',
    navyDark: '#0e2470',
    gold: '#F59E0B',
    bg: '#F5F7FA',
    white: '#ffffff',
    text: '#1F2937',
    sub: '#6B7280',
    border: '#E5E7EB',
};

function ProgressRing({ pct, size = 64 }: { pct: number; size?: number }) {
    const r = (size - 10) / 2;
    const circumference = 2 * Math.PI * r;
    const filled = Math.min(pct, 100) / 100;
    const gap = circumference * (1 - filled);
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{
                position: 'absolute', width: size, height: size, borderRadius: size / 2,
                borderWidth: 5, borderColor: '#E5E7EB',
            }} />
            <View style={{
                position: 'absolute', width: size, height: size, borderRadius: size / 2,
                borderWidth: 5, borderColor: C.gold, borderRightColor: 'transparent',
                borderBottomColor: filled > 0.5 ? C.gold : 'transparent',
                transform: [{ rotate: `${-90 + filled * 360}deg` }],
                opacity: filled > 0 ? 1 : 0,
            }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.text }}>{Math.round(pct)}%</Text>
        </View>
    );
}

export default function AddToGoalScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const goalId = params.goalId as string;

    const [goal, setGoal] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash' | 'bank'>('mpesa');

    useEffect(() => {
        if (goalId) {
            loadGoal();
        }
    }, [goalId]);

    const loadGoal = async () => {
        try {
            setLoading(true);
            const data = await apiService.getGoal(parseInt(goalId));
            setGoal(data);
        } catch (error) {
            console.error('Error loading goal:', error);
            Alert.alert('Error', 'Failed to load goal');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return `KES ${value.toLocaleString()}`;
    };

    const handleSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        const contributionAmount = parseFloat(amount);
        const newTotal = goal.currentAmount + contributionAmount;

        if (newTotal > goal.targetAmount) {
            Alert.alert(
                'Exceeds Target',
                `This contribution would exceed your goal target. You only need ${formatCurrency(goal.remaining)} more.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Continue Anyway',
                        onPress: () => submitContribution(contributionAmount),
                    },
                ]
            );
            return;
        }

        submitContribution(contributionAmount);
    };

    const submitContribution = async (contributionAmount: number) => {
        try {
            setSubmitting(true);

            const result = await apiService.contributeToGoal(
                parseInt(goalId),
                contributionAmount,
                description || `Contribution to ${goal.name}`
            );

            const isCompleted = result.currentAmount >= result.targetAmount;

            Alert.alert(
                isCompleted ? '🎉 Goal Completed!' : 'Success!',
                isCompleted
                    ? `Congratulations! You've reached your goal of ${formatCurrency(result.targetAmount)}!`
                    : `Added ${formatCurrency(contributionAmount)} to ${goal.name}. You're now at ${result.progress}% of your goal!`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.error || 'Failed to add contribution');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={s.root}>
                <StatusBar barStyle="light-content" />
                <LinearGradient colors={[C.navy, C.navyDark]} style={s.header}>
                    <SafeAreaView>
                        <View style={s.headerRow}>
                            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={22} color={C.gold} />
                            </TouchableOpacity>
                            <Text style={s.headerTitle}>Top Up Goal</Text>
                            <View style={{ width: 38 }} />
                        </View>
                    </SafeAreaView>
                </LinearGradient>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={C.navy} />
                </View>
            </View>
        );
    }

    if (!goal) return null;

    const progress = parseFloat(goal.progress);
    const remaining = goal.remaining;

    const PAYMENT_METHODS = [
        { key: 'mpesa', label: 'M-PESA', icon: 'phone-portrait-outline' as const },
        { key: 'cash',  label: 'CASH',   icon: 'cash-outline' as const },
        { key: 'bank',  label: 'BANK',   icon: 'business-outline' as const },
    ];

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" />

            {/* ── HEADER ── */}
            <LinearGradient colors={[C.navy, C.navyDark]} style={s.header}>
                <SafeAreaView>
                    <View style={s.headerRow}>
                        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={22} color={C.gold} />
                        </TouchableOpacity>
                        <Text style={s.headerTitle}>Top Up Goal</Text>
                        <View style={{ width: 38 }} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

                {/* ── GOAL CARD ── */}
                <View style={s.card}>
                    <View style={s.cardRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.goalName}>{goal.name}</Text>
                            <Text style={s.goalDesc}>{(goal.description || 'SAVINGS GOAL').toUpperCase()}</Text>
                            <Text style={s.goalAmount}>{formatCurrency(goal.currentAmount)}</Text>
                            <Text style={s.goalOf}>of {formatCurrency(goal.targetAmount)}</Text>
                        </View>
                        <ProgressRing pct={progress} size={72} />
                    </View>
                    <View style={s.progressBar}>
                        <View style={[s.progressFill, { width: `${Math.min(progress, 100)}%` as any }]} />
                    </View>
                </View>

                {/* ── AMOUNT ── */}
                <View style={s.card}>
                    <Text style={s.fieldLabel}>TOP UP AMOUNT</Text>
                    <View style={s.amountRow}>
                        <Text style={s.amountKes}>KES</Text>
                        <TextInput
                            style={s.amountInput}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            placeholder="0"
                            placeholderTextColor="#CBD5E1"
                        />
                    </View>
                    <View style={s.chips}>
                        {[1000, 5000, 10000].map((v) => (
                            <TouchableOpacity key={v} style={s.chip}
                                onPress={() => setAmount((prev) => ((parseFloat(prev) || 0) + v).toString())}>
                                <Text style={s.chipTxt}>+{v.toLocaleString()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ── PAYMENT METHOD ── */}
                <View style={s.card}>
                    <Text style={s.fieldLabel}>PAYMENT METHOD</Text>
                    <View style={s.pmRow}>
                        {PAYMENT_METHODS.map((m) => {
                            const active = paymentMethod === m.key;
                            return (
                                <TouchableOpacity key={m.key} style={[s.pmBtn, active && s.pmBtnActive]}
                                    onPress={() => setPaymentMethod(m.key as any)}>
                                    <Ionicons name={m.icon} size={22} color={active ? C.gold : C.sub} />
                                    <Text style={[s.pmLabel, active && s.pmLabelActive]}>{m.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ── NOTE ── */}
                <View style={s.card}>
                    <Text style={s.fieldLabel}>ADD A NOTE (OPTIONAL)</Text>
                    <TextInput
                        style={s.noteInput}
                        placeholder="What's this for?"
                        placeholderTextColor="#9CA3AF"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* ── SUBMIT ── */}
                <TouchableOpacity style={[s.submitBtn, submitting && { opacity: 0.7 }]}
                    onPress={handleSubmit} disabled={submitting}>
                    {submitting ? <ActivityIndicator color="#fff" /> : (
                        <Text style={s.submitTxt}>Top Up  →</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    header: { paddingBottom: 20, paddingHorizontal: 20 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 },
    backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: C.gold, fontSize: 18, fontWeight: '700' },
    card: { backgroundColor: C.white, borderRadius: 16, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
    cardRow: { flexDirection: 'row', alignItems: 'center' },
    goalName: { fontSize: 18, fontWeight: '700', color: C.navy },
    goalDesc: { fontSize: 11, color: C.sub, marginTop: 2, marginBottom: 8 },
    goalAmount: { fontSize: 22, fontWeight: '800', color: C.navy },
    goalOf: { fontSize: 13, color: C.sub },
    progressBar: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginTop: 14, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: C.gold, borderRadius: 3 },
    fieldLabel: { fontSize: 11, fontWeight: '600', color: C.sub, letterSpacing: 0.5, marginBottom: 12 },
    amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
    amountKes: { fontSize: 20, fontWeight: '600', color: C.sub },
    amountInput: { flex: 1, fontSize: 38, fontWeight: '800', color: C.navy },
    chips: { flexDirection: 'row', gap: 8, marginTop: 16 },
    chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: C.border },
    chipTxt: { fontSize: 13, fontWeight: '600', color: C.sub },
    pmRow: { flexDirection: 'row', gap: 10 },
    pmBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, gap: 4 },
    pmBtnActive: { borderColor: C.gold, backgroundColor: '#FFFBEB' },
    pmLabel: { fontSize: 11, fontWeight: '600', color: C.sub },
    pmLabelActive: { color: C.gold },
    noteInput: { borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, fontSize: 14, color: C.text, minHeight: 52 },
    submitBtn: { backgroundColor: C.gold, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6 },
    submitTxt: { color: C.white, fontSize: 17, fontWeight: '700' },
    // legacy — unused but keeps TS happy
    container: { flex: 1 },
});
