const url = "http://192.168.2.13:8001";

async function Login(email, password) {
  if (!email || !password) {
    throw new Error("Email et mot de passe requis, champion.");
  }

  try {
    const response = await fetch(`${url}/identity/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.detail || `Erreur HTTP: ${response.status}`;
      console.error("Erreur de connexion:", errorMsg);
      throw new Error(errorMsg);
    }

    if (!data.access_token) {
      throw new Error("Réponse invalide : pas de token reçu.");
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.message);
    throw error;
  }
}
import { Buffer } from "buffer"; // pour React Native

export function decodeJWT(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Token invalide ou inexistant");
  }

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) throw new Error("Format de token invalide");

    // Ajout du padding '=' si besoin
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    const jsonPayload = Buffer.from(paddedBase64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erreur lors du décodage du JWT :", error.message);
    return null;
  }
}


export default { Login, decodeJWT };
