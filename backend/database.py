from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database configuration
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]

# Collections
user_sessions = db.user_sessions
assessment_responses = db.assessment_responses
step_progress = db.step_progress
support_resources = db.support_resources
guidance_data = db.guidance_data

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        # User sessions indexes
        await user_sessions.create_index("created_at")
        await user_sessions.create_index("current_step")
        
        # Assessment responses indexes
        await assessment_responses.create_index("session_id")
        await assessment_responses.create_index("created_at")
        
        # Step progress indexes
        await step_progress.create_index("session_id")
        await step_progress.create_index("step_id")
        await step_progress.create_index([("session_id", 1), ("step_id", 1)])
        
        # Support resources indexes
        await support_resources.create_index("category")
        await support_resources.create_index("type")
        
        # Guidance data indexes
        await guidance_data.create_index("category")
        await guidance_data.create_index("religion")
        await guidance_data.create_index("location")
        await guidance_data.create_index("budget")
        
        print("Database indexes created successfully")
    except Exception as e:
        print(f"Error creating indexes: {e}")

async def init_guidance_data():
    """Initialize the database with guidance data"""
    try:
        # Check if guidance data already exists
        existing_count = await guidance_data.count_documents({})
        if existing_count > 0:
            print("Guidance data already exists in database")
            return
        
        # Comprehensive guidance data for all scenarios
        guidance_items = [
            # Immediate tasks for different locations
            {
                "category": "immediate_tasks",
                "location": "home",
                "data": {
                    "critical": [
                        {
                            "title": "Call 999 if death was unexpected",
                            "description": "If the death was sudden, unexpected, or you're unsure of the cause, call 999 immediately.",
                            "contact": "Emergency: 999"
                        },
                        {
                            "title": "Call GP or out-of-hours service",
                            "description": "If the death was expected, contact the GP or out-of-hours service to verify the death.",
                            "contact": "GP or call 111 for out-of-hours"
                        },
                        {
                            "title": "Contact funeral director",
                            "description": "Arrange for the body to be moved to a funeral home. Most funeral directors offer 24/7 service.",
                            "notes": "You can change funeral directors later if needed"
                        }
                    ],
                    "important": [
                        {
                            "title": "Inform close family and friends",
                            "description": "Contact immediate family members and close friends. Consider asking someone to help with calls.",
                            "notes": "You don't need to inform everyone immediately"
                        },
                        {
                            "title": "Secure the property",
                            "description": "Ensure the home is secure and consider who has keys. Cancel any regular services if needed.",
                            "notes": "Consider staying with family or having someone stay with you"
                        },
                        {
                            "title": "Look for important documents",
                            "description": "Locate will, insurance policies, pension details, and any funeral plans.",
                            "notes": "Check for a safe, filing cabinet, or solicitor's details"
                        }
                    ]
                }
            },
            {
                "category": "immediate_tasks",
                "location": "hospital",
                "data": {
                    "critical": [
                        {
                            "title": "Collect death certificate",
                            "description": "The hospital will provide a medical certificate of cause of death. You'll need this to register the death.",
                            "contact": "Hospital bereavement office"
                        },
                        {
                            "title": "Arrange body collection",
                            "description": "Decide if you want the body moved to a funeral home or mortuary. Hospital can store temporarily.",
                            "notes": "You have time to make this decision"
                        },
                        {
                            "title": "Contact funeral director",
                            "description": "Choose a funeral director to handle arrangements. They can collect from the hospital.",
                            "notes": "Hospital can provide local recommendations"
                        }
                    ],
                    "important": [
                        {
                            "title": "Collect personal belongings",
                            "description": "Gather all personal items from the hospital. Check with nursing staff about what needs collecting.",
                            "notes": "Hospital will keep items safe for a reasonable time"
                        },
                        {
                            "title": "Inform close family and friends",
                            "description": "Contact immediate family members and close friends. Hospital may have a quiet room for calls.",
                            "notes": "Hospital chaplain or bereavement officer can help if needed"
                        },
                        {
                            "title": "Register the death",
                            "description": "Register the death with the local registrar within 5 days. You'll need the medical certificate.",
                            "contact": "Local registrar office"
                        }
                    ]
                }
            },
            {
                "category": "immediate_tasks",
                "location": "care_home",
                "data": {
                    "critical": [
                        {
                            "title": "Speak with care home manager",
                            "description": "The care home will have procedures in place. They'll guide you through the immediate steps.",
                            "contact": "Care home manager or senior staff"
                        },
                        {
                            "title": "Collect death certificate",
                            "description": "The care home will arrange for GP to issue medical certificate of cause of death.",
                            "notes": "Care home will coordinate with GP"
                        },
                        {
                            "title": "Arrange funeral director",
                            "description": "Choose a funeral director. The care home may have recommendations and can coordinate collection.",
                            "notes": "Care home can help with arrangements"
                        }
                    ],
                    "important": [
                        {
                            "title": "Collect personal belongings",
                            "description": "Gather all personal items from the care home room. Staff will help identify everything.",
                            "notes": "No rush - care home will keep items safe"
                        },
                        {
                            "title": "Inform family and friends",
                            "description": "Contact immediate family members and close friends. Care home may have a quiet space available.",
                            "notes": "Care home staff can provide support"
                        },
                        {
                            "title": "Settle care home account",
                            "description": "Discuss final payments and any deposits with the care home finance team.",
                            "notes": "This can usually wait a few days"
                        }
                    ]
                }
            },
            {
                "category": "immediate_tasks",
                "location": "hospice",
                "data": {
                    "critical": [
                        {
                            "title": "Speak with hospice staff",
                            "description": "Hospice team will guide you through the process. They have experience with all procedures.",
                            "contact": "Hospice nursing staff or manager"
                        },
                        {
                            "title": "Collect death certificate",
                            "description": "Hospice will arrange for medical certificate of cause of death to be issued.",
                            "notes": "Usually handled by hospice doctor"
                        },
                        {
                            "title": "Arrange funeral director",
                            "description": "Choose a funeral director. Hospice can recommend local services and coordinate collection.",
                            "notes": "Hospice can help with arrangements"
                        }
                    ],
                    "important": [
                        {
                            "title": "Collect personal belongings",
                            "description": "Gather all personal items from the hospice room. Staff will help you identify everything.",
                            "notes": "Take your time - hospice will keep items safe"
                        },
                        {
                            "title": "Speak with bereavement support",
                            "description": "Most hospices offer ongoing bereavement support. Speak with the support team.",
                            "notes": "Support continues after death"
                        },
                        {
                            "title": "Inform family and friends",
                            "description": "Contact immediate family members and close friends. Hospice has quiet spaces available.",
                            "notes": "Hospice staff can provide emotional support"
                        }
                    ]
                }
            },
            {
                "category": "immediate_tasks",
                "location": "public",
                "data": {
                    "critical": [
                        {
                            "title": "Call 999 immediately",
                            "description": "Any death in a public place requires immediate emergency response.",
                            "contact": "Emergency: 999"
                        },
                        {
                            "title": "Wait for police/ambulance",
                            "description": "Stay at the scene until emergency services arrive. They will take control of the situation.",
                            "notes": "Police will investigate any sudden death"
                        },
                        {
                            "title": "Contact coroner's office",
                            "description": "Deaths in public places typically require coroner involvement. Police will coordinate this.",
                            "notes": "Coroner will decide if inquest is needed"
                        }
                    ],
                    "important": [
                        {
                            "title": "Inform close family",
                            "description": "Contact immediate family members. Consider asking someone to help with calls.",
                            "notes": "You may need emotional support"
                        },
                        {
                            "title": "Gather witness information",
                            "description": "If there were witnesses, police will take statements. Note any relevant information.",
                            "notes": "Police will handle formal witness statements"
                        },
                        {
                            "title": "Contact family solicitor",
                            "description": "Consider legal advice, especially if circumstances are complex.",
                            "notes": "May be needed depending on circumstances"
                        }
                    ]
                }
            },
            {
                "category": "immediate_tasks",
                "location": "other",
                "data": {
                    "critical": [
                        {
                            "title": "Contact appropriate authorities",
                            "description": "Depending on location, contact police, medical services, or relevant authorities.",
                            "contact": "Emergency: 999 or 111"
                        },
                        {
                            "title": "Secure death certificate",
                            "description": "Ensure medical certificate of cause of death is properly issued.",
                            "notes": "Required for registration"
                        },
                        {
                            "title": "Arrange funeral director",
                            "description": "Choose a funeral director to handle collection and arrangements.",
                            "notes": "They can guide you through the process"
                        }
                    ],
                    "important": [
                        {
                            "title": "Inform close family",
                            "description": "Contact immediate family members and close friends.",
                            "notes": "Consider asking for help with calls"
                        },
                        {
                            "title": "Gather important documents",
                            "description": "Collect all relevant documents and identification.",
                            "notes": "Will be needed for various procedures"
                        },
                        {
                            "title": "Secure arrangements",
                            "description": "Ensure all immediate arrangements are properly coordinated.",
                            "notes": "Take time to understand all requirements"
                        }
                    ]
                }
            },
            # Funeral planning for all religions
            {
                "category": "funeral_planning",
                "religion": "christian",
                "data": {
                    "title": "Christian Funeral",
                    "description": "Christian funerals typically include a church service with prayers, hymns, and readings from the Bible.",
                    "considerations": [
                        "Contact the church where the service will be held",
                        "Arrange for a priest, minister, or pastor to officiate",
                        "Choose appropriate hymns and Bible readings",
                        "Consider communion if appropriate to the denomination",
                        "Decide on burial or cremation based on family beliefs",
                        "Plan for church flowers and decorations"
                    ]
                }
            },
            {
                "category": "funeral_planning",
                "religion": "muslim",
                "data": {
                    "title": "Islamic Funeral",
                    "description": "Islamic funerals follow specific religious requirements including ritual washing, shrouding, and burial.",
                    "considerations": [
                        "Contact the local mosque or Islamic centre immediately",
                        "Arrange for ritual washing (Ghusl) and shrouding (Kafan)",
                        "Burial should occur as soon as possible, ideally within 24 hours",
                        "Funeral prayer (Salat al-Janazah) at mosque or graveside",
                        "Burial (not cremation) in Muslim section of cemetery",
                        "Consider arrangements for three days of mourning"
                    ]
                }
            },
            {
                "category": "funeral_planning",
                "religion": "jewish",
                "data": {
                    "title": "Jewish Funeral",
                    "description": "Jewish funerals emphasize simplicity and respect, with specific rituals and timing requirements.",
                    "considerations": [
                        "Contact the synagogue or Jewish burial society (Chevra Kadisha)",
                        "Arrange for ritual washing and preparation of the body",
                        "Burial should occur as soon as possible, preferably within 24 hours",
                        "Simple wooden coffin is traditional",
                        "Burial (not cremation) in Jewish cemetery",
                        "Plan for seven days of mourning (Shiva) after funeral"
                    ]
                }
            },
            {
                "category": "funeral_planning",
                "religion": "hindu",
                "data": {
                    "title": "Hindu Funeral",
                    "description": "Hindu funerals traditionally involve cremation with specific rituals and ceremonies.",
                    "considerations": [
                        "Contact the local Hindu temple or community centre",
                        "Arrange for ritual bathing and dressing of the body",
                        "Cremation is preferred, usually within 24 hours",
                        "Family may wish to perform last rites (Antyesti)",
                        "Consider arrangements for 13 days of mourning",
                        "Plan for scattering of ashes in sacred water if possible"
                    ]
                }
            },
            {
                "category": "funeral_planning",
                "religion": "buddhist",
                "data": {
                    "title": "Buddhist Funeral",
                    "description": "Buddhist funerals focus on meditation, chanting, and helping the deceased's spiritual journey.",
                    "considerations": [
                        "Contact the local Buddhist temple or community",
                        "Arrange for monks to perform chanting and rituals",
                        "Both burial and cremation are acceptable",
                        "Consider period of meditation and prayer",
                        "Simple, peaceful ceremony reflecting Buddhist values",
                        "Plan for merit-making activities for the deceased"
                    ]
                }
            },
            {
                "category": "funeral_planning",
                "religion": "sikh",
                "data": {
                    "title": "Sikh Funeral",
                    "description": "Sikh funerals emphasize equality and simplicity with specific prayers and cremation.",
                    "considerations": [
                        "Contact the local Gurdwara (Sikh temple)",
                        "Arrange for ritual bathing and the five Ks",
                        "Cremation is preferred religious practice",
                        "Sikh prayers (Ardas) and hymns (Kirtan) during service",
                        "Simple ceremony reflecting Sikh values of equality",
                        "Plan for community meal (Langar) after service"
                    ]
                }
            },
            {
                "category": "funeral_planning",
                "religion": "secular",
                "data": {
                    "title": "Secular/Non-religious Funeral",
                    "description": "Secular funerals focus on celebrating the person's life without religious content.",
                    "considerations": [
                        "Choose a celebrant or family member to officiate",
                        "Select meaningful music, poems, or readings",
                        "Include personal stories and memories",
                        "Consider both burial and cremation options",
                        "Plan tributes that reflect the person's values and interests",
                        "Create a service that celebrates their unique life"
                    ]
                }
            },
            {
                "category": "funeral_planning",
                "religion": "other",
                "data": {
                    "title": "Other Religious/Cultural Funeral",
                    "description": "Different faiths and cultures have unique funeral traditions and requirements.",
                    "considerations": [
                        "Contact the relevant religious or cultural leader",
                        "Research specific requirements for the faith/culture",
                        "Arrange appropriate rituals and ceremonies",
                        "Consider timing requirements and restrictions",
                        "Plan for community involvement as appropriate",
                        "Respect traditional practices and customs"
                    ]
                }
            },
            # Budget guides for all budget levels
            {
                "category": "budget_guide",
                "budget": "low",
                "data": {
                    "title": "Budget-Conscious Funeral (Under £3,000)",
                    "description": "A simple but dignified funeral focusing on essential elements.",
                    "costs": [
                        {"item": "Funeral director fees", "range": "£800-£1,200"},
                        {"item": "Cremation", "range": "£300-£500"},
                        {"item": "Simple coffin", "range": "£200-£400"},
                        {"item": "Hearse", "range": "£200-£300"},
                        {"item": "Simple service", "range": "£100-£200"},
                        {"item": "Death certificates", "range": "£20-£40"},
                        {"item": "Flowers (basic)", "range": "£50-£100"},
                        {"item": "Catering (simple)", "range": "£200-£400"}
                    ],
                    "tips": [
                        "Choose cremation over burial to save on grave costs",
                        "Select a simple coffin - it doesn't affect the dignity of the service",
                        "Limit the number of cars in the funeral procession",
                        "Hold the wake at home or community centre",
                        "Ask family to provide flowers instead of hiring a florist",
                        "Consider direct cremation for very low cost option"
                    ]
                }
            },
            {
                "category": "budget_guide",
                "budget": "medium",
                "data": {
                    "title": "Standard Funeral (£3,000 - £6,000)",
                    "description": "A traditional funeral with most standard elements included.",
                    "costs": [
                        {"item": "Funeral director fees", "range": "£1,200-£2,000"},
                        {"item": "Cremation/burial", "range": "£500-£1,000"},
                        {"item": "Standard coffin", "range": "£400-£800"},
                        {"item": "Hearse + family car", "range": "£400-£600"},
                        {"item": "Church/ceremony", "range": "£200-£400"},
                        {"item": "Death certificates", "range": "£20-£40"},
                        {"item": "Flowers", "range": "£150-£300"},
                        {"item": "Catering", "range": "£400-£800"}
                    ],
                    "tips": [
                        "Compare quotes from multiple funeral directors",
                        "Consider pre-paid funeral plans for future savings",
                        "Ask about package deals that include most services",
                        "Choose flowers that are in season",
                        "Consider buffet-style catering to reduce costs",
                        "Ask about payment plans if needed"
                    ]
                }
            },
            {
                "category": "budget_guide",
                "budget": "high",
                "data": {
                    "title": "Premium Funeral (£6,000 - £10,000)",
                    "description": "A more elaborate funeral with additional services and higher-quality options.",
                    "costs": [
                        {"item": "Funeral director fees", "range": "£2,000-£3,000"},
                        {"item": "Burial plot + service", "range": "£1,000-£2,000"},
                        {"item": "Premium coffin", "range": "£800-£1,500"},
                        {"item": "Multiple cars", "range": "£600-£1,000"},
                        {"item": "Church + organist", "range": "£400-£600"},
                        {"item": "Memorial stone", "range": "£500-£1,000"},
                        {"item": "Elaborate flowers", "range": "£300-£600"},
                        {"item": "Catering venue", "range": "£800-£1,500"}
                    ],
                    "tips": [
                        "Choose a reputable funeral director with good reviews",
                        "Consider the long-term costs of grave maintenance",
                        "Premium doesn't always mean better - focus on what matters",
                        "Ask about eco-friendly premium options",
                        "Plan the service to reflect the person's personality",
                        "Consider live streaming for distant relatives"
                    ]
                }
            },
            {
                "category": "budget_guide",
                "budget": "premium",
                "data": {
                    "title": "Luxury Funeral (Over £10,000)",
                    "description": "An elaborate funeral with premium services and personalized touches.",
                    "costs": [
                        {"item": "Premium funeral director", "range": "£3,000-£5,000"},
                        {"item": "Prime burial plot", "range": "£2,000-£4,000"},
                        {"item": "Luxury coffin/casket", "range": "£1,500-£3,000"},
                        {"item": "Full car procession", "range": "£1,000-£2,000"},
                        {"item": "Cathedral/premium venue", "range": "£600-£1,200"},
                        {"item": "Elaborate memorial", "range": "£1,000-£3,000"},
                        {"item": "Designer flowers", "range": "£600-£1,200"},
                        {"item": "Premium catering", "range": "£1,500-£3,000"}
                    ],
                    "tips": [
                        "Work with experienced funeral directors for complex arrangements",
                        "Consider unique personalization options",
                        "Plan well in advance for premium venues",
                        "Think about lasting memorials and tributes",
                        "Consider the wishes of the deceased above all else",
                        "Ensure all legal requirements are met despite complexity"
                    ]
                }
            },
            {
                "category": "budget_guide",
                "budget": "unsure",
                "data": {
                    "title": "Flexible Budget Planning",
                    "description": "Guidelines for planning when budget is uncertain or flexible.",
                    "costs": [
                        {"item": "Basic funeral director", "range": "£800-£3,000"},
                        {"item": "Cremation or burial", "range": "£300-£2,000"},
                        {"item": "Coffin (various options)", "range": "£200-£2,000"},
                        {"item": "Transport options", "range": "£200-£1,000"},
                        {"item": "Service venue", "range": "£100-£800"},
                        {"item": "Flowers (flexible)", "range": "£50-£800"},
                        {"item": "Catering (various)", "range": "£200-£2,000"},
                        {"item": "Additional services", "range": "£100-£1,000"}
                    ],
                    "tips": [
                        "Start with essential services and add extras as budget allows",
                        "Get detailed quotes from multiple providers",
                        "Consider what the deceased would have wanted",
                        "Ask about payment plans and financial assistance",
                        "Remember that meaningful doesn't have to be expensive",
                        "Focus on creating a service that honors their memory"
                    ]
                }
            }
        ]
        
        # Insert guidance data
        await guidance_data.insert_many(guidance_items)
        print("Guidance data initialized successfully")
        
    except Exception as e:
        print(f"Error initializing guidance data: {e}")

