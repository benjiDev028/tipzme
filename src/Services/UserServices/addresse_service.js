import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.2.13:8001";

async function addAddress(addressData) {
  try {
    const user_id = await AsyncStorage.getItem('user_id');
    
    if (!user_id) {
      throw new Error("User ID not found");
    }

    // Formatage des données pour l'API
    const payload = {
      user_id: user_id,
      street: addressData.street,
      street_number: addressData.streetNumber.toString(), // Convertir en string si nécessaire
      apartment: addressData.apartment || null, // null si vide
      city: addressData.city,
      postal_code: addressData.postalCode,
      country: addressData.country || 'Canada' // Valeur par défaut
    };

    const response = await fetch(`${BASE_URL}/identity/create_address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur API:", data);
      throw new Error(data.detail?.[0]?.msg || "Erreur lors de l'ajout de l'adresse");
    }

    return { success: true, data };

  } catch (error) {
    console.error("Erreur addAddress:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

export default { addAddress };