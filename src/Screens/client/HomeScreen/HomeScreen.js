import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity ,Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation, route }) => {

  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [pastShifts, setPastShifts] = useState([]);
  const [activeShift, setActiveShift] = useState(route.params?.activeShift || null);

  // Charger les données initiales
  useEffect(() => {
    // Simuler le chargement des données
    const loadData = () => {
      // Si un nouveau shift a été créé, l'ajouter comme shift actif
      if (route.params?.newShift) {
        setActiveShift(route.params.newShift);
      } else {
        // Sinon, charger les données par défaut
        setUpcomingShifts([
          {
            id: '2',
            restaurant: 'La Brasserie Moderne',
            date: 'Demain',
            time: '18:00 - 23:00',
            role: 'Barman',
            address: '22 Av. des Champs-Élysées',
            tips: '€68'
          }
        ]);

        setPastShifts([
          {
            id: '3',
            restaurant: 'Chez Marcel',
            date: '05/06/2023',
            time: '19:00 - 02:00',
            role: 'Serveur',
            tips: '€52',
            status: 'completed'
          },
          {
            id: '4',
            restaurant: 'Le Petit Café',
            date: '03/06/2023',
            time: '11:00 - 15:00',
            role: 'Barman',
            tips: '€38',
            status: 'completed'
          }
        ]);
      }
    };

    loadData();
  }, [route.params?.newShift]);

  const quickActions = [
    { id: '1', title: 'Créer Shift', icon: 'add-circle', screen: 'CreateShift' },
    { id: '2', title: 'Disponibilités', icon: 'calendar', screen: 'Availability' },
    { id: '3', title: 'Mes Stats', icon: 'stats-chart', screen: 'Stats' },
    { id: '4', title: 'Messages', icon: 'chatbubbles', screen: 'Messages' }
  ];

  const startShift = () => {
    // Passer le shift actif à l'écran Payment
    navigation.navigate('PaymentTab', { activeShift });
  };

  const endShift = () => {
    setActiveShift(null); // Vide le contexte
    Alert.alert(
      'Shift terminé',
      'Votre shift a été marqué comme terminé.',
      [
        { 
          text: 'OK',
          onPress: () => navigation.navigate('HomeTab') 
        }
      ]
    );
  
    Alert.alert('Shift terminé', 'Votre shift a été marqué comme terminé.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, Jean</Text>
          <Text style={styles.subtitle}>Votre activité récente</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>€247</Text>
          <Text style={styles.statLabel}>Ce mois-ci</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Shifts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Évaluation</Text>
        </View>
      </View>

      {activeShift ? (
        <>
          <Text style={styles.sectionTitle}>Votre shift en cours</Text>
          <View style={[styles.shiftCard, { borderColor: '#3b82f6', borderWidth: 2 }]}>
            <View style={styles.shiftHeader}>
              <Text style={styles.shiftRestaurant}>{activeShift.restaurant}</Text>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor('Serveur').bg }]}>
                <Text style={[styles.roleText, { color: getRoleColor('Serveur').text }]}>
                  Serveur
                </Text>
              </View>
            </View>
            <View style={styles.shiftInfo}>
              <Ionicons name="time" size={16} color="#64748b" />
              <Text style={styles.shiftText}>{activeShift.date} • {activeShift.time}</Text>
            </View>
            
            <View style={styles.shiftActions}>
              <TouchableOpacity 
                style={[styles.shiftActionButton, { backgroundColor: '#3b82f6' }]}
                onPress={startShift}
              >
                <Text style={styles.shiftActionText}>Recevoir des Tips</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.shiftActionButton, { backgroundColor: '#ef4444' }]}
                onPress={endShift}
              >
                <Text style={styles.shiftActionText}>Terminer le Shift</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Vos prochains shifts</Text>
          {upcomingShifts.length > 0 ? (
            upcomingShifts.map(shift => (
              <TouchableOpacity key={shift.id} style={styles.shiftCard}>
                <View style={styles.shiftHeader}>
                  <Text style={styles.shiftRestaurant}>{shift.restaurant}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(shift.role).bg }]}>
                    <Text style={[styles.roleText, { color: getRoleColor(shift.role).text }]}>
                      {shift.role}
                    </Text>
                  </View>
                </View>
                <View style={styles.shiftInfo}>
                  <Ionicons name="time" size={16} color="#64748b" />
                  <Text style={styles.shiftText}>{shift.date} • {shift.time}</Text>
                </View>
                <View style={styles.shiftInfo}>
                  <Ionicons name="location" size={16} color="#64748b" />
                  <Text style={styles.shiftText}>{shift.address}</Text>
                </View>
                <View style={styles.tipsInfo}>
                  <Ionicons name="cash" size={16} color="#f59e0b" />
                  <Text style={styles.tipsText}>Tips estimés: {shift.tips}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar" size={40} color="#cbd5e1" />
              <Text style={styles.emptyStateText}>Aucun shift prévu</Text>
            </View>
          )}
        </>
      )}

      <Text style={styles.sectionTitle}>Vos derniers shifts</Text>
      {pastShifts.map(shift => (
        <View key={shift.id} style={styles.pastShiftCard}>
          <View style={styles.pastShiftHeader}>
            <Text style={styles.pastShiftRestaurant}>{shift.restaurant}</Text>
            <Text style={styles.pastShiftDate}>{shift.date}</Text>
          </View>
          <View style={styles.pastShiftDetails}>
            <View style={styles.pastShiftInfo}>
              <Ionicons name="time" size={14} color="#64748b" />
              <Text style={styles.pastShiftText}>{shift.time}</Text>
            </View>
            <View style={styles.pastShiftInfo}>
              <View style={[styles.roleBadge, { 
                backgroundColor: getRoleColor(shift.role).bg,
                paddingHorizontal: 6,
                paddingVertical: 2
              }]}>
                <Text style={[styles.roleText, { 
                  color: getRoleColor(shift.role).text,
                  fontSize: 12
                }]}>
                  {shift.role}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.pastShiftTips}>
            <Ionicons name="cash" size={16} color="#f59e0b" />
            <Text style={styles.pastShiftTipsText}>{shift.tips} en tips</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.actionsContainer}>
        {quickActions.map(action => (
          <TouchableOpacity 
            key={action.id} 
            style={styles.actionButton}
            onPress={() => navigation.navigate(action.screen)}
          >
            <View style={styles.actionIcon}>
              <Ionicons name={action.icon} size={24} color="#3b82f6" />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const getRoleColor = (role) => {
  const colors = {
    'Serveur': { bg: '#e0f2fe', text: '#0369a1' },
    'Barman': { bg: '#f0fdf4', text: '#15803d' },
    'Runner': { bg: '#fef2f2', text: '#b91c1c' },
    'Cuisinier': { bg: '#f5f3ff', text: '#6d28d9' }
  };
  return colors[role] || { bg: '#e5e7eb', text: '#4b5563' };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  shiftCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  shiftRestaurant: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  roleBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  shiftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  shiftText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 14,
  },
  shiftActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  shiftActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  shiftActionText: {
    color: 'white',
    fontWeight: '500',
  },
  tipsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  tipsText: {
    marginLeft: 8,
    color: '#f59e0b',
    fontWeight: '500',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 16,
  },
  pastShiftCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pastShiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pastShiftRestaurant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  pastShiftDate: {
    fontSize: 14,
    color: '#64748b',
  },
  pastShiftDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pastShiftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pastShiftText: {
    marginLeft: 6,
    color: '#64748b',
    fontSize: 13,
  },
  pastShiftTips: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  pastShiftTipsText: {
    marginLeft: 6,
    color: '#f59e0b',
    fontWeight: '500',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    backgroundColor: '#e0f2fe',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
});

export default HomeScreen;