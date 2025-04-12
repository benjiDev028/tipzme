const BASE_URL = "http://192.168.2.13:8002";

async function PostKycData(userId, documentType, identityCard, selfie) {
  try {
    const formData = new FormData();

    // Ajout des champs simples avec toString() pour s'assurer qu'ils sont traités comme des chaînes
    formData.append('user_id', userId.toString());
    formData.append('id_document_type', documentType);

    // Ajout des fichiers - noter le format compatible avec React Native et FastAPI
    formData.append('identity_card', {
      uri: identityCard.uri,
      name: identityCard.name || 'identity_document.jpg',
      type: identityCard.type || 'image/jpeg'
    });

    formData.append('selfie', {
      uri: selfie.uri,
      name: selfie.name || 'selfie.jpg',
      type: selfie.type || 'image/jpeg'
    });

    console.log('Sending KYC data:', {
      user_id: userId,
      id_document_type: documentType,
      identity_card_uri: identityCard.uri,
      selfie_uri: selfie.uri
    });

    // Important: Ne PAS définir le Content-Type pour les requêtes multipart
    // React Native ajoutera automatiquement le boundary correct
    const response = await fetch(`${BASE_URL}/kyc/upload-documents?user_id=${userId}&id_document_type=${documentType}`, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || "Server error");
      } catch (jsonError) {
        throw new Error(errorText || "Unknown server error");
      }
    }

    const data = await response.json();
    return {
      success: true,
      data
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload documents"
    };
  }
}

export default { PostKycData };