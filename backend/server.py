from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from routes import router as api_routes
from database import create_indexes, init_guidance_data, init_support_resources, close_db_connection

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'premium_tribute_db')]

# Create the main app
app = FastAPI(
    title="Premium Tribute API",
    description="Combined Premium Tribute + AfterLife guidance application",
    version="2.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Premium Tribute API is running", "status": "healthy"}

# Include the main API routes
api_router.include_router(api_routes, prefix="")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database and create indexes on startup"""
    logger.info("Starting up Premium Tribute API...")
    try:
        await create_indexes()
        await init_guidance_data()
        await init_support_resources()
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Error during startup: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown"""
    logger.info("Shutting down Premium Tribute API...")
    await close_db_connection()
    logger.info("Database connection closed")
