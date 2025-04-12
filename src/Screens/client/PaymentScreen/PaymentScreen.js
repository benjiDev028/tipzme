import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState('5.00');
  // Récupérer le shift actif des paramètres de navigation
  const activeShift = route.params?.activeShift;

  // Vérifier si un shift est actif
  useEffect(() => {
    if (!activeShift) {
      Alert.alert(
        'Aucun shift actif',
        'Vous devez avoir un shift en cours pour recevoir des tips.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('CreateShiftTab') 
          }
        ]
      );
    }
  }, [activeShift]);

  const handlePayment = () => {
    if (!activeShift) return;

    Alert.alert(
      'Paiement effectué',
      `Vous avez reçu ${amount}€ pour votre shift à ${activeShift.restaurant}`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('HomeTab', { paymentReceived: amount }) 
        }
      ]
    );
  };

  if (!activeShift) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucun shift actif trouvé</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('CreateShiftTab')}
        >
          <Text style={styles.buttonText}>Créer un shift</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Paiement par NFC</Text>
        
        <View style={styles.shiftInfo}>
          <Text style={styles.shiftTitle}>Shift en cours:</Text>
          <Text style={styles.shiftText}>{activeShift.restaurant}</Text>
          <Text style={styles.shiftText}>{activeShift.date} • {activeShift.time}</Text>
        </View>

        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Montant"
        />

        <TouchableOpacity 
          style={styles.nfcButton}
          onPress={handlePayment}
        >
          <Ionicons name="nfc" size={32} color="white" />
          <Text style={styles.nfcText}>TAP TO PAY</Text>
          <Text style={styles.nfcSubtext}>Approchez votre téléphone</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.qrButton}>
          <Text style={styles.qrText}>Alternative: QR Code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ... (les styles restent identiques)


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1e293b',
  },
  shiftInfo: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  shiftTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  shiftText: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 15,
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  nfcButton: {
    backgroundColor: '#3b82f6',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  nfcText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  nfcSubtext: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  qrButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  qrText: {
    color: '#3b82f6',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;