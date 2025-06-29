from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import claims, documents, ai
from app.core.config import settings

app = FastAPI(
    title="Auto Insurance Claims Processor API",
    description="AI-powered insurance claims processing with LangChain",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(claims.router, prefix="/api/claims", tags=["claims"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Serve React build files (for production)
# app.mount("/", StaticFiles(directory="../client/build", html=True), name="frontend")

@app.get("/")
async def root():
    return {"message": "Auto Insurance Claims Processor API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
