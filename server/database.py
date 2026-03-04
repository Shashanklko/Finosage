from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client["finosage"]
    # Ensure unique email index
    await db.users.create_index("email", unique=True)
    print("✓ Connected to MongoDB — finosage database")


async def close_db():
    global client
    if client:
        client.close()
        print("✗ MongoDB connection closed")


def get_db():
    return db
