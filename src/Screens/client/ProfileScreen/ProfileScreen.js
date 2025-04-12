import  React,{useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image,Alert } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import {  useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  // Données de profil (à remplacer par vos données réelles)
  const profileData = {
    name: "Jean Dupont",
    username: "@serveur_paris",
    bio: "Barman professionnel | Mixologie | Paris",
    tipsReceived: 428,
    rating: 4.7,
    shiftsCompleted: 156,
  };
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        { 
          text: 'Déconnexion', 
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthStack' }]
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header du profil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
            style={styles.avatar}
          />
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Modifier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileData.shiftsCompleted}</Text>
            <Text style={styles.statLabel}>Shifts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileData.tipsReceived}</Text>
            <Text style={styles.statLabel}>Tips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileData.rating}</Text>
            <Text style={styles.statLabel}>Note</Text>
          </View>
        </View>
      </View>

      {/* Infos utilisateur */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.username}>{profileData.username}</Text>
        <Text style={styles.bio}>{profileData.bio}</Text>
      </View>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.primaryButtonText}>Recevoir un Tip</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('ShareProfile')}
        >
          <Text>Partager</Text>
        </TouchableOpacity>
      </View>

      {/* Section Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres du compte</Text>
        
        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('AccountInfo')}
        >
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Informations du compte</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('SecuritySettings')}
        >
          <MaterialIcons name="security" size={24} color="#333" />
          <Text style={styles.optionText}>Sécurité et confidentialité</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('PaymentMethods')}
        >
          <FontAwesome name="credit-card" size={24} color="#333" />
          <Text style={styles.optionText}>Méthodes de paiement</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Section Préférences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences</Text>
        
        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('NotificationsSettings')}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Notifications</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('AppearanceSettings')}
        >
          <Ionicons name="color-palette-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Apparence</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Section Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <Ionicons name="help-circle-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Centre d'aide</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => navigation.navigate('ContactSupport')}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Contacter le support</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Bouton Déconnexion */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout} // Remplacez par votre logique de déconnexion
      >
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    marginTop: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  username: {
    color: '#666',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    marginRight: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#666',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
});