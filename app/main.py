from fastapi import FastAPI
from app.db.database import Base, engine
from app.api.shift_route import router 
from app.api.shiftColleague_route import router as shift_router



from fastapi.middleware.cors import CORSMiddleware

# Création des tables dans la base de données
Base.metadata.create_all(bind=engine)

# Initialisation de l'application FastAPI
app = FastAPI(title="register System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet l'accès depuis toutes les origines
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permet tous les headers
)

# Enregistrement des routes
app.include_router(router, prefix="/sh", tags=["shift"])
app.include_router(shift_router, prefix="/shc", tags=["shiftColleague"])
