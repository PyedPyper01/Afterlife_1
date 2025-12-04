import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import random

load_dotenv()

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'afterlife_db')

# Sample UK postcodes with coordinates
UK_POSTCODES = [
    {"postcode": "SW1A 1AA", "lat": 51.5014, "lon": -0.1419, "area": "Westminster, London"},
    {"postcode": "M1 1AA", "lat": 53.4808, "lon": -2.2426, "area": "Manchester"},
    {"postcode": "B1 1AA", "lat": 52.4862, "lon": -1.8904, "area": "Birmingham"},
    {"postcode": "LS1 1AA", "lat": 53.8008, "lon": -1.5491, "area": "Leeds"},
    {"postcode": "G1 1AA", "lat": 55.8642, "lon": -4.2518, "area": "Glasgow"},
    {"postcode": "EH1 1AA", "lat": 55.9533, "lon": -3.1883, "area": "Edinburgh"},
    {"postcode": "L1 1AA", "lat": 53.4084, "lon": -2.9916, "area": "Liverpool"},
    {"postcode": "BS1 1AA", "lat": 51.4545, "lon": -2.5879, "area": "Bristol"},
    {"postcode": "NE1 1AA", "lat": 54.9783, "lon": -1.6178, "area": "Newcastle"},
    {"postcode": "S1 1AA", "lat": 53.3811, "lon": -1.4701, "area": "Sheffield"},
]

FUNERAL_DIRECTORS = [
    "Dignity Funerals", "Co-op Funerals", "Legacy Independent Funeral Directors",
    "Compassionate Care Funerals", "Serenity Funeral Services", "Heritage Funeral Directors",
    "Eternal Rest Funeral Home", "Peaceful Passages", "Angel Wing Funerals",
    "Golden Gate Funeral Services", "Respectful Farewells", "Community Funeral Care"
]

FLORISTS = [
    "Bloom & Blossom", "Eternal Flowers", "Sympathy Blooms", "Rose Garden Florist",
    "Petals of Peace", "Memory Lane Flowers", "Graceful Gardens", "Tranquil Blooms",
    "Forever Flowers", "Serene Petals", "Remembrance Roses"
]

MASONS = [
    "Heritage Memorials", "Lasting Tributes Masonry", "Eternal Stone Works",
    "Classic Memorials", "Dignified Monuments", "Forever Remembered Memorials",
    "Stone & Memory", "Legacy Headstones", "Timeless Tributes"
]

VENUES = [
    "The Grand Hall", "Riverside Community Centre", "Heritage Chapel",
    "Garden View Venue", "Memorial Park Hall", "The Serenity Room",
    "Parkside Event Space", "The Reflection Hall"
]

CATERERS = [
    "Comfort Foods Catering", "Gathering Table", "Memorial Feast Catering",
    "Warm Welcome Caterers", "Community Kitchen", "Heartfelt Catering",
    "Celebration Meals", "Together Catering"
]

