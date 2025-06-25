from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import claims, documents, ai, claimant_info
from app.core.config import settings

app = FastAPI(
    title="Auto Insurance Claims Processor API",
    description="AI-powered insurance claims processing with LangChain",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:3003"
    ],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(claims.router, prefix="/api/claims", tags=["claims"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(claimant_info.router, prefix="/api/claimant-info", tags=["claimant-info"])

# Serve uploaded files
import os
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
if os.path.exists(uploads_dir):
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Serve React build files (for production)
# app.mount("/", StaticFiles(directory="../client/build", html=True), name="frontend")

@app.get("/")
async def root():
    return {"message": "Auto Insurance Claims Processor API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
