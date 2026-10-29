"""PlantVillage 38 Classes metadata and agricultural knowledge mapping."""

PLANT_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

def parse_class_name(raw_name: str) -> dict:
    parts = raw_name.split("___")
    crop = parts[0].replace("_", " ").replace("(", "").replace(")", "").strip()
    disease_raw = parts[1] if len(parts) > 1 else "Unknown"
    is_healthy = "healthy" in disease_raw.lower()
    disease_name = "Healthy" if is_healthy else disease_raw.replace("_", " ").strip()
    
    return {
        "raw_label": raw_name,
        "crop": crop,
        "disease": disease_name,
        "is_healthy": is_healthy,
        "display_name": f"{crop} - {disease_name}"
    }

# Comprehensive Knowledge Base for supported diseases
DISEASE_KNOWLEDGE_BASE = {
    "Apple___Apple_scab": {
        "crop": "Apple",
        "disease": "Apple Scab",
        "scientific_name": "Venturia inaequalis",
        "is_healthy": False,
        "severity_level": "Moderate to High",
        "description": "A serious fungal disease that attacks leaves, fruit, and twigs, causing olive-green to black velvety spots that can deform fruit.",
        "symptoms": [
            "Olive-green to dark brown velvety circular lesions on leaf surfaces",
            "Crinkling and premature dropping of infected leaves",
            "Rough, corky scabs on developing fruit",
            "Stunted fruit growth and cracking"
        ],
        "causes": "High humidity, prolonged leaf wetness (6-9+ hours), and spring temperatures between 15-24°C.",
        "prevention": [
            "Rake and destroy fallen leaves in autumn to eliminate overwintering spores",
            "Prune trees during dormancy to improve air circulation and sunlight penetration",
            "Plant scab-resistant cultivars such as Liberty, Enterprise, or Freedom",
            "Apply drip irrigation to keep foliage dry"
        ],
        "management": [
            "Prune out diseased twigs and bag infected leaves immediately",
            "Apply organically approved copper or sulfur-based protectant sprays at green tip stage",
            "Consult agricultural extension advisors if severe defoliation recurs"
        ],
        "references": [
            {"title": "Cornell University Fruit Pathology - Apple Scab", "url": "https://blogs.cornell.edu/fruitpathology"},
            {"title": "UC IPM Pest Management Guidelines - Apple Scab", "url": "https://ipm.ucanr.edu"}
        ]
    },
    "Apple___Black_rot": {
        "crop": "Apple",
        "disease": "Black Rot (Frogeye Leaf Spot)",
        "scientific_name": "Botryosphaeria obtusa",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Fungal pathogen causing purple-rimmed circular leaf spots (frogeye), cankers on bark, and firm black rotting fruit.",
        "symptoms": [
            "Small purple specks on leaves that expand into tan spots with dark purple borders (frogeye appearance)",
            "Sunken reddish-brown cankers on branches",
            "Firm brown to black rotting mummies hanging on the tree",
            "Pycnidia (tiny black pimple-like fruiting bodies) on fruit and cankers"
        ],
        "causes": "Overwintering in dead wood, mummified apples, and wounded bark under warm, wet conditions (20-27°C).",
        "prevention": [
            "Remove all mummified fruit left on trees during winter pruning",
            "Cut out cankers at least 15 cm below visible infection",
            "Disinfect pruning tools between cuts using 70% isopropyl alcohol",
            "Control insect damage that creates entry wounds"
        ],
        "management": [
            "Burn or bury infected wood and mummified fruit",
            "Use protective bio-fungicides or captan according to local regional agricultural extension guidance",
            "Ensure balanced fertilization to prevent tree stress"
        ],
        "references": [
            {"title": "Penn State Extension - Apple Diseases: Black Rot", "url": "https://extension.psu.edu"}
        ]
    },
    "Apple___Cedar_apple_rust": {
        "crop": "Apple",
        "disease": "Cedar Apple Rust",
        "scientific_name": "Gymnosporangium juniperi-virginianae",
        "is_healthy": False,
        "severity_level": "Moderate",
        "description": "Heteroecious rust fungus requiring both apple trees and eastern red cedar/juniper to complete its life cycle.",
        "symptoms": [
            "Bright orange-yellow circular spots on the upper leaf surface",
            "Small black fungal dots within the orange rings",
            "Raised tube-like sporangia (aecia) on the underside of leaves",
            "Premature defoliation in severe infections"
        ],
        "causes": "Spores blown by wind from gelatinous cedar galls during warm spring rain.",
        "prevention": [
            "Remove nearby eastern red cedar (Juniperus virginiana) within 500-1000 meters if feasible",
            "Select rust-immune apple varieties such as Redfree, William's Pride, and Liberty",
            "Inspect nearby junipers for galls in late winter and prune them"
        ],
        "management": [
            "Apply protective fungicides (e.g., myclobutanil or sulfur) from pink bud until petal drop if historic pressure is high",
            "Maintain vigorous tree health with proper mulching and watering"
        ],
        "references": [
            {"title": "University of Minnesota Extension - Cedar Apple Rust", "url": "https://extension.umn.edu"}
        ]
    },
    "Apple___healthy": {
        "crop": "Apple",
        "disease": "Healthy",
        "scientific_name": "Malus domestica",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Leaves display vibrant green coloration, intact cuticle, and uniform venation without lesions, spots, or deformities.",
        "symptoms": ["Normal dark green foliage", "No discoloration, spots, curling, or mildew"],
        "causes": "Optimal nutrition, adequate sunlight, well-draining soil, and effective pest management.",
        "prevention": ["Continue balanced drip irrigation", "Annual pruning", "Regular pest scouting"],
        "management": ["Maintain routine organic mulch and seasonal care."],
        "references": [{"title": "Good Agricultural Practices (GAP) for Apple Orchards", "url": "https://fao.org"}]
    },
    "Corn_(maize)___Common_rust_": {
        "crop": "Corn (Maize)",
        "disease": "Common Rust",
        "scientific_name": "Puccinia sorghi",
        "is_healthy": False,
        "severity_level": "Moderate",
        "description": "Fungal infection causing elongated cinnamon-brown pustules on both upper and lower corn leaf surfaces.",
        "symptoms": [
            "Golden-brown to cinnamon pustules scattered across leaves",
            "Powdery red-brown spores rubbing off on fingers",
            "Leaves turning yellow and dying under dense pustule coverage",
            "Reduced photosynthesis leading to smaller ears"
        ],
        "causes": "Airborne urediniospores carried from southern areas; favored by cool temperatures (16-25°C) and high humidity.",
        "prevention": [
            "Plant resistant corn hybrids with Rp gene resistance",
            "Plant early in the season to avoid late spore arrival",
            "Practice crop rotation with non-host crops like soybeans"
        ],
        "management": [
            "Scout weekly around tasseling stage",
            "Fungicide treatment is rarely needed unless rust covers >10% of ear leaf before whorl stage",
            "Ensure balanced nitrogen levels; avoid excess nitrogen that fuels fungal vegetative spread"
        ],
        "references": [
            {"title": "Purdue Extension - Common and Southern Rust of Corn", "url": "https://extension.purdue.edu"}
        ]
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn (Maize)",
        "disease": "Northern Corn Leaf Blight",
        "scientific_name": "Exserohilum turcicum",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Destructive fungal disease characterized by large, cigar-shaped, grayish-green to tan lesions on foliage.",
        "symptoms": [
            "Long, elliptical, cigar-shaped grayish-green lesions (2.5 to 15 cm long)",
            "Lesions turning tan as tissue dies, often showing dark fungal sporulation in damp weather",
            "Lesions coalescing to blight entire leaf canopy",
            "Severe yield loss if upper canopy is blighted near pollination"
        ],
        "causes": "High humidity, prolonged dew, temperatures between 18-27°C, and overwintering corn crop residue.",
        "prevention": [
            "Choose resistant hybrids with Ht genes",
            "Rotate corn with non-grass crops for at least one year",
            "Till or manage crop debris to accelerate residue decomposition"
        ],
        "management": [
            "Apply foliar fungicides during silking if lesions appear on the third leaf below the ear or higher",
            "Scout lower canopy early after heavy rain cycles"
        ],
        "references": [{"title": "Iowa State Extension - Northern Corn Leaf Blight", "url": "https://crops.extension.iastate.edu"}]
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "crop": "Corn (Maize)",
        "disease": "Gray Leaf Spot",
        "scientific_name": "Cercospora zeae-maydis",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Fungal disease causing distinct rectangular, vein-delimited lesions, leading to severe blighting and stalk lodging.",
        "symptoms": [
            "Small tan spots expanding into rectangular, blocky lesions restricted by leaf veins",
            "Lesions turning gray in humid morning dew as spores form",
            "Entire leaf death and stalk rot due to premature senescence"
        ],
        "causes": "Warm temperatures (25-32°C), high relative humidity (>90%), and minimum-tillage continuous corn systems.",
        "prevention": ["Plant tolerant corn hybrids", "Rotate with soybeans", "Chop and incorporate surface residue"],
        "management": ["Scout lower leaves before VT stage", "Apply strobilurin/triazole fungicide if threshold reached"],
        "references": [{"title": "University of Illinois Extension - Gray Leaf Spot", "url": "https://extension.illinois.edu"}]
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn (Maize)",
        "disease": "Healthy",
        "scientific_name": "Zea mays",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Robust, deep green leaves with crisp venation, sturdy stalk, and unblemished whorl.",
        "symptoms": ["Uniform green leaves", "No rectangular lesions, pustules, or wilt"],
        "causes": "Optimal soil nutrients (N-P-K), timely irrigation, and disease resistance.",
        "prevention": ["Maintain weed management", "Soil moisture monitoring"],
        "management": ["Standard agronomic practices."],
        "references": [{"title": "Corn Field Guide - Purdue Extension", "url": "https://purdue.edu"}]
    },
    "Grape___Black_rot": {
        "crop": "Grape",
        "disease": "Black Rot",
        "scientific_name": "Guignardia bidwellii",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Severe fungal disease attacking all green vine tissues, turning developing grapes into hard, black, shriveled mummies.",
        "symptoms": [
            "Circular reddish-brown leaf spots with black border dots (pycnidia)",
            "Soft brown spots on berries expanding rapidly into rot",
            "Berries shriveling into hard, wrinkled black mummies within days",
            "Black elliptical cankers on young shoots"
        ],
        "causes": "Warm rainy weather (24-30°C); overwintering mummies on the vine or ground.",
        "prevention": [
            "Thoroughly collect and bury or burn all mummified grape clusters during winter pruning",
            "Canopy management: shoot positioning and leaf pulling around fruit clusters for rapid drying",
            "Prune wild grapes within 100 meters of the vineyard"
        ],
        "management": [
            "Apply protective fungicides from early bloom until 4-6 weeks after bloom",
            "Promptly strip infected clusters before secondary spores infect neighboring bunches"
        ],
        "references": [{"title": "Cornell Viticulture - Grape Black Rot", "url": "https://grapesandwine.cals.cornell.edu"}]
    },
    "Grape___Esca_(Black_Measles)": {
        "crop": "Grape",
        "disease": "Esca (Black Measles)",
        "scientific_name": "Phaeomoniella chlamydospora & Fomitiporia mediterranea",
        "is_healthy": False,
        "severity_level": "Very High",
        "description": "Complex grapevine wood rot disease causing characteristic 'tiger stripe' leaf interveinal necrosis and spotted fruit.",
        "symptoms": [
            "'Tiger-striped' leaf pattern: yellow and brown necrosis between green veins",
            "Small dark purple or black speckles on berries ('measles')",
            "Sudden vine apoplexy (complete vine collapse in hot summer weather)",
            "Dark brown streaking and spongy white rot inside trunk wood"
        ],
        "causes": "Fungal spores entering through winter pruning wounds, gradually rotting vascular xylem over years.",
        "prevention": [
            "Delay winter pruning until late dormancy when wound healing is rapid",
            "Apply wound sealants or biological protectors (Trichoderma) to large cuts",
            "Use certified disease-free nursery rootstocks"
        ],
        "management": [
            "Trunk renewal: retrain a healthy sucker from the base if trunk is infected",
            "Mark symptomatic vines and prune them last to prevent cross-contamination"
        ],
        "references": [{"title": "UC IPM Grape Esca (Black Measles)", "url": "https://ipm.ucanr.edu"}]
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "crop": "Grape",
        "disease": "Leaf Blight (Isariopsis)",
        "scientific_name": "Pseudocercospora vitis",
        "is_healthy": False,
        "severity_level": "Moderate",
        "description": "Late-season foliar disease producing dark brown irregular necrotic spots that cause premature defoliation.",
        "symptoms": [
            "Irregular dull brown lesions with darker margins on older leaves",
            "Olive-brown fuzzy fungal growth on the underside of spots",
            "Premature leaf drop leading to sunburn on exposed fruit clusters"
        ],
        "causes": "Warm, humid climates with frequent autumn rainfall.",
        "prevention": ["Prune for canopy openness", "Rake fallen leaves after harvest", "Avoid overhead sprinkler irrigation"],
        "management": ["Post-harvest copper or sulfur protectant applications where indicated by extension guidelines"],
        "references": [{"title": "Texas A&M AgriLife - Grape Foliar Diseases", "url": "https://aggie-horticulture.tamu.edu"}]
    },
    "Grape___healthy": {
        "crop": "Grape",
        "disease": "Healthy",
        "scientific_name": "Vitis vinifera",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Lush, well-lobed leaves with smooth margins, clear green color, and vigorous shoot growth.",
        "symptoms": ["No spotting, tiger-striping, powdery mildew, or wilting"],
        "causes": "Balanced canopy management, targeted drip irrigation, and integrated pest management.",
        "prevention": ["Regular canopy maintenance and trellis training."],
        "management": ["Standard viticultural practices."],
        "references": [{"title": "UC Davis Viticulture & Enology", "url": "https://wineserver.ucdavis.edu"}]
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "crop": "Orange / Citrus",
        "disease": "Citrus Greening (Huanglongbing / HLB)",
        "scientific_name": "Candidatus Liberibacter asiaticus",
        "is_healthy": False,
        "severity_level": "Critical",
        "description": "One of the world's most devastating bacterial citrus diseases, transmitted by Asian citrus psyllids, causing asymmetrical leaf mottling and bitter, lopsided green fruit.",
        "symptoms": [
            "Asymmetric blotchy yellow mottle on leaf blades (cross-vein asymmetry)",
            "Yellowing of veins followed by corky appearance",
            "Small, lopsided, bitter fruit that stays green at the bottom",
            "Twig dieback, root system decay, and tree decline"
        ],
        "causes": "Fastidious phloem-limited bacterium vectored by the Asian citrus psyllid (Diaphorina citri) and infected budwood.",
        "prevention": [
            "Plant only certified disease-free citrus trees from registered enclosed nurseries",
            "Strict vector management: control Asian citrus psyllids using biological agents (Tamarixia radiata) and approved insecticidal rotations",
            "Quarantine compliance: never move citrus plants or cuttings across state/regional quarantine borders"
        ],
        "management": [
            "There is no chemical cure; infected trees should be removed and destroyed to protect neighboring groves",
            "Implement intensive foliar nutritional sprays to extend productive life of mildly affected trees",
            "Report suspected cases immediately to local agriculture department"
        ],
        "references": [
            {"title": "USDA APHIS - Citrus Greening", "url": "https://aphis.usda.gov"},
            {"title": "UF/IFAS Citrus Research and Education Center", "url": "https://crec.ifas.ufl.edu"}
        ]
    },
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease": "Early Blight",
        "scientific_name": "Alternaria solani",
        "is_healthy": False,
        "severity_level": "Moderate to High",
        "description": "Common foliar fungal disease causing characteristic target-like concentric rings on older leaves.",
        "symptoms": [
            "Dark brown to black circular lesions on older lower foliage",
            "Concentric rings producing a distinct 'bullseye' or target-board pattern",
            "Yellow halo surrounding mature spots",
            "Leaf tissue dying, curling, and remaining attached to the stem",
            "Brown, dry, leathery sunken lesions on potato tubers"
        ],
        "causes": "Alternating wet and dry periods, stressed plants, and temperatures between 20-30°C.",
        "prevention": [
            "Plant certified disease-free seed tubers",
            "Rotate crops for 3-4 years with non-solanaceous crops (avoid tomatoes and peppers)",
            "Maintain optimal vine fertility; nitrogen or phosphorus deficiency exacerbates early blight",
            "Water with drip lines early in the day to minimize leaf wetness"
        ],
        "management": [
            "Remove lower infected leaves if disease is caught early",
            "Apply protectant fungicides (chlorothalonil, mancozeb, or copper) before canopy closure if conditions favor disease",
            "Allow tubers to mature fully before harvest to thicken skin and avoid tuber infection"
        ],
        "references": [{"title": "University of Idaho Extension - Potato Early Blight", "url": "https://uidaho.edu/extension"}]
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "is_healthy": False,
        "severity_level": "Emergency / Critical",
        "description": "Devastating oomycete pathogen (infamous for the Irish Potato Famine) that rapidly turns lush green potato fields into blackened, rotting foliage within days.",
        "symptoms": [
            "Water-soaked, pale to dark green lesions expanding rapidly into brown/purplish-black blighted areas",
            "White fuzzy fungal-like growth on the underside of leaves during damp mornings",
            "Foul decaying odor in severely infected fields",
            "Brown granular dry rot extending into tuber flesh"
        ],
        "causes": "Cool, damp, fog/rainy weather with temperatures between 15-21°C and relative humidity above 90%.",
        "prevention": [
            "Plant certified resistant or disease-free seed potatoes",
            "Destroy all volunteer potatoes and cull piles before the planting season",
            "Ensure wide row spacing for maximum airflow through the canopy",
            "Monitor regional late blight forecasting networks"
        ],
        "management": [
            "Act immediately: apply systemic oomycete-targeted protectants before or at first sign of disease",
            "Kill vines 2-3 weeks before harvest to prevent tuber contamination during digging",
            "Immediately bag and remove localized diseased plants to avoid spore release"
        ],
        "references": [
            {"title": "USABlight - National Late Blight Monitoring", "url": "https://usablight.org"},
            {"title": "Cornell Vegetable MD Online - Potato Late Blight", "url": "https://vegetablemdonline.ppath.cornell.edu"}
        ]
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease": "Healthy",
        "scientific_name": "Solanum tuberosum",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Healthy potato canopy with vigorous compound leaves, deep green pigmentation, and sturdy erect stems.",
        "symptoms": ["Lush green foliage", "No water-soaked spots, target rings, or white mold"],
        "causes": "Balanced hilling, uniform soil moisture, and certified seed stock.",
        "prevention": ["Crop rotation", "Drip irrigation", "Regular scouting"],
        "management": ["Standard agronomic management."],
        "references": [{"title": "International Potato Center (CIP)", "url": "https://cipotato.org"}]
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease": "Bacterial Spot",
        "scientific_name": "Xanthomonas perforans / euvesicatoria",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Bacterial disease causing small, water-soaked dark spots on leaves and scabby rough raised spots on green tomatoes.",
        "symptoms": [
            "Small (2-3 mm) dark brown water-soaked angular spots on leaves",
            "Spots surrounded by yellow halos; leaves taking on a ragged appearance",
            "Black scabby spots with white halos on green fruit",
            "Severe defoliation exposing fruit to sunscald"
        ],
        "causes": "Splashing rain, overhead irrigation, contaminated seed, and temperatures of 24-30°C.",
        "prevention": [
            "Use certified disease-free treated seeds and healthy transplants",
            "Strictly avoid overhead irrigation; use drip lines under plastic mulch",
            "Never work in tomato fields when foliage is wet",
            "Rotate out of solanaceous crops for 2-3 years"
        ],
        "management": [
            "Apply copper-bactericide tank-mixed with mancozeb or bio-fungicide (Bacillus subtilis)",
            "Remove and destroy severely affected plants early",
            "Sterilize garden stakes and cages with bleach solution"
        ],
        "references": [{"title": "University of Florida IFAS - Bacterial Spot of Tomato", "url": "https://edis.ifas.ufl.edu"}]
    },
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease": "Early Blight",
        "scientific_name": "Alternaria linariae (A. solani)",
        "is_healthy": False,
        "severity_level": "Moderate to High",
        "description": "Widespread fungal pathogen creating characteristic target-ring lesions that move upwards from lower foliage.",
        "symptoms": [
            "Dark brown concentric ring spots on older lower leaves",
            "Yellowing around lesions, progressing to total leaf browning and leaf drop",
            "Sunken dark leathery lesions at the stem-end of fruit",
            "Stem cankers near the soil line"
        ],
        "causes": "Overwintering fungal mycelium in crop debris; splashing rain and humid weather.",
        "prevention": [
            "Mulch heavily around the base of tomato plants to prevent soil spores from splashing onto foliage",
            "Prune lower foliage (bottom 30 cm) once plants are established to eliminate soil contact",
            "Stake or cage tomatoes to keep foliage off the ground and improve airflow",
            "Water at the base with drip hoses"
        ],
        "management": [
            "Pinch off infected lower leaves as soon as first spots appear",
            "Apply protective copper, chlorothalonil, or Serenade bio-fungicide according to label",
            "Clean up all tomato residues in autumn"
        ],
        "references": [{"title": "NC State Extension - Early Blight of Tomato", "url": "https://content.ces.ncsu.edu"}]
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "is_healthy": False,
        "severity_level": "Emergency / Critical",
        "description": "Rapidly spreading oomycete disease capable of completely destroying tomato patches within a few rainy days.",
        "symptoms": [
            "Large, irregularly shaped greasy gray-green water-soaked lesions on leaves",
            "Lesions rapidly turning dark brown and greasy",
            "Delicate white cottony sporulation on the underside of blighted leaves",
            "Dark brown greasy firm rot on green and ripe fruit",
            "Stems turning black and brittle"
        ],
        "causes": "Cool, damp weather (15-22°C) with persistent humidity >90% or frequent rainfall.",
        "prevention": [
            "Plant resistant tomato cultivars such as Mountain Magic, Defiant, or Iron Lady",
            "Keep distance from potato crops and cull piles",
            "Provide ample spacing (at least 60-90 cm) between plants"
        ],
        "management": [
            "At first confirmed diagnosis, prune and immediately bag diseased vines on a sunny dry day",
            "Do not compost infected plants; seal in trash bags or bury deeply",
            "Spray copper protectants on unaffected surrounding plants"
        ],
        "references": [{"title": "University of Massachusetts Extension - Tomato Late Blight", "url": "https://ag.umass.edu"}]
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "disease": "Leaf Mold",
        "scientific_name": "Passalora fulva (Fulvia fulva)",
        "is_healthy": False,
        "severity_level": "Moderate",
        "description": "Predominantly a greenhouse and high-tunnel fungal disease causing pale green/yellow leaf spots with dense olive-brown velvety mold on the underside.",
        "symptoms": [
            "Pale yellow spots with indistinct margins on upper leaf surfaces",
            "Dense velvety olive-brown mold growth on corresponding lower leaf surface",
            "Leaves withering and curling prematurely from bottom to top"
        ],
        "causes": "High relative humidity (>85%) and moderate temperatures (21-24°C) inside protected structures.",
        "prevention": [
            "Ventilate high tunnels and greenhouses with exhaust fans to keep humidity below 80%",
            "Increase plant spacing to optimize airflow",
            "Choose resistant varieties with Cf resistance genes"
        ],
        "management": [
            "Prune suckers and lower canopy leaves to increase air movement",
            "Apply bio-fungicides or registered protectants if humidity cannot be controlled mechanically"
        ],
        "references": [{"title": "Cornell High Tunnel Vegetable Pathology", "url": "https://vegetablemdonline.ppath.cornell.edu"}]
    },
    "Tomato___Septoria_leaf_spot": {
        "crop": "Tomato",
        "disease": "Septoria Leaf Spot",
        "scientific_name": "Septoria lycopersici",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Very common destructive leaf disease characterized by numerous tiny circular spots with dark borders and pale gray centers studded with tiny black dots.",
        "symptoms": [
            "Numerous small (1.5-3 mm) circular spots with dark brown margins and gray/tan centers",
            "Tiny black specks (pycnidia) clearly visible in the center of mature spots under hand lens",
            "Leaves rapidly yellowing, withering, and dropping from ground upward",
            "Fruit is rarely infected directly, but suffers sunscald from lost canopy"
        ],
        "causes": "Fungal spores splashing from infected soil debris in warm, rainy weather.",
        "prevention": [
            "Mulch soil under plants immediately after transplanting",
            "Prune bottom 25-30 cm of branches",
            "Avoid overhead sprinkler irrigation",
            "Clean up all diseased garden debris in fall"
        ],
        "management": [
            "Strip infected lower leaves as soon as first spots appear",
            "Apply protective bio-fungicide or copper spray every 7-10 days in wet seasons"
        ],
        "references": [{"title": "Missouri Botanical Garden - Septoria Leaf Spot", "url": "https://missouribotanicalgarden.org"}]
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "crop": "Tomato",
        "disease": "Two-Spotted Spider Mite Infestation",
        "scientific_name": "Tetranychus urticae",
        "is_healthy": False,
        "severity_level": "Moderate to High",
        "description": "Tiny arachnid pests that pierce leaf cells to drink sap, creating fine golden-yellow stippling and delicate webbing.",
        "symptoms": [
            "Fine yellow or white stippling (speckling) across leaf surfaces",
            "Delicate silken webbing visible on leaf undersides and shoot tips",
            "Leaves taking on a bronzed or dirty dusty appearance",
            "Severe leaf drying, scorching, and defoliation in hot dry weather"
        ],
        "causes": "Hot, dry, dusty conditions (temperatures >30°C) which accelerate mite reproduction cycles to under 5 days.",
        "prevention": [
            "Keep field borders and pathways moist or mulched to suppress dust",
            "Avoid over-application of broad-spectrum synthetic pyrethroids that kill predatory beneficial insects",
            "Inspect leaf undersides weekly with a 10x hand lens"
        ],
        "management": [
            "Hose down plants with strong water jets to knock down webbing and mites",
            "Release beneficial predatory mites (Phytoseiulus persimilis or Neoseiulus californicus)",
            "Apply insecticidal soap or neem oil spray thoroughly covering leaf undersides in the evening"
        ],
        "references": [{"title": "UC IPM - Spider Mites Management Guidelines", "url": "https://ipm.ucanr.edu"}]
    },
    "Tomato___Target_Spot": {
        "crop": "Tomato",
        "disease": "Target Spot",
        "scientific_name": "Corynespora cassiicola",
        "is_healthy": False,
        "severity_level": "Moderate",
        "description": "Fungal disease causing brown necrotic lesions with concentric rings on leaves and deeply pitted lesions on fruit.",
        "symptoms": [
            "Pinpoint brown spots expanding into circular lesions with concentric rings",
            "Yellow halos surrounding spots",
            "Circular sunken lesions with dark margins on mature green or ripe fruit"
        ],
        "causes": "High humidity, prolonged leaf wetness, and temperatures between 20-28°C.",
        "prevention": ["Maintain good canopy airflow", "Avoid overhead watering", "Rotate with non-host crops"],
        "management": ["Foliar copper/fungicide applications according to local university advisory"],
        "references": [{"title": "University of Florida Plant Pathology", "url": "https://edis.ifas.ufl.edu"}]
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "crop": "Tomato",
        "disease": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "scientific_name": "Begomovirus (TYLCV)",
        "is_healthy": False,
        "severity_level": "Critical",
        "description": "Severe viral disease transmitted exclusively by whiteflies, causing extreme upward curling of leaves, bright yellowing, and severe plant stunting.",
        "symptoms": [
            "Leaves cupping and curling tightly upwards into a spoon or boat shape",
            "Pronounced interveinal yellowing (chlorosis) and reduced leaf size",
            "Severe plant stunting and erect bushy appearance",
            "Flower drop; few or no fruit setting after infection"
        ],
        "causes": "Transmitted by the sweetpotato/silverleaf whitefly (Bemisia tabaci); not seed-borne or mechanically transmitted.",
        "prevention": [
            "Plant TYLCV-resistant cultivars (e.g., Tycoon, Camaro, Chef's Choice)",
            "Use 50-mesh insect netting in greenhouses and nurseries to exclude whiteflies",
            "Install yellow sticky traps to detect whitefly populations early",
            "Use reflective silver mulch to repel whiteflies from young transplants"
        ],
        "management": [
            "Immediately rogue out and bag infected plants to prevent whiteflies from acquiring the virus",
            "Treat surrounding plants with horticultural soap or botanical neem to control whitefly vectors"
        ],
        "references": [
            {"title": "UC IPM - Tomato Yellow Leaf Curl Virus", "url": "https://ipm.ucanr.edu"},
            {"title": "FAO Plant Production and Protection Paper - TYLCV", "url": "https://fao.org"}
        ]
    },
    "Tomato___Tomato_mosaic_virus": {
        "crop": "Tomato",
        "disease": "Tomato Mosaic Virus (ToMV)",
        "scientific_name": "Tobamovirus (ToMV)",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Highly stable and infectious mechanical virus causing mottled light and dark green mosaic patterns and leaf distortion.",
        "symptoms": [
            "Mottling of leaves with alternating light green and dark green patches ('mosaic')",
            "Distorted, blistered, or fern-like narrow leaves ('shoestringing')",
            "Internal brown browning inside fruit walls",
            "Stunted plant growth and reduced fruit yield"
        ],
        "causes": "Mechanical transmission via workers' hands, tools, grafting, and contaminated tobacco products; persists for years in dry debris.",
        "prevention": [
            "Plant resistant tomato varieties with the Tm-2^2 gene",
            "Workers must wash hands with soap and water or skim milk before handling plants",
            "Prohibit tobacco use in or near tomato growing areas",
            "Disinfect pruning shears in 20% nonfat dry milk or 10% trisodium phosphate"
        ],
        "management": [
            "Immediately pull up and discard infected plants; do not touch neighboring plants",
            "Do not compost virus-infected plants"
        ],
        "references": [{"title": "Penn State Extension - Tomato Mosaic Virus", "url": "https://extension.psu.edu"}]
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease": "Healthy",
        "scientific_name": "Solanum lycopersicum",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Vibrant emerald green leaves, strong erect stems, abundant flowering, and smooth unblemished foliage.",
        "symptoms": ["Uniform green leaves", "No curling, yellowing, spots, or webs"],
        "causes": "Proper spacing, balanced NPK nutrition, drip irrigation, and regular pest scouting.",
        "prevention": ["Mulch under plants", "Keep lower leaves pruned", "Maintain consistent soil moisture"],
        "management": ["Standard agricultural practices for peak harvest."],
        "references": [{"title": "UC Davis Vegetable Research and Information Center", "url": "https://vric.ucdavis.edu"}]
    },
    "Pepper,_bell___Bacterial_spot": {
        "crop": "Pepper (Bell)",
        "disease": "Bacterial Spot",
        "scientific_name": "Xanthomonas euvesicatoria",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Major bacterial disease of peppers causing water-soaked spots on foliage and raised wart-like scabs on bell peppers.",
        "symptoms": [
            "Small circular dark brown water-soaked spots on leaves",
            "Spots drying to tan centers with dark borders; leaves dropping prematurely",
            "Raised, rough, circular blisters on pepper fruit",
            "Sunscald damage resulting from leaf loss"
        ],
        "causes": "High humidity, rain-splashing, warm temperatures (24-30°C), and infected seed.",
        "prevention": [
            "Use certified pathogen-free seeds with resistance to Xanthomonas races 1-10",
            "Avoid overhead irrigation; use drip irrigation",
            "Sanitize trellising stakes between seasons"
        ],
        "management": [
            "Apply copper-hydroxide bactericide tank mixed with mancozeb",
            "Remove diseased crop residues immediately after harvest"
        ],
        "references": [{"title": "Rutgers NJAES - Pepper Bacterial Spot", "url": "https://njaes.rutgers.edu"}]
    },
    "Pepper,_bell___healthy": {
        "crop": "Pepper (Bell)",
        "disease": "Healthy",
        "scientific_name": "Capsicum annuum",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Firm glossy dark green leaves with smooth intact margins and vigorous blossom sets.",
        "symptoms": ["Smooth green foliage", "No lesions, leaf drop, or scabs"],
        "causes": "Optimal warm temperatures, consistent moisture, and fertile soil.",
        "prevention": ["Mulching", "Drip watering", "Scouting"],
        "management": ["Routine care."],
        "references": [{"title": "Cornell Vegetable MD", "url": "https://vegetablemdonline.ppath.cornell.edu"}]
    },
    "Squash___Powdery_mildew": {
        "crop": "Squash / Cucurbits",
        "disease": "Powdery Mildew",
        "scientific_name": "Podosphaera xanthii",
        "is_healthy": False,
        "severity_level": "Moderate to High",
        "description": "Very common fungal disease producing a talcum-powder-like white coating over squash and pumpkin leaves.",
        "symptoms": [
            "White circular powdery fungal patches on upper and lower leaf surfaces",
            "Patches expanding to cover the entire leaf surface and petioles",
            "Leaves turning yellow, then brown, brittle, and dying prematurely",
            "Premature ripening and poor flavor in squash due to foliage loss"
        ],
        "causes": "Warm, dry climates (20-27°C) with high relative humidity at night and dense shade.",
        "prevention": [
            "Plant powdery mildew-resistant cucurbit varieties (PMR varieties)",
            "Plant in full sun with generous spacing (1.5-2 meters between hills)",
            "Weed thoroughly to maximize air currents"
        ],
        "management": [
            "Apply horticultural oils, potassium bicarbonate, or sulfur at the very first sign of white spots",
            "Prune out heavily infested older leaves to limit spore production"
        ],
        "references": [{"title": "Cornell University Cucurbit Pathology", "url": "https://vegetablemdonline.ppath.cornell.edu"}]
    },
    "Strawberry___Leaf_scorch": {
        "crop": "Strawberry",
        "disease": "Leaf Scorch",
        "scientific_name": "Diplocarpon earlianum",
        "is_healthy": False,
        "severity_level": "Moderate",
        "description": "Fungal disease causing irregular purple-to-brown blotches on leaves that give the strawberry bed a scorched, burned appearance.",
        "symptoms": [
            "Small irregular purple spots that enlarge into purple blotches with dark centers",
            "Leaf margins curling upwards and turning dry and brown ('scorched')",
            "Infected flower clusters drying out and failing to develop fruit"
        ],
        "causes": "Prolonged leaf wetness in spring and autumn with temperatures of 15-25°C.",
        "prevention": [
            "Choose certified disease-free strawberry crowns",
            "Plant in well-drained raised beds",
            "Mow or renovate strawberry beds after harvest to destroy infected foliage"
        ],
        "management": [
            "Apply registered protective fungicides during pre-bloom if weather is wet",
            "Mulch with clean straw to keep leaves elevated above wet soil"
        ],
        "references": [{"title": "Ohio State University Extension - Strawberry Leaf Scorch", "url": "https://ohioline.osu.edu"}]
    },
    "Strawberry___healthy": {
        "crop": "Strawberry",
        "disease": "Healthy",
        "scientific_name": "Fragaria × ananassa",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Healthy trifoliate leaves, deep glossy green, clean serrated margins, and vibrant crowns.",
        "symptoms": ["Lush trifoliate foliage", "No purple spots, scorched edges, or mildew"],
        "causes": "Optimal winter mulching, drip irrigation, and fertile raised beds.",
        "prevention": ["Seasonal renovation", "Clean straw mulch"],
        "management": ["Standard strawberry care."],
        "references": [{"title": "UC IPM Strawberry", "url": "https://ipm.ucanr.edu"}]
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "crop": "Cherry",
        "disease": "Powdery Mildew",
        "scientific_name": "Podosphaera clandestina",
        "is_healthy": False,
        "severity_level": "Moderate",
        "description": "Fungal disease causing powdery white circular patches on cherry leaves and fruit scarring.",
        "symptoms": [
            "Circular white powdery patches on young cherry leaves",
            "Leaves curling upward and distorting",
            "Webby fungal mycelium covering developing cherries",
            "Sunken brown scars on fruit"
        ],
        "causes": "High humidity, warm temperatures, and dense shaded tree canopies.",
        "prevention": ["Prune cherry trees to open canopy to sunlight", "Avoid overhead sprinkler irrigation"],
        "management": ["Apply horticultural oil or sulfur sprays at petal fall and shuck fall"],
        "references": [{"title": "Washington State University Extension - Cherry Powdery Mildew", "url": "https://treefruit.wsu.edu"}]
    },
    "Cherry_(including_sour)___healthy": {
        "crop": "Cherry",
        "disease": "Healthy",
        "scientific_name": "Prunus avium",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Vibrant green elliptical leaves with smooth serrated margins and healthy fruit spurs.",
        "symptoms": ["Normal foliage", "No powdery mold, leaf curl, or shot holes"],
        "causes": "Dormant pruning, adequate chilling hours, and regular tree nutrition.",
        "prevention": ["Canopy thinning", "Scouting"],
        "management": ["Standard orchard practices."],
        "references": [{"title": "WSU Tree Fruit Research", "url": "https://treefruit.wsu.edu"}]
    },
    "Peach___Bacterial_spot": {
        "crop": "Peach",
        "disease": "Bacterial Spot",
        "scientific_name": "Xanthomonas arboricola pv. pruni",
        "is_healthy": False,
        "severity_level": "High",
        "description": "Bacterial disease causing angular water-soaked leaf spots that drop out to leave 'shot holes', and deep pitted fruit lesions.",
        "symptoms": [
            "Angular purple-black water-soaked spots on leaves",
            "Dead centers falling out, giving leaves a 'shot hole' appearance",
            "Deep cracked gumming pits on peach skin",
            "Severe early defoliation"
        ],
        "causes": "Blowing sandy rain and frequent spring wet periods at temperatures around 20-25°C.",
        "prevention": [
            "Plant resistant peach varieties",
            "Plant windbreaks to reduce wind and blowing sand abrasions",
            "Avoid high nitrogen applications that create succulent tissue"
        ],
        "management": [
            "Apply dormant copper sprays and seasonal oxytetracycline applications per local extension guidelines"
        ],
        "references": [{"title": "Penn State Extension - Bacterial Spot of Peach", "url": "https://extension.psu.edu"}]
    },
    "Peach___healthy": {
        "crop": "Peach",
        "disease": "Healthy",
        "scientific_name": "Prunus persica",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Long lanceolate glossy green leaves, smooth bark, and vigorous fruit development.",
        "symptoms": ["Smooth leaves", "No shot holes, curl, or gumming"],
        "causes": "Pruning, proper thinning, and seasonal orchard care.",
        "prevention": ["Dormant spray program", "Scouting"],
        "management": ["Standard peach orchard practices."],
        "references": [{"title": "Clemson University Peach Guide", "url": "https://clemson.edu"}]
    },
    "Blueberry___healthy": {
        "crop": "Blueberry",
        "disease": "Healthy",
        "scientific_name": "Vaccinium corymbosum",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Dark green glossy leaves with distinct reticulate veins, acidic soil vigor, and healthy berry clusters.",
        "symptoms": ["Glossy foliage", "No mummy berry, rust, or scorch"],
        "causes": "Soil pH maintained between 4.5 and 5.2, pine mulch, and drip irrigation.",
        "prevention": ["Maintain acidic soil conditions", "Scout for blueberry maggot and fruit rot"],
        "management": ["Standard berry care."],
        "references": [{"title": "Michigan State University Blueberry Extension", "url": "https://canr.msu.edu"}]
    },
    "Raspberry___healthy": {
        "crop": "Raspberry",
        "disease": "Healthy",
        "scientific_name": "Rubus idaeus",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Vibrant pinnately compound leaves with silvery undersides, strong canes, and no spur blight.",
        "symptoms": ["Bright green compound foliage", "No spur blight, mosaic, or rust"],
        "causes": "Trellising, annual cane thinning, and well-drained organic soil.",
        "prevention": ["Thin old canes after harvest", "Keep rows narrow for airflow"],
        "management": ["Standard caneberry management."],
        "references": [{"title": "Oregon State University Extension - Caneberries", "url": "https://extension.oregonstate.edu"}]
    },
    "Soybean___healthy": {
        "crop": "Soybean",
        "disease": "Healthy",
        "scientific_name": "Glycine max",
        "is_healthy": True,
        "severity_level": "None",
        "description": "Healthy trifoliate leaves, deep green pigmentation, uniform nodulation, and unblemished pods.",
        "symptoms": ["Uniform green leaves", "No frogeye leaf spot, rust, or sudden death syndrome"],
        "causes": "Crop rotation with corn, rhizobial seed inoculation, and optimal weed control.",
        "prevention": ["Scout for soybean cyst nematode", "Maintain row spacing"],
        "management": ["Standard agronomic practices."],
        "references": [{"title": "Iowa State Soybean Research Center", "url": "https://www.iasoybeans.com"}]
    }
}

def get_disease_info(raw_label: str) -> dict:
    parsed = parse_class_name(raw_label)
    if raw_label in DISEASE_KNOWLEDGE_BASE:
        info = DISEASE_KNOWLEDGE_BASE[raw_label]
        return {**parsed, **info}
    
    # Generic fallback for any other class
    return {
        **parsed,
        "scientific_name": f"{parsed['crop']} pathogen",
        "severity_level": "Moderate" if not parsed["is_healthy"] else "None",
        "description": f"Condition affecting {parsed['crop']} plants identified as {parsed['disease']}.",
        "symptoms": [f"Foliar irregularities consistent with {parsed['disease']}"],
        "causes": "Environmental stress or plant pathogen interaction.",
        "prevention": ["Practice crop rotation", "Ensure adequate spacing", "Scout regularly"],
        "management": ["Isolate symptomatic plants", "Consult local agricultural extension advisor"],
        "references": [{"title": "FAO Plant Protection", "url": "https://fao.org"}]
    }
