import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  Animated,
  ActivityIndicator
} from 'react-native';
import { validateEmail } from '../../../validations/Validator';
import { validatePassword } from '../../../validations/Validator';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import UserService from '../../../Services/UserServices/UserService';

const SigninScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    date_birth: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDateForBackend = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const formatDateForDisplay = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('fr-FR');
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date_birth: selectedDate }));
    }
  };

  const handleSignup = async () => {
    const { firstName, lastName, email, phoneNumber, password, date_birth } = formData;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
    }

    if (!validateEmail(email)) {
      return Alert.alert('Erreur', 'Veuillez entrer un email valide.');
    }

    if (!validatePassword(password)) {
      return Alert.alert(
        'Erreur',
        'Le mot de passe doit contenir au moins 6 caractères, une lettre, un chiffre et un caractère spécial.'
      );
    }

    setIsLoading(true);

    try {
      const formattedDate = formatDateForBackend(date_birth);

      const response = await UserService.Register(
        firstName,
        lastName,
        email,
        phoneNumber,
        formattedDate,
        password
      );

      if (response.success) {
        Alert.alert('Succès', response.message);
        navigation.navigate('AddresseInfo');
        console.log('Inscription réussie:', response);
      } else {
        throw new Error(response.message || "Échec de l'inscription");
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      Alert.alert('Erreur', error.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Barre de progression */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={styles.progressBar} />
            </View>
            <Text style={styles.progressText}>1/4</Text>
          </View>
          
          {/* En-tête */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <Animated.Text 
              style={[
                styles.title, 
                { 
                  opacity: titleOpacity,
                  transform: [{ translateY: titleTranslateY }] 
                }
              ]}
            >
              Créer un compte
            </Animated.Text>
          </View>

          <Text style={styles.subtitle}>
            Commençons avec quelques informations de base
          </Text>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            {/* First Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Prénom</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'firstName' && styles.inputContainerFocused
              ]}>
                <Ionicons name="person-outline" size={20} color={focusedInput === 'firstName' ? '#3b82f6' : '#94a3b8'} />
                <TextInput
                  style={styles.input}
                  placeholder="Votre prénom"
                  placeholderTextColor="#94a3b8"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput('firstName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Last Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'lastName' && styles.inputContainerFocused
              ]}>
                <Ionicons name="person-outline" size={20} color={focusedInput === 'lastName' ? '#3b82f6' : '#94a3b8'} />
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom"
                  placeholderTextColor="#94a3b8"
                  value={formData.lastName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput('lastName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'email' && styles.inputContainerFocused
              ]}>
                <Ionicons name="mail-outline" size={20} color={focusedInput === 'email' ? '#3b82f6' : '#94a3b8'} />
                <TextInput
                  style={styles.input}
                  placeholder="votre.email@exemple.com"
                  placeholderTextColor="#94a3b8"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro de téléphone</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'phone' && styles.inputContainerFocused
              ]}>
                <Ionicons name="call-outline" size={20} color={focusedInput === 'phone' ? '#3b82f6' : '#94a3b8'} />
                <TextInput
                  style={styles.input}
                  placeholder="+33 6 XX XX XX XX"
                  placeholderTextColor="#94a3b8"
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
                  keyboardType="phone-pad"
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'password' && styles.inputContainerFocused
              ]}>
                <Ionicons name="lock-closed-outline" size={20} color={focusedInput === 'password' ? '#3b82f6' : '#94a3b8'} />
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 8 caractères"
                  placeholderTextColor="#94a3b8"
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#94a3b8" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Date de Naissance */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date de naissance</Text>
              <TouchableOpacity
                style={[
                  styles.inputContainer,
                  focusedInput === 'dob' && styles.inputContainerFocused
                ]}
                onPress={() => setShowDatePicker(true)}
                onFocus={() => setFocusedInput('dob')}
                onBlur={() => setFocusedInput(null)}
              >
                <Ionicons name="calendar-outline" size={20} color={focusedInput === 'dob' ? '#3b82f6' : '#94a3b8'} />
                <Text style={styles.dateText}>
                  {formatDateForDisplay(formData.date_birth)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* DateTimePicker */}
            {showDatePicker && (
              <DateTimePicker
                value={formData.date_birth}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Politique de confidentialité */}
          <Text style={styles.privacyText}>
            En vous inscrivant, vous acceptez nos{' '}
            <Text style={styles.privacyLink}>Conditions d'utilisation</Text> et notre{' '}
            <Text style={styles.privacyLink}>Politique de confidentialité</Text>.
          </Text>

          {/* Signup Button */}
          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.signupButtonText}>Continuer</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          {/* Lien vers l'écran de connexion */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('login')}
          >
            <Text style={styles.loginLinkText}>
              Déjà un compte ? <Text style={styles.loginLinkBold}>Connectez-vous</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 5,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBar: {
    width: '25%',
    height: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: '#3b82f6',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    marginLeft: 12,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#0f172a',
    marginLeft: 12,
  },
  privacyText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  privacyLink: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  signupButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    backgroundColor: '#3b82f6',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#64748b',
  },
  loginLinkBold: {
    fontWeight: 'bold',
    color: '#3b82f6',
  },
});

export default SigninScreen;