async def init_support_resources():
    """Initialize the database with support resources"""
    try:
        # Check if support resources already exist
        existing_count = await support_resources.count_documents({})
        if existing_count > 0:
            print("Support resources already exist in database")
            return
        
        # Sample support resources
        resources = [
            {
                "name": "Cruse Bereavement Support",
                "description": "Free bereavement support, counselling services, and information.",
                "contact": "0808 808 1677",
                "availability": "Mon-Fri 9:30am-5pm, Sat 10am-2pm",
                "type": "Counselling",
                "category": "emotional",
                "specialties": ["Individual counselling", "Group support", "Children's support"]
            },
            {
                "name": "Samaritans",
                "description": "Emotional support for anyone in emotional distress, thinking of suicide, or worried about someone else.",
                "contact": "116 123",
                "availability": "24/7",
                "type": "Crisis support",
                "category": "emotional",
                "specialties": ["Crisis support", "Suicide prevention", "Emotional listening"]
            },
            {
                "name": "Citizens Advice",
                "description": "Free, confidential advice on legal, financial, and practical matters.",
                "contact": "0808 223 1133",
                "availability": "Mon-Fri 9am-5pm",
                "type": "Advice",
                "category": "practical",
                "services": ["Legal advice", "Financial guidance", "Benefits information", "Debt advice"]
            },
            {
                "name": "Age UK",
                "description": "Support and advice for older people, including bereavement support.",
                "contact": "0800 169 6565",
                "availability": "Daily 8am-7pm",
                "type": "Age-specific",
                "category": "practical",
                "services": ["Practical support", "Befriending", "Legal advice", "Benefits guidance"]
            }
        ]
        
        # Insert support resources
        await support_resources.insert_many(resources)
        print("Support resources initialized successfully")
        
    except Exception as e:
        print(f"Error initializing support resources: {e}")

async def close_db_connection():
    """Close database connection"""
    client.close()