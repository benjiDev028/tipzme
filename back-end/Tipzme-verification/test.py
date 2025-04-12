import streamlit as st
import requests

# URL du backend où les documents seront envoyés (remplace avec l'URL de ton API)
UPLOAD_URL = "http://localhost:8003/upload-documents/{user_id}"

# Interface utilisateur pour l'upload des documents
def upload_documents():
    st.title("Test d'upload des documents")

    # Récupérer les informations utilisateur (ici on suppose un utilisateur fictif)
    user_id = st.text_input("Entrez l'ID de l'utilisateur", "12345")
    email = st.text_input("Entrez l'email de l'utilisateur", "test@example.com")

    # Upload des fichiers
    identity_card = st.file_uploader("Téléversez la carte d'identité", type=["jpg", "png", "jpeg"])
    work_card = st.file_uploader("Téléversez la carte de travail", type=["jpg", "png", "jpeg"])
    selfie = st.file_uploader("Téléversez la photo selfie", type=["jpg", "png", "jpeg"])

    if st.button("Envoyer les documents"):
        if identity_card and work_card and selfie:
            files = {
                "identity_card": identity_card,
                "work_card": work_card,
                "selfie": selfie
            }

            # Envoi des fichiers au backend
            response = requests.post(
                UPLOAD_URL.format(user_id=user_id),
                files={
                    "identity_card": files["identity_card"].getvalue(),
                    "work_card": files["work_card"].getvalue(),
                    "selfie": files["selfie"].getvalue()
                },
                data={"email": email}  # Envoie aussi l'email pour le dossier
            )

            if response.status_code == 200:
                st.success("Documents téléchargés avec succès!")
            else:
                st.error(f"Erreur: {response.text}")
        else:
            st.error("Veuillez télécharger tous les fichiers nécessaires.")

if __name__ == "__main__":
    upload_documents()
