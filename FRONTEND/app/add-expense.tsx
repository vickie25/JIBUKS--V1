import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import apiService from '@/services/api';

const { width } = Dimensions.get('window');

// Premium Design System
const COLORS = {
  primary: '#122f8a',      // Deep Blue
  secondary: '#fe9900',    // Brand Orange
  success: '#10b981',
  danger: '#ef4444',
  text: '#1e293b',
  textLight: '#64748b',
  bg: '#f1f5f9',
  white: '#ffffff',
  border: '#e2e8f0',
  cardBg: '#ffffff',
};

type TaxTreatment = 'Exclusive of Tax' | 'Inclusive of Tax' | 'Out of Scope of Tax';

interface LineItem {
  id: string;
  categoryId: string | null;
  categoryName: string;
  description: string;
  amount: string;
  vatRateId: string | null;
  vatRate: number;
}

export default function ExpenseScreen() {
  const router = useRouter();

  // --- CORE STATE ---
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [payee, setPayee] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [totalAmount, setTotalAmount] = useState('0.00');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [refNo, setRefNo] = useState('');
  const [taxTreatment, setTaxTreatment] = useState<TaxTreatment>('Exclusive of Tax');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);


  // --- DATA ---
  const [accounts, setAccounts] = useState<any[]>([]);
  const [expenseAccounts, setExpenseAccounts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [vatRates, setVatRates] = useState<any[]>([]);

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', categoryId: null, categoryName: 'Select Category', description: '', amount: '', vatRateId: null, vatRate: 0 }
  ]);

  // --- MODALS ---
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showTaxTreatmentModal, setShowTaxTreatmentModal] = useState(false);
  const [showVatModal, setShowVatModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [activeLineIndex, setActiveLineIndex] = useState(0);

  // --- LOAD DATA ---
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setPageLoading(true);
      const [accs, expAccs, sups, vats] = await Promise.all([
        apiService.getPaymentEligibleAccounts(),
        apiService.getAccounts({ type: 'EXPENSE' }),
        apiService.getVendors({ active: true }),
        apiService.getVatRates()
      ]);

      setAccounts(accs);
      setExpenseAccounts(expAccs);
      setSuppliers(sups);
      setVatRates(vats);

      // Default Account (Cash or M-Pesa)
      const defaultAcc = accs.find((a: any) => a.name.toLowerCase().includes('cash') || a.name.toLowerCase().includes('mpesa')) || accs[0];
      if (defaultAcc) {
        setSelectedAccountId(String(defaultAcc.id));
        setAccountBalance(defaultAcc.balance || 0);
      }
    } catch (error) {
      console.error('Failed to load data', error);
      Alert.alert('Error', 'Failed to load initial data');
    } finally {
      setPageLoading(false);
    }
  };


  // --- CALCULATION LOGIC ---
  useEffect(() => {
    const sum = lineItems.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);

    // Calculate VAT if exclusive
    let vatSum = 0;
    if (taxTreatment === 'Exclusive of Tax') {
      lineItems.forEach(item => {
        const amt = parseFloat(item.amount) || 0;
        const rate = (item.vatRate || 0) / 100;
        vatSum += amt * rate;
      });
    }

    setTotalAmount((sum + vatSum).toFixed(2));
  }, [lineItems, taxTreatment]);

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLineItems(newItems);
  };

  const addLine = () => {
    setLineItems([...lineItems, {
      id: Date.now().toString(),
      categoryId: null,
      categoryName: 'Select Category',
      description: '',
      amount: '',
      vatRateId: null,
      vatRate: 0
    }]);
  };

  const removeLine = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  // --- SAVE ---
  const handleSave = async () => {
    if (!payee || !selectedAccountId || parseFloat(totalAmount) <= 0) {
      Alert.alert('Missing Fields', 'Please fill in Payee, Account and at least one item.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        type: 'EXPENSE',
        amount: parseFloat(totalAmount),
        category: lineItems[0].categoryName || 'General Expense',
        description: lineItems[0].description || `Expense to ${payee}`,
        payee: payee,
        vendorId: selectedSupplierId ? parseInt(selectedSupplierId) : null,
        paymentMethod: paymentMethod,
        date: paymentDate.toISOString(),
        notes: refNo,
        creditAccountId: parseInt(selectedAccountId),
        splits: lineItems.map(item => ({
          category: item.categoryName,
          description: item.description || item.categoryName,
          amount: parseFloat(item.amount) || 0,
          vatRate: item.vatRate,
          accountId: item.categoryId
        })),
        taxTreatment: taxTreatment
      };

      await apiService.createTransaction(payload as any);

      Alert.alert('Success', 'Expense recorded successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  // --- UI COMPONENTS ---
  if (pageLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const selectedAccountName = accounts.find(a => String(a.id) === selectedAccountId)?.name || 'Select Account';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={[COLORS.primary, '#0a1a5c']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Record Expense</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Main Info Card */}
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Who did you pay? (Payee/Supplier)</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowSupplierModal(true)}>
              <Text style={styles.selectorText}>{payee || 'Select Supplier'}</Text>
              <Ionicons name="people-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>


          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Payment Account</Text>
              <TouchableOpacity style={styles.selector} onPress={() => setShowAccountModal(true)}>
                <Text style={styles.selectorText} numberOfLines={1}>{selectedAccountName}</Text>
                <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
              <Text style={styles.balanceText}>Balance: <Text style={{ fontWeight: '700', color: COLORS.success }}>KES {accountBalance.toLocaleString()}</Text></Text>
            </View>

            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Total Amount</Text>
              <View style={styles.amountBox}>
                <Text style={styles.currencyPrefix}>KES</Text>
                <Text style={styles.totalAmountText}>{parseFloat(totalAmount).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Payment Date</Text>
              <TouchableOpacity style={styles.selector} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.selectorText}>{paymentDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Payment Method</Text>
              <TouchableOpacity style={styles.selector} onPress={() => setShowPaymentMethodModal(true)}>
                <Text style={styles.selectorText}>{paymentMethod}</Text>
                <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Ref No.</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Reference #"
                value={refNo}
                onChangeText={setRefNo}
              />
            </View>

            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Amounts are</Text>
              <TouchableOpacity style={styles.selector} onPress={() => setShowTaxTreatmentModal(true)}>
                <Text style={styles.selectorText} numberOfLines={1}>{taxTreatment}</Text>
                <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Line Items Section */}
        <Text style={styles.sectionTitle}>Line Items</Text>
        {lineItems.map((item, index) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemIndex}>#{index + 1}</Text>
              <TouchableOpacity onPress={() => removeLine(index)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                  setActiveLineIndex(index);
                  setShowCategoryModal(true);
                }}
              >
                <Text style={styles.selectorText}>{item.categoryName}</Text>
                <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What was this for?"
                value={item.description}
                onChangeText={(v) => updateLineItem(index, 'description', v)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 2, marginRight: 10 }]}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={item.amount}
                  onChangeText={(v) => updateLineItem(index, 'amount', v)}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Tax Rate</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => {
                    setActiveLineIndex(index);
                    setShowVatModal(true);
                  }}
                >
                  <Text style={styles.selectorTextSmall}>{item.vatRate}%</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addLineBtn} onPress={addLine}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={styles.addLineText}>Add another item</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Save Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Expense</Text>}
        </TouchableOpacity>
      </View>

      {/* --- MODALS --- */}

      <SelectionModal
        visible={showAccountModal}
        title="Payment Account"
        options={accounts.map(a => ({ label: a.name, value: String(a.id), balance: a.balance }))}
        onSelect={(val: string) => {
          setSelectedAccountId(val);
          const acc = accounts.find(a => String(a.id) === val);
          setAccountBalance(acc?.balance || 0);
          setShowAccountModal(false);
        }}
        onClose={() => setShowAccountModal(false)}
      />

      <SelectionModal
        visible={showCategoryModal}
        title="Select Expense Account"
        options={expenseAccounts.map(a => ({ label: `${a.code ? a.code + ' - ' : ''}${a.name}`, value: String(a.id), name: a.name }))}
        onSelect={(val: string) => {
          const acc = expenseAccounts.find(a => String(a.id) === val);
          updateLineItem(activeLineIndex, 'categoryId', val);
          updateLineItem(activeLineIndex, 'categoryName', acc.name);
          setShowCategoryModal(false);
        }}
        onClose={() => setShowCategoryModal(false)}
      />

      <SelectionModal
        visible={showSupplierModal}
        title="Select Supplier"
        options={suppliers.map(s => ({
          label: s.name,
          value: String(s.id),
          balance: s.balance,
          lastAmount: s.lastExpenseAmount,
          lastCategory: s.lastExpenseCategory,
          lastAccountId: s.lastExpenseAccountId
        }))}
        onSelect={(val: string) => {
          const sup = suppliers.find(s => String(s.id) === val);
          setSelectedSupplierId(val);
          setPayee(sup.name);

          // Autofill Amount and Category from last expense
          if (sup.lastExpenseAmount || sup.lastExpenseCategory) {
            const newItems = [...lineItems];
            if (sup.lastExpenseAmount) {
              newItems[0].amount = String(sup.lastExpenseAmount);
            }
            if (sup.lastExpenseCategory && sup.lastExpenseAccountId) {
              newItems[0].categoryId = String(sup.lastExpenseAccountId);
              newItems[0].categoryName = sup.lastExpenseCategory;
            }
            setLineItems(newItems);
          } else if (sup.balance > 0) {
            // Fallback to balance if no last expense
            const newItems = [...lineItems];
            newItems[0].amount = String(sup.balance);
            setLineItems(newItems);
          }

          setShowSupplierModal(false);
        }}
        onClose={() => setShowSupplierModal(false)}
      />


      <SelectionModal
        visible={showPaymentMethodModal}
        title="Payment Method"
        options={['Cash', 'M-Pesa', 'Bank Transfer', 'Credit Card', 'Cheque'].map(m => ({ label: m, value: m }))}
        onSelect={(val: string) => {
          setPaymentMethod(val);
          setShowPaymentMethodModal(false);
        }}
        onClose={() => setShowPaymentMethodModal(false)}
      />

      <SelectionModal
        visible={showTaxTreatmentModal}
        title="Amounts are"
        options={[
          { label: 'Exclusive of Tax', value: 'Exclusive of Tax' },
          { label: 'Inclusive of Tax', value: 'Inclusive of Tax' },
          { label: 'Out of Scope of Tax', value: 'Out of Scope of Tax' },
        ]}
        onSelect={(val: any) => {
          setTaxTreatment(val);
          setShowTaxTreatmentModal(false);
        }}
        onClose={() => setShowTaxTreatmentModal(false)}
      />

      <SelectionModal
        visible={showVatModal}
        title="Select Tax Rate"
        options={vatRates.map(v => ({ label: `${v.name} (${v.rate}%)`, value: String(v.id), rate: v.rate }))}
        onSelect={(val: string) => {
          const v = vatRates.find(rate => String(rate.id) === val);
          updateLineItem(activeLineIndex, 'vatRateId', val);
          updateLineItem(activeLineIndex, 'vatRate', v.rate);
          setShowVatModal(false);
        }}
        onClose={() => setShowVatModal(false)}
      />

      {/* Simple Date Picker (Fallback) */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerCard}>
            <Text style={styles.modalTitle}>Set Date</Text>
            <View style={styles.dateRow}>
              <TextInput
                style={styles.dateInput}
                defaultValue={paymentDate.getDate().toString()}
                keyboardType="numeric"
                onChangeText={(v) => {
                  const d = new Date(paymentDate);
                  d.setDate(parseInt(v) || 1);
                  setPaymentDate(d);
                }}
              />
              <TextInput
                style={styles.dateInput}
                defaultValue={(paymentDate.getMonth() + 1).toString()}
                keyboardType="numeric"
                onChangeText={(v) => {
                  const d = new Date(paymentDate);
                  d.setMonth((parseInt(v) || 1) - 1);
                  setPaymentDate(d);
                }}
              />
              <TextInput
                style={[styles.dateInput, { width: 80 }]}
                defaultValue={paymentDate.getFullYear().toString()}
                keyboardType="numeric"
                onChangeText={(v) => {
                  const d = new Date(paymentDate);
                  d.setFullYear(parseInt(v) || 2026);
                  setPaymentDate(d);
                }}
              />
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowDatePicker(false)}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const SelectionModal = ({ visible, title, options, onSelect, onClose }: any) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ maxHeight: 400 }}>
          {options.map((opt: any) => (
            <TouchableOpacity key={opt.value} style={styles.modalItem} onPress={() => onSelect(opt.value)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalItemText}>{opt.label}</Text>
                {opt.balance !== undefined && <Text style={styles.modalItemSubtext}>Bal: KES {opt.balance.toLocaleString()}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  backBtn: { padding: 4 },

  scrollView: { flex: 1, padding: 16 },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },

  field: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textLight, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 15, color: COLORS.text },

  row: { flexDirection: 'row' },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12 },
  selectorText: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  selectorTextSmall: { fontSize: 14, color: COLORS.text },

  balanceText: { fontSize: 12, color: COLORS.textLight, marginTop: 4, marginLeft: 2 },
  amountBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#bfdbfe' },
  currencyPrefix: { fontSize: 11, color: COLORS.primary, fontWeight: '800' },
  totalAmountText: { fontSize: 20, fontWeight: '800', color: COLORS.primary },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12, marginLeft: 4 },

  itemCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.secondary, shadowColor: '#000', shadowOpacity: 0.02, elevation: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemIndex: { fontSize: 12, fontWeight: '800', color: COLORS.secondary },

  addLineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.primary, borderRadius: 12, marginTop: 10 },
  addLineText: { marginLeft: 8, fontSize: 15, fontWeight: '700', color: COLORS.primary },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, borderTopWidth: 1, borderTopColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 18, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 30, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  modalItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  modalItemText: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
  modalItemSubtext: { fontSize: 12, color: COLORS.success, marginTop: 2 },

  datePickerCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '80%', alignSelf: 'center', marginBottom: '50%' },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  dateInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 10, width: 50, textAlign: 'center', fontSize: 16, fontWeight: '700' },
  confirmBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '800' }
});