async def seed_suppliers():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"🌱 Seeding suppliers into {DB_NAME}...")
    
    # Clear existing suppliers
    await db.suppliers.delete_many({})
    print("   Cleared existing suppliers")
    
    suppliers = []
    supplier_id = 1
    
    for location in UK_POSTCODES:
        # Add funeral directors (3 per location)
        for i in range(3):
            name = random.choice(FUNERAL_DIRECTORS)
            suppliers.append({
                "id": f"supplier_{supplier_id}",
                "name": f"{name} - {location['area']}",
                "type": "funeral_director",
                "address": f"{random.randint(1, 200)} High Street, {location['area']}",
                "postcode": location['postcode'],
                "lat": location['lat'] + random.uniform(-0.01, 0.01),
                "lon": location['lon'] + random.uniform(-0.01, 0.01),
                "phone": f"0{random.randint(1000000000, 1999999999)}",
                "email": f"info@{name.lower().replace(' ', '')}.co.uk",
                "website": f"https://www.{name.lower().replace(' ', '')}.co.uk",
                "description": "Professional funeral services with compassionate care. Available 24/7 for immediate support.",
                "services": ["Burial", "Cremation", "Direct Cremation", "Repatriation", "Memorial Services"],
                "pricing": {
                    "basic_funeral": float(random.randint(3000, 4500)),
                    "full_service": float(random.randint(4500, 7000)),
                    "direct_cremation": float(random.randint(1200, 1800))
                },
                "rating": round(random.uniform(4.0, 5.0), 1),
                "review_count": random.randint(15, 150),
                "verified": random.choice([True, True, True, False]),  # 75% verified
                "available": True
            })
            supplier_id += 1
        
        # Add florists (2 per location)
        for i in range(2):
            name = random.choice(FLORISTS)
            suppliers.append({
                "id": f"supplier_{supplier_id}",
                "name": f"{name} - {location['area']}",
                "type": "florist",
                "address": f"{random.randint(1, 150)} Market Street, {location['area']}",
                "postcode": location['postcode'],
                "lat": location['lat'] + random.uniform(-0.01, 0.01),
                "lon": location['lon'] + random.uniform(-0.01, 0.01),
                "phone": f"0{random.randint(1000000000, 1999999999)}",
                "email": f"orders@{name.lower().replace(' ', '')}.co.uk",
                "website": f"https://www.{name.lower().replace(' ', '')}.co.uk",
                "description": "Beautiful funeral flowers and sympathy arrangements. Same-day delivery available.",
                "services": ["Casket Sprays", "Standing Wreaths", "Sympathy Bouquets", "Custom Arrangements"],
                "pricing": {
                    "wreath": float(random.randint(60, 150)),
                    "casket_spray": float(random.randint(100, 250)),
                    "bouquet": float(random.randint(40, 90))
                },
                "rating": round(random.uniform(4.2, 5.0), 1),
                "review_count": random.randint(20, 100),
                "verified": random.choice([True, True, False]),
                "available": True
            })
            supplier_id += 1
        
        # Add masons (1-2 per location)
        for i in range(random.randint(1, 2)):
            name = random.choice(MASONS)
            suppliers.append({
                "id": f"supplier_{supplier_id}",
                "name": f"{name} - {location['area']}",
                "type": "mason",
                "address": f"{random.randint(1, 100)} Industrial Estate, {location['area']}",
                "postcode": location['postcode'],
                "lat": location['lat'] + random.uniform(-0.02, 0.02),
                "lon": location['lon'] + random.uniform(-0.02, 0.02),
                "phone": f"0{random.randint(1000000000, 1999999999)}",
                "email": f"enquiries@{name.lower().replace(' ', '')}.co.uk",
                "website": f"https://www.{name.lower().replace(' ', '')}.co.uk",
                "description": "Quality headstones and memorials. Free consultation and design service.",
                "services": ["Headstones", "Memorial Plaques", "Inscriptions", "Restoration", "Custom Design"],
                "pricing": {
                    "basic_headstone": float(random.randint(800, 1500)),
                    "memorial_plaque": float(random.randint(200, 500)),
                    "inscription": float(random.randint(100, 300))
                },
                "rating": round(random.uniform(4.0, 5.0), 1),
                "review_count": random.randint(10, 60),
                "verified": random.choice([True, False]),
                "available": True
            })
            supplier_id += 1
        
        # Add venues (1 per location)
        name = random.choice(VENUES)
        suppliers.append({
            "id": f"supplier_{supplier_id}",
            "name": f"{name} - {location['area']}",
            "type": "venue",
            "address": f"{random.randint(1, 50)} Central Road, {location['area']}",
            "postcode": location['postcode'],
            "lat": location['lat'] + random.uniform(-0.015, 0.015),
            "lon": location['lon'] + random.uniform(-0.015, 0.015),
            "phone": f"0{random.randint(1000000000, 1999999999)}",
            "email": f"bookings@{name.lower().replace(' ', '')}.co.uk",
            "website": f"https://www.{name.lower().replace(' ', '')}.co.uk",
            "description": "Spacious and dignified venue for memorial services and receptions. Accessible facilities.",
            "services": ["Memorial Service Venue", "Reception Catering", "AV Equipment", "Parking"],
            "pricing": {
                "half_day": float(random.randint(300, 800)),
                "full_day": float(random.randint(600, 1500)),
                "evening": float(random.randint(400, 1000))
            },
            "rating": round(random.uniform(4.0, 5.0), 1),
            "review_count": random.randint(25, 80),
            "verified": True,
            "available": True
        })
        supplier_id += 1
        
        # Add caterers (1 per location)
        name = random.choice(CATERERS)
        suppliers.append({
            "id": f"supplier_{supplier_id}",
            "name": f"{name} - {location['area']}",
            "type": "caterer",
            "address": f"{random.randint(1, 120)} Station Road, {location['area']}",
            "postcode": location['postcode'],
            "lat": location['lat'] + random.uniform(-0.01, 0.01),
            "lon": location['lon'] + random.uniform(-0.01, 0.01),
            "phone": f"0{random.randint(1000000000, 1999999999)}",
            "email": f"info@{name.lower().replace(' ', '')}.co.uk",
            "website": f"https://www.{name.lower().replace(' ', '')}.co.uk",
            "description": "Compassionate catering for funeral wakes and memorial gatherings. Dietary requirements catered for.",
            "services": ["Buffet Catering", "Hot Meals", "Vegetarian Options", "Halal/Kosher", "Delivery"],
            "pricing": {
                "buffet_per_head": float(random.randint(10, 25)),
                "hot_meal_per_head": float(random.randint(15, 35)),
                "refreshments": float(random.randint(5, 12))
            },
            "rating": round(random.uniform(4.1, 5.0), 1),
            "review_count": random.randint(15, 90),
            "verified": random.choice([True, True, False]),
            "available": True
        })
        supplier_id += 1
    
    # Insert all suppliers
    await db.suppliers.insert_many(suppliers)
    print(f"✅ Seeded {len(suppliers)} suppliers across {len(UK_POSTCODES)} locations")
    print(f"   - Funeral Directors: {len([s for s in suppliers if s['type'] == 'funeral_director'])}")
    print(f"   - Florists: {len([s for s in suppliers if s['type'] == 'florist'])}")
    print(f"   - Stonemasons: {len([s for s in suppliers if s['type'] == 'mason'])}")
    print(f"   - Venues: {len([s for s in suppliers if s['type'] == 'venue'])}")
    print(f"   - Caterers: {len([s for s in suppliers if s['type'] == 'caterer'])}")
    
    client.close()
    print("🎉 Database seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_suppliers())
