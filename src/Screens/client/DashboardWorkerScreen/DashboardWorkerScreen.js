import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const DashboardWorker = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('shifts'); // 'shifts', 'transactions', 'settings'

  const handleCreateShift = () => {
    navigation.navigate('CreateShift');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Earnings Card */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>Total des pourboires reçus</Text>
        <Text style={styles.earningsAmount}>548,75 $</Text>
        <Text style={styles.earningsIncrease}>+42,50 $ cette semaine</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shifts' && styles.activeTab]}
          onPress={() => setActiveTab('shifts')}
        >
          <Text style={[styles.tabText, activeTab === 'shifts' && styles.activeTabText]}>Shifts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Paramètres</Text>
        </TouchableOpacity>
      </View>

      {/* Active Shift */}
      <View style={styles.activeShiftCard}>
        <Text style={styles.activeShiftTitle}>Shift actif - Restaurant Le Central</Text>
        <Text style={styles.activeShiftDetails}>26 fév. 2025 • 18:00 - 22:00</Text>
        <Text style={styles.activeShiftDetails}>3 collègues • Tips collectés: 120,50 $</Text>
        <Text style={styles.activeShiftIcon}>⚡</Text>
      </View>

      {/* Past Shifts */}
      <Text style={styles.pastShiftsTitle}>Shifts passés</Text>
      <ScrollView>
        {/* Shift 1 */}
        <View style={styles.shiftCard}>
          <Text style={styles.shiftName}>Restaurant Le Central</Text>
          <Text style={styles.shiftDetails}>25 fév. 2025 • 17:00 - 23:00</Text>
          <Text style={styles.shiftEarnings}>86,25 $</Text>
        </View>

        {/* Shift 2 */}
        <View style={styles.shiftCard}>
          <Text style={styles.shiftName}>Restaurant Le Central</Text>
          <Text style={styles.shiftDetails}>22 fév. 2025 • 20:00 - 02:00</Text>
          <Text style={styles.shiftEarnings}>112,50 $</Text>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateShift}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 60,
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 18,
    color: 'white',
  },
  earningsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 10,
  },
  earningsIncrease: {
    fontSize: 14,
    color: '#22c55e',
    marginTop: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeShiftCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3b82f6',
    position: 'relative',
  },
  activeShiftTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  activeShiftDetails: {
    fontSize: 14,
    color: '#334155',
    marginTop: 5,
  },
  activeShiftIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
    fontSize: 24,
    color: '#3b82f6',
  },
  pastShiftsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  shiftCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  shiftName: {
    fontSize: 16,
    color: '#334155',
  },
  shiftDetails: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  shiftEarnings: {
    position: 'absolute',
    right: 20,
    top: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default DashboardWorker;