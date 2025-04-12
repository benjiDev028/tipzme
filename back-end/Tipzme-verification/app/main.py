from fastapi import FastAPI
from app.db.database import Base, engine
from fastapi.staticfiles import StaticFiles
from app.api.verification_route import router as verification_router


from fastapi.middleware.cors import CORSMiddleware

# Création des tables dans la base de données
Base.metadata.create_all(bind=engine)

# Initialisation de l'application FastAPI
app = FastAPI(title="verifiction System API")

# Servir les fichiers statiques depuis le dossier "uploaded_documents"
app.mount("/uploaded_documents", StaticFiles(directory="uploaded_documents"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet l'accès depuis toutes les origines
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permet tous les headers
)

# Enregistrement des routes
app.include_router(verification_router, prefix="/kyc", tags=["Verification"])

