import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface MenuItem {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    route?: string;
}

const menuItems: MenuItem[] = [
    { id: '1', label: 'My Business', icon: 'analytics-outline' },
    { id: '2', label: 'Bank & Money', icon: 'business-outline' },
    { id: '3', label: 'Employees', icon: 'people-outline' },
    { id: '4', label: 'Stock', icon: 'cube-outline' },
    { id: '5', label: 'Journal Entry', icon: 'book-outline' },
    { id: '6', label: 'Community', icon: 'people-circle-outline' },
    { id: '7', label: 'Help & Support', icon: 'help-circle-outline' },
    { id: '8', label: 'Subscription', icon: 'card-outline' },
    { id: '9', label: 'Settings', icon: 'settings-outline' },
];

export default function MoreBusinessScreen() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleMenuItemPress = (item: MenuItem) => {
        // TODO: Navigate to respective screens when they are implemented
        console.log(`Pressed: ${item.label}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Blue Header Section */}
            <LinearGradient
                colors={['#1e3a8a', '#1e3a8a']}
                style={styles.header}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#f59e0b" />
                </TouchableOpacity>

                {/* Title */}
                <Text style={styles.headerTitle}>MORE</Text>

                {/* White Card with "My Business" */}
                <View style={styles.businessCard}>
                    <Text style={styles.businessCardText}>My Business</Text>
                </View>
            </LinearGradient>

            {/* Menu Items List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuItem}
                        onPress={() => handleMenuItemPress(item)}
                        activeOpacity={0.7}
                    >
                        {/* Icon Circle */}
                        <View style={styles.iconCircle}>
                            <Ionicons name={item.icon} size={24} color="#ffffff" />
                        </View>

                        {/* Label */}
                        <Text style={styles.menuLabel}>{item.label}</Text>

                        {/* Chevron */}
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                ))}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Powered by</Text>
                    <View style={styles.footerIcon}>
                        <Text style={styles.footerIconText}>A</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 60,
        alignItems: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 10,
        zIndex: 10,
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f59e0b',
        marginTop: 8,
    },
    businessCard: {
        position: 'absolute',
        bottom: -20,
        backgroundColor: '#ffffff',
        width: '90%',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    businessCardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1e3a8a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#1e293b',
    },
    footer: {
        marginTop: 40,
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#94a3b8',
        marginRight: 6,
    },
    footerIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#1e3a8a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerIconText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
