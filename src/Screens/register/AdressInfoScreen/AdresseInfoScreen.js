import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  Easing,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import addresse_service from '../../../Services/UserServices/addresse_service';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const AddresseInfoScreen = ({ navigation, route }) => {

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


  const [manualAddress, setManualAddress] = useState({
    streetNumber: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Canada',
    apartment: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [totalSteps, setTotalSteps] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animations
  const searchAnim = useRef(new Animated.Value(0)).current;
  const predictionsAnim = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef(null);
  const predictionsListRef = useRef(null);
  const progressWidth = useRef(new Animated.Value((currentStep / totalSteps) * 100)).current;

  // Récupérer les données utilisateur depuis la navigation si nécessaire
  const userData = route.params?.userData || {};

  const fetchPlaces = async (query) => {
    if (query.length < 3) {
      setPredictions([]);
      animatePredictionsList(0);
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=AIzaSyBwx5yyNbJYbt_TLBEozRXPl3oZD4wH-DE&components=country:ca&language=fr`
      );
      const json = await response.json();
      
      setPredictions(json.predictions || []);
      animatePredictionsList(json.predictions?.length > 0 ? 1 : 0);
    } catch (error) {
      console.error('Error fetching places:', error);
      setPredictions([]);
      animatePredictionsList(0);
    } finally {
      setLoading(false);
    }
  };

  const animatePredictionsList = (toValue) => {
    Animated.spring(predictionsAnim, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const fetchPlaceDetails = async (placeId) => {
    setLoading(true);
    
    Animated.timing(formOpacity, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: true,
    }).start();

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyBwx5yyNbJYbt_TLBEozRXPl3oZD4wH-DE&fields=address_component,formatted_address`
      );
      const json = await response.json();
      
      const extractComponent = (type) => 
        json.result.address_components.find(c => c.types.includes(type))?.long_name || '';

      await new Promise(resolve => setTimeout(resolve, 300));

      Animated.sequence([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start();

      setManualAddress({
        streetNumber: extractComponent('street_number'),
        street: extractComponent('route'),
        city: extractComponent('locality'),
        postalCode: extractComponent('postal_code'),
        country: 'Canada',
        apartment: ''
      });
      
      setSearchQuery(json.result.formatted_address);
      setPredictions([]);
      animatePredictionsList(0);
      
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ y: 200, animated: true });
        }
      }, 300);
      
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPredictions([]);
    animatePredictionsList(0);
  };

  const handleSubmit = async () => {
    // Vérification des champs obligatoires
    if (!manualAddress.street || !manualAddress.streetNumber || !manualAddress.city || !manualAddress.postalCode) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await addresse_service.addAddress(manualAddress);
  
      if (response.success) {
        Alert.alert('Succès', 'Adresse enregistrée avec succès');
        navigation.navigate('KycInfo');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      Alert.alert('Erreur', error.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const focusSearch = () => {
    Animated.spring(searchAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const blurSearch = () => {
    if (!searchQuery) {
      Animated.spring(searchAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlaces(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: (currentStep / totalSteps) * 100,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }, [currentStep, totalSteps]);

  const searchContainerStyle = {
    transform: [
      {
        scale: searchAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.02]
        })
      }
    ],
    shadowOpacity: searchAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.3]
    })
  };

  const predictionListStyle = {
    opacity: predictionsAnim,
    transform: [
      {
        translateY: predictionsAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        })
      }
    ]
  };

  const inputGroupStyle = {
    opacity: formOpacity,
    transform: [
      {
        translateY: formOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0]
        })
      }
    ]
  };

  const renderPredictionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.predictionItem}
      onPress={() => fetchPlaceDetails(item.place_id)}
    >
      <Ionicons name="location" size={18} color="#3366ff" style={styles.locationIcon} />
      <Text style={styles.predictionText}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3366ff" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Votre adresse</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground} />
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: progressWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              }) }
            ]} 
          />
          <Text style={styles.progressText}>{currentStep}/{totalSteps}</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={isIOS ? "padding" : "height"}
        keyboardVerticalOffset={isIOS ? 10 : 0}
      >
        <ScrollView 
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.searchContainer, searchContainerStyle]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une adresse"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
              onFocus={focusSearch}
              onBlur={blurSearch}
            />
            
            {searchQuery ? (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={clearSearch}
              >
                <Ionicons name="close-circle" size={22} color="#94a3b8" />
              </TouchableOpacity>
            ) : (
              <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
            )}
            
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3366ff" />
              </View>
            )}
            
            <Animated.View style={[styles.predictionsContainer, predictionListStyle]}>
              {predictions.length > 0 && (
                <FlatList
                  ref={predictionsListRef}
                  data={predictions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={renderPredictionItem}
                  showsVerticalScrollIndicator={true}
                  initialNumToRender={5}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                />
              )}
            </Animated.View>
          </Animated.View>

          <Text style={styles.separator}>Ou entrer manuellement :</Text>
          
          <Animated.View style={inputGroupStyle}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro</Text>
              <TextInput
                style={styles.input}
                value={manualAddress.streetNumber}
                onChangeText={text => setManualAddress({...manualAddress, streetNumber: text})}
                keyboardType="number-pad"
                placeholderTextColor="#94a3b8"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rue</Text>
              <TextInput
                style={styles.input}
                value={manualAddress.street}
                onChangeText={text => setManualAddress({...manualAddress, street: text})}
                placeholderTextColor="#94a3b8"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ville</Text>
              <TextInput
                style={styles.input}
                value={manualAddress.city}
                onChangeText={text => setManualAddress({...manualAddress, city: text})}
                placeholderTextColor="#94a3b8"
              />
            </View>
            
            <View style={styles.rowContainer}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Code postal</Text>
                <TextInput
                  style={styles.input}
                  value={manualAddress.postalCode}
                  onChangeText={text => setManualAddress({...manualAddress, postalCode: text})}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Pays</Text>
                <TextInput
                  style={styles.input}
                  value={manualAddress.country}
                  onChangeText={text => setManualAddress({...manualAddress, country: text})}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Appartement (optionnel)</Text>
              <TextInput
                style={styles.input}
                value={manualAddress.apartment}
                onChangeText={text => setManualAddress({...manualAddress, apartment: text})}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.buttonText}>Continuer</Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// Les styles restent identiques à votre version précédente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: isIOS ? 50 : 10,
    paddingBottom: 10,
    backgroundColor: '#3366ff',
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: isIOS ? 50 : 10,
    left: 15,
    zIndex: 10,
  },
  progressContainer: {
    marginTop: 15,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
    right: 0,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  searchInput: {
    height: 55,
    paddingLeft: 45,
    paddingRight: 40,
    fontSize: 16,
    borderRadius: 15,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 17,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: 16,
    zIndex: 10,
  },
  loadingContainer: {
    position: 'absolute',
    right: 50,
    top: 17,
    zIndex: 10,
  },
  predictionsContainer: {
    maxHeight: 250,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    zIndex: 99,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  locationIcon: {
    marginRight: 10,
  },
  predictionText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  separator: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 25,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 6,
    paddingLeft: 2,
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#334155',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  button: {
    backgroundColor: '#3366ff',
    height: 55,
    borderRadius: 27.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#3366ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default AddresseInfoScreen;