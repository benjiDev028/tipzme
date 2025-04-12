import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

const KYCStatusScreen = ({ navigation }) => {

   const canGoBack = false;
      useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
          if (!canGoBack) {
            e.preventDefault(); // Bloque le retour
            Alert.alert("Reviens pas, on n’a pas fini ici.");
          }
        });
      
        return unsubscribe;
      }, [navigation]);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header with success icon */}
        <View style={styles.headerContainer}>
          <View style={styles.successIconContainer}>
            <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.confirmationTitle}>Félicitations!</Text>
          <Text style={styles.confirmationText}>Vos documents ont été soumis avec succès</Text>
        </View>

        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusHeaderText}>STATUT DE LA VÉRIFICATION</Text>
          </View>
          
          <View style={styles.statusBody}>
            <View style={styles.statusIndicatorContainer}>
              <ActivityIndicator size="large" color="#4776E6" />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusLabelText}>Statut actuel:</Text>
                <Text style={styles.statusValueText}>En cours de vérification</Text>
              </View>
            </View>
            
            <View style={styles.timelineContainer}>
              <View style={styles.timelineStep}>
                <View style={[styles.timelineDot, styles.completedDot]}>
                  <MaterialIcons name="check" size={16} color="#FFF" />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Documents soumis</Text>
                  <Text style={styles.timelineSubtitle}>Vos documents ont été reçus</Text>
                </View>
              </View>
              
              <View style={[styles.timelineConnector, styles.activeConnector]} />
              
              <View style={styles.timelineStep}>
                <View style={[styles.timelineDot, styles.activeDot]}>
                  <MaterialIcons name="hourglass-empty" size={16} color="#FFF" />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Vérification en cours</Text>
                  <Text style={styles.timelineSubtitle}>Nous examinons vos documents</Text>
                </View>
              </View>
              
              <View style={styles.timelineConnector} />
              
              <View style={styles.timelineStep}>
                <View style={styles.timelineDot}>
                  <Text style={styles.timelineDotText}>3</Text>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Compte vérifié</Text>
                  <Text style={styles.timelineSubtitle}>Profitez de tous les services</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Estimated time */}
        <View style={styles.estimatedTimeContainer}>
          <FontAwesome5 name="clock" size={20} color="#4776E6" />
          <Text style={styles.estimatedTimeText}>
            Temps estimé: <Text style={styles.boldText}>24 heures ouvrables</Text>
          </Text>
        </View>

        {/* Email confirmation reminder */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderIconContainer}>
            <MaterialIcons name="email" size={24} color="#FF9800" />
          </View>
          <View style={styles.reminderTextContainer}>
            <Text style={styles.reminderTitle}>Veuillez confirmer votre email</Text>
            <Text style={styles.reminderText}>
              Si ce n'est pas encore fait, veuillez vérifier votre boîte de réception et confirmer votre adresse email pour accélérer le processus.
            </Text>
          </View>
        </View>

        {/* Support info */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Des questions?</Text>
          <Text style={styles.supportText}>
            Notre équipe de support est disponible pour vous aider à chaque étape du processus.
          </Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color="#4776E6" />
            <Text style={styles.contactText}>support@tipzme.com</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color="#4776E6" />
            <Text style={styles.contactText}>+1 (800) 234-6789</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="time-outline" size={20} color="#4776E6" />
            <Text style={styles.contactText}>Lun-Ven, 9h-18h</Text>
          </View>
        </View>

        {/* Next steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>Prochaines étapes</Text>
          <Text style={styles.nextStepsText}>
            Vous recevrez une notification dès que votre vérification sera terminée. 
            En attendant, vous pouvez compléter votre profil ou explorer notre application.
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('LogIn')}>
          <Text style={styles.primaryButtonText}>Explorer l'application</Text>
        </TouchableOpacity>

        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  statusCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  statusHeader: {
    backgroundColor: '#4776E6',
    padding: 15,
    alignItems: 'center',
  },
  statusHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBody: {
    padding: 20,
  },
  statusIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusTextContainer: {
    marginLeft: 20,
  },
  statusLabelText: {
    fontSize: 14,
    color: '#777',
  },
  statusValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4776E6',
  },
  timelineContainer: {
    paddingLeft: 10,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  timelineDotText: {
    color: '#777',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  activeDot: {
    backgroundColor: '#4776E6',
  },
  timelineConnector: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginLeft: 13,
    marginBottom: 15,
  },
  activeConnector: {
    backgroundColor: '#4776E6',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  estimatedTimeText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderIconContainer: {
    marginRight: 15,
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 5,
  },
  reminderText: {
    fontSize: 14,
    color: '#666',
  },
  supportCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  nextStepsCard: {
    backgroundColor: '#EDF7ED',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    marginBottom: 25,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#4776E6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4776E6',
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: '#4776E6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default KYCStatusScreen;