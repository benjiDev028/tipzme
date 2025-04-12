import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KycService from "../../../Services/KycServices/KycService";

export default function KycInfoScreen({navigation}) {

 
  const [selfie, setSelfie] = useState(null);
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState("passport");

  // Demander la permission pour accéder à la galerie
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Désolé, nous avons besoin de la permission pour accéder à votre galerie.");
      }
    })();
  }, []);

  // Sélectionner une image depuis la galerie
  const selectSelfie = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permettre à l'utilisateur de recadrer l'image
      aspect: [1, 1], // Format carré pour un selfie
      quality: 1, // Qualité maximale
    });

    if (!result.canceled) {
      setSelfie({
        uri: result.assets[0].uri,
        name: "selfie.jpg",
        size: result.assets[0].fileSize || 0,
        type: "image/jpeg",
      });
    }
  };

  // Téléverser un document
  const uploadFile = async () => {
    Alert.alert(
      "Choisir un fichier",
      "Sélectionnez le type de fichier à téléverser :",
      [
        {
          text: "Image",
          onPress: uploadImage,
        },
        {
          text: "Document",
          onPress: uploadDocument,
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ]
    );
  };

  // Téléverser une image
  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDocument({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || "image.jpg",
        size: result.assets[0].fileSize || 0,
        type: "image/jpeg",
      });
    }
  };

  // Téléverser un document
  const uploadDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setDocument({
        uri: file.uri,
        name: file.name,
        size: file.size,
        type: file.mimeType,
      });
    }
  };

  // Supprimer le selfie
  const removeSelfie = () => {
    setSelfie(null);
  };

  // Supprimer le fichier
  const removeFile = () => {
    setDocument(null);
  };

  // Soumettre le formulaire KYC
  const handleSubmit = async () => {
    if (!selfie || !document) {
      Alert.alert('Erreur', 'Veuillez sélectionner un selfie et un document d\'identité');
      return;
    }
  
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        throw new Error("ID utilisateur non trouvé");
      }
  
      const result = await KycService.PostKycData(
        userId,
        documentType, // "passport", "driving_license" ou "id_card"
        document,     // Fichier document d'identité
        selfie        // Fichier selfie
      );
  
      if (result.success) {
        Alert.alert('Succès', 'Documents envoyés avec succès');
        navigation.navigate("KycStatus");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur soumission KYC:', error);
      console.log('Envoi KYC:', {
        user_id: userId,
        id_document_type: documentType,
        identity_card: { uri: document.uri },
        selfie: { uri: selfie.uri }
      });
      Alert.alert('Erreur', error.message || "Échec de l'envoi des documents");
    }
    
  };

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>9:41</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Vérification de votre identité</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.progressText}>Étape 3/3</Text>
      </View>

      {/* Content */}
      <Text style={styles.title}>Nous avons besoin de vérifier votre identité</Text>
      <Text style={styles.subtitle}>
        Pour des raisons de sécurité et légales, veuillez fournir les documents suivants :
      </Text>

      {/* Sélectionner un selfie */}
      <Text style={styles.label}>Selfie</Text>
      {selfie ? (
        <View style={styles.fileCard}>
          <MaterialIcons name="person" size={40} color="#4776E6" />
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              Selfie
            </Text>
            <Text style={styles.fileDetails}>
              {selfie.type} - {(selfie.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </View>
          <TouchableOpacity style={styles.imagePreview} onPress={() => {}}>
            <Image source={{ uri: selfie.uri }} style={styles.thumbnailImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={removeSelfie}>
            <MaterialIcons name="delete" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={selectSelfie}>
          <FontAwesome name="camera" size={20} color="white" />
          <Text style={styles.buttonText}>Sélectionner un selfie</Text>
        </TouchableOpacity>
      )}

      {/* Téléverser un document */}
      <Text style={styles.label}>Document d'identité</Text>
      {document ? (
        <View style={styles.fileCard}>
          <MaterialIcons name={document.type === "application/pdf" ? "picture-as-pdf" : "insert-drive-file"} size={40} color="#4776E6" />
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {document.name}
            </Text>
            <Text style={styles.fileDetails}>
              {document.type} - {(document.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </View>
          {document.type.startsWith("image/") && (
            <TouchableOpacity style={styles.imagePreview} onPress={() => {}}>
              <Image source={{ uri: document.uri }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.removeButton} onPress={removeFile}>
            <MaterialIcons name="delete" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={uploadFile}>
          <FontAwesome name="upload" size={20} color="white" />
          <Text style={styles.buttonText}>Téléverser un document</Text>
        </TouchableOpacity>
      )}

      {/* Sélectionner le type de document */}
      <Text style={styles.label}>Type de document</Text>
      <View style={styles.documentTypeContainer}>
        <TouchableOpacity 
          style={[
            styles.documentTypeOption, 
            documentType === "passport" && styles.documentTypeSelected
          ]}
          onPress={() => setDocumentType("passport")}
        >
          <FontAwesome 
            name="id-card" 
            size={24} 
            color={documentType === "passport" ? "#4776E6" : "#64748b"} 
          />
          <Text 
            style={[
              styles.documentTypeText, 
              documentType === "passport" && styles.documentTypeTextSelected
            ]}
          >
            Passeport
          </Text>
          {documentType === "passport" && (
            <View style={styles.checkmarkContainer}>
              <MaterialIcons name="check-circle" size={20} color="#4776E6" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.documentTypeOption, 
            documentType === "driver_license" && styles.documentTypeSelected
          ]}
          onPress={() => setDocumentType("driver_license")}
        >
          <FontAwesome 
            name="id-card" 
            size={24} 
            color={documentType === "driver_license" ? "#4776E6" : "#64748b"} 
          />
          <Text 
            style={[
              styles.documentTypeText, 
              documentType === "driver_license" && styles.documentTypeTextSelected
            ]}
          >
            Permis de conduire
          </Text>
          {documentType === "driver_license" && (
            <View style={styles.checkmarkContainer}>
              <MaterialIcons name="check-circle" size={20} color="#4776E6" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.documentTypeOption, 
            documentType === "ID_card" && styles.documentTypeSelected
          ]}
          onPress={() => setDocumentType("ID_card")}
        >
          <FontAwesome 
            name="id-card-o" 
            size={24} 
            color={documentType === "ID_card" ? "#4776E6" : "#64748b"} 
          />
          <Text 
            style={[
              styles.documentTypeText, 
              documentType === "ID_card" && styles.documentTypeTextSelected
            ]}
          >
            Carte d'identité
          </Text>
          {documentType === "ID_card" && (
            <View style={styles.checkmarkContainer}>
              <MaterialIcons name="check-circle" size={20} color="#4776E6" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Message */}
      <View style={styles.messageBox}>
        <MaterialIcons name="info" size={24} color="#4CAF50" />
        <View style={styles.messageContent}>
          <Text style={styles.messageTitle}>Traitement rapide</Text>
          <Text style={styles.messageText}>
            Votre compte sera validé sous 24h ouvrables après vérification.
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
        <Text style={styles.continueButtonText}>Soumettre pour vérification</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}>Revenir en arrière</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  statusBar: {
    height: 44,
    justifyContent: "center",
    paddingLeft: 25,
    backgroundColor: "#FFFFFF",
  },
  statusBarText: {
    fontSize: 14,
    color: "#111111",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    elevation: 2, // Ombre pour le header
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111111",
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },
  helpButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111111",
  },
  progressBarContainer: {
    marginTop: 20,
  },
  progressBarBackground: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
  },
  progressBarFill: {
    width: "75%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4776E6",
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: "#777777",
  },
  title: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111111",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#555555",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 10,
    color: "#111111",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4776E6",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 3, // Ombre pour le bouton
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 20,
    elevation: 2, // Ombre pour la carte
  },
  fileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
  },
  fileDetails: {
    fontSize: 12,
    color: "#64748b",
  },
  imagePreview: {
    marginLeft: 10,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  thumbnailImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  removeButton: {
    marginLeft: 10,
  },
  
  // Styles pour la sélection de type de document
  documentTypeContainer: {
    marginBottom: 20,
  },
  documentTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 10,
    elevation: 1,
  },
  documentTypeSelected: {
    borderColor: "#4776E6",
    borderWidth: 2,
    backgroundColor: "#F0F5FF",
  },
  documentTypeText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#334155",
    flex: 1,
  },
  documentTypeTextSelected: {
    fontWeight: "bold",
    color: "#4776E6",
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
  
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  messageContent: {
    marginLeft: 10,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  messageText: {
    fontSize: 14,
    color: "#555555",
  },
  continueButton: {
    backgroundColor: "#4776E6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3, // Ombre pour le bouton
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 14,
    color: "#4776E6",
    fontWeight: "600",
  },
});