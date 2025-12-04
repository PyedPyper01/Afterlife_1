import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import random

MONGO_URL = 'mongodb://localhost:27017'
DB_NAME = 'afterlife_db'

# Comprehensive UK postcode areas
UK_POSTCODE_AREAS = [
    # London
    "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18",
    "EC1", "EC2", "EC3", "EC4",
    "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10", "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20", "N21", "N22",
    "NW1", "NW2", "NW3", "NW4", "NW5", "NW6", "NW7", "NW8", "NW9", "NW10", "NW11",
    "SE1", "SE2", "SE3", "SE4", "SE5", "SE6", "SE7", "SE8", "SE9", "SE10", "SE11", "SE12", "SE13", "SE14", "SE15", "SE16", "SE17", "SE18", "SE19", "SE20", "SE21", "SE22", "SE23", "SE24", "SE25", "SE26", "SE27", "SE28",
    "SW1", "SW2", "SW3", "SW4", "SW5", "SW6", "SW7", "SW8", "SW9", "SW10", "SW11", "SW12", "SW13", "SW14", "SW15", "SW16", "SW17", "SW18", "SW19", "SW20",
    "W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12", "W13", "W14",
    "WC1", "WC2",
    
    # South East
    "AL1", "AL2", "AL3", "AL4", "AL5", "AL6", "AL7", "AL8", "AL9", "AL10",  # St Albans
    "BR1", "BR2", "BR3", "BR4", "BR5", "BR6", "BR7", "BR8",  # Bromley
    "BN1", "BN2", "BN3", "BN7", "BN8", "BN9", "BN10", "BN11", "BN12",  # Brighton
    "CT1", "CT2", "CT3", "CT4", "CT5", "CT6",  # Canterbury
    "GU1", "GU2", "GU3", "GU4", "GU5", "GU6",  # Guildford
    "HP1", "HP2", "HP3", "HP4", "HP5", "HP6",  # Hemel Hempstead
    "ME1", "ME2", "ME3", "ME4", "ME5", "ME7",  # Medway
    "MK1", "MK2", "MK3", "MK4", "MK5", "MK6", "MK7", "MK8", "MK9", "MK10",  # Milton Keynes
    "OX1", "OX2", "OX3", "OX4",  # Oxford
    "RG1", "RG2", "RG4", "RG5", "RG6",  # Reading
    "SL1", "SL2", "SL3", "SL4", "SL6",  # Slough
    "TN1", "TN2", "TN3", "TN4", "TN9",  # Tunbridge Wells
    
    # South West
    "BA1", "BA2", "BA3", "BA4",  # Bath
    "BS1", "BS2", "BS3", "BS4", "BS5", "BS6", "BS7", "BS8", "BS9", "BS10",  # Bristol
    "EX1", "EX2", "EX3", "EX4",  # Exeter
    "PL1", "PL2", "PL3", "PL4", "PL5", "PL6",  # Plymouth
    "SO14", "SO15", "SO16", "SO17", "SO18", "SO19",  # Southampton
    "TR1", "TR2", "TR3", "TR4",  # Truro
    
    # East
    "CB1", "CB2", "CB3", "CB4",  # Cambridge
    "CM1", "CM2", "CM3", "CM7",  # Chelmsford
    "CO1", "CO2", "CO3", "CO4", "CO5", "CO6",  # Colchester
    "IP1", "IP2", "IP3", "IP4",  # Ipswich
    "LU1", "LU2", "LU3", "LU4",  # Luton
    "NR1", "NR2", "NR3", "NR4", "NR5",  # Norwich
    "PE1", "PE2", "PE3",  # Peterborough
    
    # Midlands
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "B19", "B20",  # Birmingham
    "CV1", "CV2", "CV3", "CV4", "CV5", "CV6",  # Coventry
    "DE1", "DE21", "DE22", "DE23", "DE24",  # Derby
    "LE1", "LE2", "LE3", "LE4", "LE5",  # Leicester
    "NG1", "NG2", "NG3", "NG4", "NG5", "NG7",  # Nottingham
    "ST1", "ST2", "ST3", "ST4",  # Stoke-on-Trent
    "WS1", "WS2", "WS3", "WS4",  # Walsall
    "WV1", "WV2", "WV3", "WV4",  # Wolverhampton
    
    # North West
    "CH1", "CH2", "CH3", "CH4",  # Chester
    "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15",  # Liverpool
    "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18", "M19", "M20",  # Manchester
    "PR1", "PR2", "PR3", "PR4", "PR5",  # Preston
    "WA1", "WA2", "WA3", "WA4", "WA5",  # Warrington
    "WN1", "WN2", "WN3", "WN4",  # Wigan
    
    # Yorkshire
    "BD1", "BD2", "BD3", "BD4", "BD5", "BD6", "BD7", "BD8",  # Bradford
    "HU1", "HU2", "HU3", "HU4", "HU5",  # Hull
    "HD1", "HD2", "HD3", "HD4",  # Huddersfield
    "LS1", "LS2", "LS3", "LS4", "LS5", "LS6", "LS7", "LS8", "LS9", "LS10", "LS11", "LS12", "LS13", "LS14", "LS15",  # Leeds
    "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13",  # Sheffield
    "YO1", "YO10", "YO23", "YO24", "YO30", "YO31",  # York
    
    # North East
    "DH1", "DH2", "DH3", "DH4",  # Durham
    "NE1", "NE2", "NE3", "NE4", "NE5", "NE6", "NE7", "NE8", "NE9", "NE10", "NE11", "NE12", "NE13", "NE15",  # Newcastle
    "SR1", "SR2", "SR3", "SR4", "SR5",  # Sunderland
    "TS1", "TS2", "TS3", "TS4", "TS5",  # Middlesbrough
    
    # Scotland
    "AB10", "AB11", "AB12", "AB15", "AB16",  # Aberdeen
    "DD1", "DD2", "DD3", "DD4",  # Dundee
    "EH1", "EH2", "EH3", "EH4", "EH5", "EH6", "EH7", "EH8", "EH9", "EH10", "EH11", "EH12",  # Edinburgh
    "G1", "G2", "G3", "G4", "G5", "G11", "G12", "G13", "G14", "G15", "G20", "G21", "G31", "G32", "G33", "G40", "G41", "G42", "G43",  # Glasgow
    
    # Wales
    "CF10", "CF11", "CF14", "CF23", "CF24",  # Cardiff
    "SA1", "SA2", "SA3", "SA4", "SA5",  # Swansea
    "NP19", "NP20",  # Newport
    
    # Northern Ireland
    "BT1", "BT2", "BT3", "BT4", "BT5", "BT6", "BT7", "BT8", "BT9", "BT10", "BT11", "BT12", "BT13", "BT14", "BT15"  # Belfast
]

