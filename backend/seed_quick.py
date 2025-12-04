import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def seed_suppliers():
    client = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
    db = client[os.environ.get('DB_NAME', 'premium_tribute_db')]
    
    # Clear existing
    await db.suppliers.delete_many({})
    
    suppliers = [
        # London SW1A area
        {"id": "1", "name": "Westminster Funeral Services", "type": "funeral_director", "postcode": "SW1A 1AA", "address": "10 Victoria Street, Westminster, London", "phone": "020 7946 0958", "verified": True, "available": True, "rating": 4.8, "lat": 51.5014, "lon": -0.1419},
        {"id": "2", "name": "Roses & Lilies Florist", "type": "florist", "postcode": "SW1A 2AB", "address": "25 Parliament Street, Westminster, London", "phone": "020 7946 1234", "verified": True, "available": True, "rating": 4.6, "lat": 51.5008, "lon": -0.1265},
        {"id": "3", "name": "Heritage Memorials", "type": "mason", "postcode": "SW1A 0AA", "address": "5 Whitehall Place, Westminster, London", "phone": "020 7946 5678", "verified": True, "available": True, "rating": 4.9, "lat": 51.5045, "lon": -0.1243},
        
        # Manchester M1 area
        {"id": "4", "name": "Manchester Funeral Directors", "type": "funeral_director", "postcode": "M1 1AA", "address": "45 Deansgate, Manchester", "phone": "0161 234 5678", "verified": True, "available": True, "rating": 4.7, "lat": 53.4808, "lon": -2.2426},
        {"id": "5", "name": "City Centre Flowers", "type": "florist", "postcode": "M1 2AB", "address": "12 Market Street, Manchester", "phone": "0161 234 9012", "verified": True, "available": True, "rating": 4.5, "lat": 53.4825, "lon": -2.2395},
        
        # Birmingham B1 area
        {"id": "6", "name": "Birmingham Bereavement Services", "type": "funeral_director", "postcode": "B1 1AA", "address": "78 Bull Street, Birmingham", "phone": "0121 456 7890", "verified": True, "available": True, "rating": 4.8, "lat": 52.4814, "lon": -1.8998},
        {"id": "7", "name": "Memorial Florists Birmingham", "type": "florist", "postcode": "B1 2BB", "address": "34 New Street, Birmingham", "phone": "0121 456 1234", "verified": True, "available": True, "rating": 4.6, "lat": 52.4796, "lon": -1.8988},
        
        # Leeds LS1 area
        {"id": "8", "name": "Yorkshire Funeral Care", "type": "funeral_director", "postcode": "LS1 1AA", "address": "56 Briggate, Leeds", "phone": "0113 234 5678", "verified": True, "available": True, "rating": 4.7, "lat": 53.7997, "lon": -1.5420},
        {"id": "9", "name": "Leeds Memorial Masons", "type": "mason", "postcode": "LS1 2AB", "address": "23 The Headrow, Leeds", "phone": "0113 234 9012", "verified": True, "available": True, "rating": 4.8, "lat": 53.8008, "lon": -1.5491},
        
        # Edinburgh EH1 area
        {"id": "10", "name": "Edinburgh Funeral Directors", "type": "funeral_director", "postcode": "EH1 1AA", "address": "89 Princes Street, Edinburgh", "phone": "0131 234 5678", "verified": True, "available": True, "rating": 4.9, "lat": 55.9533, "lon": -3.1883},
        {"id": "11", "name": "Royal Mile Flowers", "type": "florist", "postcode": "EH1 2AB", "address": "45 Royal Mile, Edinburgh", "phone": "0131 234 9012", "verified": True, "available": True, "rating": 4.7, "lat": 55.9506, "lon": -3.1837},
        
        # Glasgow G1 area
        {"id": "12", "name": "Glasgow Funeral Services", "type": "funeral_director", "postcode": "G1 1AA", "address": "123 Sauchiehall Street, Glasgow", "phone": "0141 234 5678", "verified": True, "available": True, "rating": 4.6, "lat": 55.8642, "lon": -4.2518},
        {"id": "13", "name": "Celtic Memorials", "type": "mason", "postcode": "G1 2AB", "address": "67 Buchanan Street, Glasgow", "phone": "0141 234 9012", "verified": True, "available": True, "rating": 4.8, "lat": 55.8605, "lon": -4.2514},
        
        # Bristol BS1 area
        {"id": "14", "name": "Bristol Bereavement Care", "type": "funeral_director", "postcode": "BS1 1AA", "address": "45 Broadmead, Bristol", "phone": "0117 234 5678", "verified": True, "available": True, "rating": 4.7, "lat": 51.4545, "lon": -2.5879},
        {"id": "15", "name": "Avon Flowers & Tributes", "type": "florist", "postcode": "BS1 2AB", "address": "78 Park Street, Bristol", "phone": "0117 234 9012", "verified": True, "available": True, "rating": 4.5, "lat": 51.4538, "lon": -2.6030},
        
        # Liverpool L1 area
        {"id": "16", "name": "Merseyside Funeral Directors", "type": "funeral_director", "postcode": "L1 1AA", "address": "123 Lord Street, Liverpool", "phone": "0151 234 5678", "verified": True, "available": True, "rating": 4.8, "lat": 53.4084, "lon": -2.9916},
        {"id": "17", "name": "Liverpool Memorial Stones", "type": "mason", "postcode": "L1 2AB", "address": "56 Bold Street, Liverpool", "phone": "0151 234 9012", "verified": True, "available": True, "rating": 4.6, "lat": 53.4030, "lon": -2.9792},
        
        # Newcastle NE1 area
        {"id": "18", "name": "Tyneside Funeral Services", "type": "funeral_director", "postcode": "NE1 1AA", "address": "89 Northumberland Street, Newcastle", "phone": "0191 234 5678", "verified": True, "available": True, "rating": 4.7, "lat": 54.9783, "lon": -1.6178},
        {"id": "19", "name": "Northern Blooms", "type": "florist", "postcode": "NE1 2AB", "address": "34 Grey Street, Newcastle", "phone": "0191 234 9012", "verified": True, "available": True, "rating": 4.8, "lat": 54.9738, "lon": -1.6131},
        
        # Cardiff CF10 area
        {"id": "20", "name": "Cardiff Funeral Care", "type": "funeral_director", "postcode": "CF10 1AA", "address": "67 Queen Street, Cardiff", "phone": "029 2034 5678", "verified": True, "available": True, "rating": 4.6, "lat": 51.4816, "lon": -3.1791},
    ]
    
    await db.suppliers.insert_many(suppliers)
    print(f"✅ Seeded {len(suppliers)} suppliers")

if __name__ == "__main__":
    asyncio.run(seed_suppliers())
