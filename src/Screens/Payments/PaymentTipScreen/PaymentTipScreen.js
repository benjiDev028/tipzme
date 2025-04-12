import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

const PaymentTipScreen = ({ route, navigation }) => {
  const { amount } = route.params; // Montant sélectionné
  const [isPaying, setIsPaying] = useState(false); // État du paiement
  const pulseAnim1 = new Animated.Value(80); // Animation NFC (cercle externe)
  const pulseAnim2 = new Animated.Value(60); // Animation NFC (cercle intermédiaire)
  const pulseAnim3 = new Animated.Value(40); // Animation NFC (cercle interne)

  useEffect(() => {
    if (isPaying) {
      // Animation pour le cercle externe
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim1, {
            toValue: 90,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim1, {
            toValue: 80,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Animation pour le cercle intermédiaire
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim2, {
            toValue: 70,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim2, {
            toValue: 60,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Animation pour le cercle interne
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim3, {
            toValue: 50,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim3, {
            toValue: 40,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isPaying]);

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      navigation.navigate('PaymentConfirmation');
    }, 5000); // Simuler un délai de paiement
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Paiement</Text>
      </View>

      {/* Montant */}
      <Text style={styles.amountLabel}>Montant</Text>
      <Text style={styles.amountValue}>{amount.toFixed(2)} $</Text>

      {/* Animation NFC */}
      {isPaying && (
        <View style={styles.nfcContainer}>
          <Animated.View
            style={[
              styles.nfcCircle,
              {
                width: pulseAnim1,
                height: pulseAnim1,
                borderRadius: pulseAnim1.interpolate({
                  inputRange: [80, 90],
                  outputRange: [40, 45],
                }),
                opacity: pulseAnim1.interpolate({
                  inputRange: [80, 90],
                  outputRange: [0.7, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.nfcCircle,
              {
                width: pulseAnim2,
                height: pulseAnim2,
                borderRadius: pulseAnim2.interpolate({
                  inputRange: [60, 70],
                  outputRange: [30, 35],
                }),
                opacity: pulseAnim2.interpolate({
                  inputRange: [60, 70],
                  outputRange: [0.7, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.nfcCircle,
              {
                width: pulseAnim3,
                height: pulseAnim3,
                borderRadius: pulseAnim3.interpolate({
                  inputRange: [40, 50],
                  outputRange: [20, 25],
                }),
                opacity: pulseAnim3.interpolate({
                  inputRange: [40, 50],
                  outputRange: [0.7, 1],
                }),
              },
            ]}
          />
          {/* Icône de carte */}
          <View style={styles.cardIcon}>
            <View style={styles.cardIconInner} />
          </View>
        </View>
      )}

      {/* Message NFC */}
      {isPaying ? (
        <Text style={styles.nfcMessage}>Tapez avec votre carte</Text>
      ) : (
        <Text style={styles.nfcMessage}>ou utilisez Apple Pay / Google Pay</Text>
      )}

      {/* Boutons de paiement */}
      <View style={styles.paymentMethods}>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>VISA</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Annuler */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Annuler</Text>
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
  nfcContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  nfcCircle: {
    position: 'absolute',
    backgroundColor: '#dbeafe',
  },
  cardIcon: {
    width: 50,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconInner: {
    width: 15,
    height: 10,
    backgroundColor: '#ffd700',
    borderRadius: 2,
  },
  nfcMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginTop: 20,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paymentButton: {
    width: 80,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  paymentButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  cancelButton: {
    width: '80%',
    height: 60,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
  },
});

export default PaymentTipScreen;