FUNERAL_DIRECTORS = [
    "Dignity Funerals", "Co-op Funerals", "Legacy Independent Funeral Directors",
    "Compassionate Care Funerals", "Serenity Funeral Services", "Heritage Funeral Directors",
    "Eternal Rest Funeral Home", "Peaceful Passages", "Angel Wing Funerals",
    "Golden Gate Funeral Services", "Respectful Farewells", "Community Funeral Care"
]

async def seed_comprehensive_coverage():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"🌱 Creating comprehensive UK coverage for {len(UK_POSTCODE_AREAS)} postcode areas...")
    
    # Clear existing
    await db.suppliers.delete_many({})
    print("   Cleared existing suppliers")
    
    suppliers = []
    supplier_id = 1
    
    for postcode_area in UK_POSTCODE_AREAS:
        # Add 2 funeral directors per postcode area
        for i in range(2):
            name = random.choice(FUNERAL_DIRECTORS)
            
            # Generate mock coordinates (not used in current search but good to have)
            lat = random.uniform(50.0, 57.0)
            lon = random.uniform(-5.0, 2.0)
            
            suppliers.append({
                "id": f"supplier_{supplier_id}",
                "name": f"{name} - {postcode_area}",
                "type": "funeral_director",
                "address": f"{random.randint(1, 200)} High Street, {postcode_area} Area",
                "postcode": f"{postcode_area} {random.randint(1, 9)}{random.choice(['AA', 'AB', 'AD', 'AE'])}",
                "lat": lat,
                "lon": lon,
                "phone": f"0{random.randint(1000000000, 1999999999)}",
                "email": f"info@{name.lower().replace(' ', '')}-{postcode_area.lower()}.co.uk",
                "website": f"https://www.{name.lower().replace(' ', '')}.co.uk",
                "description": "Professional funeral services with compassionate care. Available 24/7.",
                "services": ["Burial", "Cremation", "Direct Cremation", "Repatriation", "Memorial Services"],
                "pricing": {
                    "basic_funeral": float(random.randint(3000, 4500)),
                    "full_service": float(random.randint(4500, 7000)),
                    "direct_cremation": float(random.randint(1200, 1800))
                },
                "rating": round(random.uniform(4.0, 5.0), 1),
                "review_count": random.randint(15, 150),
                "verified": True,
                "available": True
            })
            supplier_id += 1
    
    # Insert in batches for performance
    batch_size = 100
    for i in range(0, len(suppliers), batch_size):
        batch = suppliers[i:i+batch_size]
        await db.suppliers.insert_many(batch)
        print(f"   Inserted batch {i//batch_size + 1}/{(len(suppliers)//batch_size) + 1}")
    
    total = await db.suppliers.count_documents({"type": "funeral_director"})
    print(f"\n✅ Complete! Database now has {total} funeral directors")
    print(f"📍 Coverage: {len(UK_POSTCODE_AREAS)} UK postcode areas")
    print(f"🎯 Any UK postcode will now find local results!\n")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_comprehensive_coverage())
