import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const AmountSelectionScreen = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState(15); // Montant sélectionné

  const handleNext = () => {
    navigation.navigate('PaymentTip', { amount: selectedAmount });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Sélectionnez un montant</Text>
      </View>

      {/* Montant */}
      <Text style={styles.amountLabel}>Montant</Text>
      <Text style={styles.amountValue}>{selectedAmount.toFixed(2)} $</Text>

      {/* Boutons de montant fixe */}
      <View style={styles.amountButtons}>
        {[5, 10, 15].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.amountButton,
              selectedAmount === amount && styles.selectedAmountButton,
            ]}
            onPress={() => setSelectedAmount(amount)}
          >
            <Text
              style={[
                styles.amountButtonText,
                selectedAmount === amount && styles.selectedAmountButtonText,
              ]}
            >
              {amount} $
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Champ personnalisé */}
      <TouchableOpacity style={styles.customAmountButton}>
        <Text style={styles.customAmountText}>Montant personnalisé</Text>
      </TouchableOpacity>

      {/* Boutons de paiement */}
      <View style={styles.paymentMethods}>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentIcon}>🍎</Text>
          <Text style={styles.paymentButtonText}>Apple Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentIcon}>🤖</Text>
          <Text style={styles.paymentButtonText}>Google Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentIcon}>💳</Text>
          <Text style={styles.paymentButtonText}>Carte</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Suivant */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Suivant</Text>
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
    height: 70,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  amountLabel: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 20,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginTop: 10,
  },
  amountButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  amountButton: {
    width: 80,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectedAmountButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  amountButtonText: {
    fontSize: 16,
    color: '#64748b',
  },
  selectedAmountButtonText: {
    color: 'white',
  },
  customAmountButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  customAmountText: {
    fontSize: 16,
    color: '#64748b',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paymentButton: {
    width: 100,
    height: 60,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  paymentIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  paymentButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  nextButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#3b82f6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AmountSelectionScreen;