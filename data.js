/* ============================================================================
   Euro Textile Spares — catalogue data
   Parsed from the European manufacturer catalogues (Samatex, Emil Broell).
   Consumed by script.js to render the product catalog sections.
   Each part carries an English (en) and German (de) name as printed in the
   original OEM catalogues.
   ========================================================================== */

/* ---- Emil Broell (Austria) — Navels for rotor spinning --------------------
   Photos: images/catalogue/navel-01.jpg … navel-16.jpg (catalogue order).      */
const NAVELS = [
  { type: "KDK6-1", series: "Quality — high performance", img: "images/catalogue/navel-01.jpg",
    fibre: "Cotton, Blends, Polyester, Viscose, Regenerat, Acrylics", counts: "< 20 Ne", endUse: "Weaving, Knitting",
    benefits: ["Low Uster & IPIs", "High rotor speed", "No shedding", "Reduced needle wear"] },
  { type: "KDK6-2", series: "Quality — high performance", img: "images/catalogue/navel-02.jpg",
    fibre: "Cotton, Blends, Polyester, Viscose", counts: "> 12 Ne", endUse: "Knitting",
    benefits: ["Low twist possible", "High rotor speed", "High covering", "Voluminous, very soft, raised yarn"] },
  { type: "KSK6", series: "Quality — high performance", img: "images/catalogue/navel-03.jpg",
    fibre: "Cotton, Viscose", counts: "> 12 Ne", endUse: "Knitting",
    benefits: ["Low twist possible", "High rotor speed", "High covering", "Voluminous yarn, very soft hand"] },
  { type: "KSK4", series: "Quality — high performance", img: "images/catalogue/navel-04.jpg",
    fibre: "Cotton", counts: "> 12 Ne", endUse: "Weaving",
    benefits: ["Low hairiness", "Good yarn strength", "High rotor speed", "Low Uster & IPIs"] },
  { type: "K3", series: "Basic — standard", img: "images/catalogue/navel-05.jpg",
    fibre: "Cotton", counts: "< 12 Ne", endUse: "Weaving",
    benefits: ["Low hairiness", "Denim yarns"] },
  { type: "K4", series: "Basic — standard", img: "images/catalogue/navel-06.jpg",
    fibre: "Cotton, Blends, Polyester, Viscose, Regenerat, Acrylics", counts: "> 3 Ne", endUse: "Weaving, Knitting",
    benefits: ["Universally usable", "Good spinning stability"] },
  { type: "K6 · Spirit A", series: "Basic — standard", img: "images/catalogue/navel-07.jpg",
    fibre: "Cotton, Blends, Polyester, Viscose", counts: "> 12 Ne", endUse: "Knitting, Weaving",
    benefits: ["High rotor speed", "Low Uster & IPIs"] },
  { type: "K8", series: "Basic — standard", img: "images/catalogue/navel-08.jpg",
    fibre: "Cotton, Viscose", counts: "> 12 Ne", endUse: "Knitting",
    benefits: ["Low twist possible"] },
  { type: "KD", series: "Smooth — even yarn", img: "images/catalogue/navel-09.jpg",
    fibre: "Cotton, Blends, Polyester, Viscose, Regenerat, Acrylics", counts: "< 20 Ne", endUse: "Weaving",
    benefits: ["Universally usable", "Smooth yarns", "Low hairiness", "High yarn strength", "Denim yarns"] },
  { type: "KG", series: "Smooth — even yarn", img: "images/catalogue/navel-10.jpg",
    fibre: "Cotton, Regenerat", counts: "< 12 Ne", endUse: "Weaving",
    benefits: ["Smooth yarns", "High yarn strength", "Denim yarns"] },
  { type: "KSS", series: "Smooth — even yarn", img: "images/catalogue/navel-11.jpg",
    fibre: "Cotton, Viscose, Regenerat", counts: "> 12 Ne", endUse: "Weaving",
    benefits: ["Smooth yarns", "Low hairiness", "High yarn strength", "Low Uster & IPIs", "Denim yarns"] },
  { type: "KS · Spirit S", series: "Smooth — even yarn", img: "images/catalogue/navel-12.jpg",
    fibre: "Cotton, Viscose", counts: "> 12 Ne", endUse: "Weaving",
    benefits: ["Smooth yarns", "Low hairiness", "High yarn strength", "Low Uster & IPIs", "High rotor speed"] },
  { type: "KD-2R4", series: "Soft — high volume yarn", img: "images/catalogue/navel-13.jpg",
    fibre: "Cotton, Blends, Viscose", counts: "< 20 Ne", endUse: "Knitting",
    benefits: ["Voluminous yarn", "Very soft hand", "Terry cloth", "High covering"] },
  { type: "KSS-2R4", series: "Soft — high volume yarn", img: "images/catalogue/navel-14.jpg",
    fibre: "Cotton", counts: "> 18 Ne", endUse: "Knitting",
    benefits: ["Voluminous yarn", "Very soft hand", "Terry cloth", "High covering"] },
  { type: "K4-2R4", series: "Soft — high volume yarn", img: "images/catalogue/navel-15.jpg",
    fibre: "Cotton", counts: "> 12 Ne", endUse: "Knitting",
    benefits: ["Low twist possible", "Voluminous yarn", "Very soft hand", "Terry cloth", "High covering"] },
  { type: "K8/36", series: "Soft — high volume yarn", img: "images/catalogue/navel-16.jpg",
    fibre: "Cotton, Acrylics, Linen", counts: "< 18 Ne", endUse: "Knitting",
    benefits: ["Voluminous yarn", "Very soft hand", "High covering"] }
];

/* Machines the Broell navels fit (from catalogue footer). */
const NAVEL_MACHINES = [
  "Rieter RU14A / R1 / R20 / R40 / R60 / R66 / R70",
  "Schlafhorst SE7 / SE8 / SE9 / SE10 / SE11 / ACO8 / ACO9",
  "Suessen SC1-M / SC2-M",
  "Saurer BD · Taitan · Rifa · Rieter BT"
];

/* ---- Samatex (Germany) — Autoconer winding-machine spares (image per part) */
const AUTOCONER_PARTS = [{"en":"Membrane","img":"images/parts/autoconer-001.jpg"},{"en":"Cone","img":"images/parts/autoconer-002.jpg"},{"en":"Drive Belt 10×26.204mm","img":"images/parts/autoconer-003.jpg"},{"en":"Reversing Device","img":"images/parts/autoconer-004.jpg"},{"en":"Brake Bush","img":"images/parts/autoconer-005.jpg"},{"en":"Adapter Plate Left (6-4)","img":"images/parts/autoconer-006.jpg"},{"en":"Cover Bracket","img":"images/parts/autoconer-007.jpg"},{"en":"Bracket with Magnet 64-Pole","img":"images/parts/autoconer-008.jpg"},{"en":"Wax Shaft","img":"images/parts/autoconer-009.jpg"},{"en":"Spring-Loaded Latch","img":"images/parts/autoconer-010.jpg"},{"en":"Cover","img":"images/parts/autoconer-011.jpg"},{"en":"Piston","img":"images/parts/autoconer-012.jpg"},{"en":"Stopper Actuating","img":"images/parts/autoconer-013.jpg"},{"en":"Spindle","img":"images/parts/autoconer-014.jpg"},{"en":"Cover Red","img":"images/parts/autoconer-015.jpg"},{"en":"Cover Yellow","img":"images/parts/autoconer-016.jpg"},{"en":"Adapter Ring 59mm Poly","img":"images/parts/autoconer-017.jpg"},{"en":"Brake Lining","img":"images/parts/autoconer-018.jpg"},{"en":"Brake Ring","img":"images/parts/autoconer-019.jpg"},{"en":"Pushbutton Black","img":"images/parts/autoconer-020.jpg"},{"en":"Swivel Lid","img":"images/parts/autoconer-021.jpg"},{"en":"Cover","img":"images/parts/autoconer-022.jpg"},{"en":"Pressure Cap","img":"images/parts/autoconer-023.jpg"},{"en":"Tension Disc","img":"images/parts/autoconer-024.jpg"},{"en":"Tension Disc (new Type)","img":"images/parts/autoconer-025.jpg"},{"en":"Rubber Sleeve","img":"images/parts/autoconer-026.jpg"},{"en":"Housing","img":"images/parts/autoconer-027.jpg"},{"en":"Catch Hook","img":"images/parts/autoconer-028.jpg"},{"en":"Suction Pipe Shutter","img":"images/parts/autoconer-029.jpg"},{"en":"Snarl Brake","img":"images/parts/autoconer-030.jpg"},{"en":"Opener Arm","img":"images/parts/autoconer-031.jpg"},{"en":"Starting Disc","img":"images/parts/autoconer-032.jpg"},{"en":"Coupling Half","img":"images/parts/autoconer-033.jpg"},{"en":"Toothed Wheel T=31","img":"images/parts/autoconer-034.jpg"},{"en":"Tension Disc (LH)","img":"images/parts/autoconer-035.jpg"},{"en":"Guide Plate","img":"images/parts/autoconer-036.jpg"},{"en":"Rubber Washer Black","img":"images/parts/autoconer-037.jpg"},{"en":"Screw Bolt","img":"images/parts/autoconer-038.jpg"},{"en":"Piston Rod","img":"images/parts/autoconer-039.jpg"},{"en":"Carrier","img":"images/parts/autoconer-040.jpg"},{"en":"Cover","img":"images/parts/autoconer-041.jpg"},{"en":"Lever","img":"images/parts/autoconer-042.jpg"},{"en":"Scissors Blade Steel","img":"images/parts/autoconer-043.jpg"},{"en":"Scissors Blade Steel (RH)","img":"images/parts/autoconer-044.jpg"},{"en":"Leaf Spring","img":"images/parts/autoconer-045.jpg"},{"en":"Step Motor","img":"images/parts/autoconer-046.jpg"},{"en":"Guide Wire","img":"images/parts/autoconer-047.jpg"},{"en":"Helical Gear T=29","img":"images/parts/autoconer-048.jpg"},{"en":"Lid Lever","img":"images/parts/autoconer-049.jpg"},{"en":"Bush","img":"images/parts/autoconer-050.jpg"},{"en":"Deflection Plate RH 6\"","img":"images/parts/autoconer-051.jpg"},{"en":"Scraper","img":"images/parts/autoconer-052.jpg"},{"en":"Round Cord Belt (blue) 188×6mm","img":"images/parts/autoconer-053.jpg"},{"en":"Brush","img":"images/parts/autoconer-054.jpg"},{"en":"Cradle Shock Absorber with Magnet","img":"images/parts/autoconer-055.jpg"},{"en":"Cradle Shock Absorber w/o Magnet","img":"images/parts/autoconer-056.jpg"},{"en":"Guide Lever","img":"images/parts/autoconer-057.jpg"},{"en":"Jointed Head","img":"images/parts/autoconer-058.jpg"},{"en":"Directional Valve","img":"images/parts/autoconer-059.jpg"},{"en":"Valve","img":"images/parts/autoconer-060.jpg"},{"en":"Yarn Guide Plate","img":"images/parts/autoconer-061.jpg"},{"en":"Housing -Blue-","img":"images/parts/autoconer-062.jpg"},{"en":"Stator","img":"images/parts/autoconer-063.jpg"},{"en":"Intermediate Piece","img":"images/parts/autoconer-064.jpg"},{"en":"Ball Cage Support","img":"images/parts/autoconer-065.jpg"},{"en":"Connecting Cable","img":"images/parts/autoconer-066.jpg"},{"en":"Prism DS1","img":"images/parts/autoconer-067.jpg"},{"en":"Plug","img":"images/parts/autoconer-068.jpg"},{"en":"Tension Device Housing","img":"images/parts/autoconer-069.jpg"},{"en":"Deflection Segment","img":"images/parts/autoconer-070.jpg"},{"en":"Swivel Wire","img":"images/parts/autoconer-071.jpg"},{"en":"Clamping Plate","img":"images/parts/autoconer-072.jpg"},{"en":"Roller","img":"images/parts/autoconer-073.jpg"},{"en":"Yarn Guide","img":"images/parts/autoconer-074.jpg"},{"en":"Scissors Blade Metall","img":"images/parts/autoconer-075.jpg"},{"en":"Cylinder","img":"images/parts/autoconer-076.jpg"},{"en":"Friction Layer","img":"images/parts/autoconer-077.jpg"},{"en":"Roller Oila","img":"images/parts/autoconer-078.jpg"},{"en":"Guide Plate","img":"images/parts/autoconer-079.jpg"},{"en":"Stepmotor small Plug","img":"images/parts/autoconer-080.jpg"},{"en":"Stepmotor small Plug (2)","img":"images/parts/autoconer-081.jpg"},{"en":"Stop Lever cpl.","img":"images/parts/autoconer-082.jpg"},{"en":"Stop Bush","img":"images/parts/autoconer-083.jpg"},{"en":"Pressure Spring","img":"images/parts/autoconer-084.jpg"},{"en":"Yarn Releaser","img":"images/parts/autoconer-085.jpg"},{"en":"Bearing Bracket","img":"images/parts/autoconer-086.jpg"},{"en":"Buffer","img":"images/parts/autoconer-087.jpg"},{"en":"Drive Sheave","img":"images/parts/autoconer-088.jpg"},{"en":"Rubber Cap Grey","img":"images/parts/autoconer-089.jpg"},{"en":"Stepmotor small Plug","img":"images/parts/autoconer-090.jpg"},{"en":"Drive Shaft","img":"images/parts/autoconer-091.jpg"},{"en":"Gear Wheel T=22","img":"images/parts/autoconer-092.jpg"},{"en":"Magnet Plate","img":"images/parts/autoconer-093.jpg"},{"en":"Fastening Disc","img":"images/parts/autoconer-094.jpg"},{"en":"Centering Roll","img":"images/parts/autoconer-095.jpg"},{"en":"Swivel Axle","img":"images/parts/autoconer-096.jpg"},{"en":"Bolt","img":"images/parts/autoconer-097.jpg"},{"en":"Deflection Plate LH 6\"","img":"images/parts/autoconer-098.jpg"},{"en":"Toothed Belt HTD 285-3M-9-CXPIII","img":"images/parts/autoconer-099.jpg"},{"en":"Gate Feeler Fork","img":"images/parts/autoconer-100.jpg"},{"en":"Bearing Plate","img":"images/parts/autoconer-101.jpg"},{"en":"Stopper","img":"images/parts/autoconer-102.jpg"},{"en":"Toothed Belt HTD 285-3M-9","img":"images/parts/autoconer-103.jpg"},{"en":"Bobbin Carrier Foot + Cover","img":"images/parts/autoconer-104.jpg"},{"en":"Bobbin Carrier Complete 18-21","img":"images/parts/autoconer-105.jpg"},{"en":"Bobbin Carrier Top 18-21","img":"images/parts/autoconer-106.jpg"},{"en":"Cover","img":"images/parts/autoconer-107.jpg"},{"en":"Magnet Box","img":"images/parts/autoconer-108.jpg"},{"en":"Chip Box","img":"images/parts/autoconer-109.jpg"},{"en":"Cam Follower","img":"images/parts/autoconer-110.jpg"},{"en":"Sensor Bracket","img":"images/parts/autoconer-111.jpg"},{"en":"Gripper","img":"images/parts/autoconer-112.jpg"},{"en":"Funnel Quarter","img":"images/parts/autoconer-113.jpg"},{"en":"Scissors Blade","img":"images/parts/autoconer-114.jpg"},{"en":"Scissors Blade (RH)","img":"images/parts/autoconer-115.jpg"},{"en":"Cylinder","img":"images/parts/autoconer-116.jpg"},{"en":"Tilting Lever","img":"images/parts/autoconer-117.jpg"},{"en":"Lever","img":"images/parts/autoconer-118.jpg"},{"en":"Guide Plate","img":"images/parts/autoconer-119.jpg"},{"en":"Toothed Lock Washer","img":"images/parts/autoconer-120.jpg"},{"en":"Bearing Bolt","img":"images/parts/autoconer-121.jpg"},{"en":"Cleaning Brush","img":"images/parts/autoconer-122.jpg"},{"en":"3/2 Valve","img":"images/parts/autoconer-123.jpg"},{"en":"Cylinder (small)","img":"images/parts/autoconer-124.jpg"}];

/* ---- Samatex (Germany) — Autocoro rotor-spinning spares (grouped) --------- */
const AUTOCORO_PARTS = [{"en":"Adapter Plate LH","img":"images/parts/autocoro-001.jpg","group":"ACO 8+"},{"en":"Adapter RH 54","img":"images/parts/autocoro-002.jpg","group":"ACO 8+"},{"en":"Air Filter","img":"images/parts/autocoro-003.jpg","group":"ACO 8+"},{"en":"Bracket","img":"images/parts/autocoro-004.jpg","group":"ACO 8+"},{"en":"Holder","img":"images/parts/autocoro-005.jpg","group":"ACO 8+"},{"en":"Cleaner cpl.","img":"images/parts/autocoro-006.jpg","group":"ACO 8+"},{"en":"Leaf Spring","img":"images/parts/autocoro-007.jpg","group":"ACO 8+"},{"en":"Spinning Position Cover","img":"images/parts/autocoro-008.jpg","group":"ACO 8+"},{"en":"Spinning Position Cover (2)","img":"images/parts/autocoro-009.jpg","group":"ACO 8+"},{"en":"Clamping Plate","img":"images/parts/autocoro-010.jpg","group":"Winding Head"},{"en":"Housing -blue-","img":"images/parts/autocoro-011.jpg","group":"Winding Head"},{"en":"Detector","img":"images/parts/autocoro-012.jpg","group":"Winding Head"},{"en":"Yarn Guide Bow (EFW/SRZ)","img":"images/parts/autocoro-013.jpg","group":"Winding Head"},{"en":"Housing -blue- (2)","img":"images/parts/autocoro-014.jpg","group":"Winding Head"},{"en":"Bow Guide (EFW/SRK)","img":"images/parts/autocoro-015.jpg","group":"Winding Head"},{"en":"Push Button (MFW)","img":"images/parts/autocoro-016.jpg","group":"Winding Head"},{"en":"Take-up Button Complete","img":"images/parts/autocoro-017.jpg","group":"Winding Head"},{"en":"Start Button -blue-","img":"images/parts/autocoro-018.jpg","group":"Winding Head"},{"en":"Adapter Plate (4°20/Geb.)","img":"images/parts/autocoro-019.jpg","group":"Winding Head"},{"en":"Adapter Plate -SRZ-","img":"images/parts/autocoro-020.jpg","group":"Winding Head"},{"en":"Adapter (70×58.8mm)","img":"images/parts/autocoro-021.jpg","group":"Winding Head"},{"en":"Adapter Plate (4°20/Geb.) (2)","img":"images/parts/autocoro-022.jpg","group":"Winding Head"},{"en":"Adapter Holder RH","img":"images/parts/autocoro-023.jpg","group":"Winding Head"},{"en":"Adapter Plate -SRZ- (2)","img":"images/parts/autocoro-024.jpg","group":"Winding Head"},{"en":"Adapter Holder Zyl.","img":"images/parts/autocoro-025.jpg","group":"Winding Head"},{"en":"Drive Gear -2 parts-","img":"images/parts/autocoro-026.jpg","group":"Winding Head"},{"en":"Stripping Roller","img":"images/parts/autocoro-027.jpg","group":"Winding Head"},{"en":"Cap","img":"images/parts/autocoro-028.jpg","group":"Winding Head"},{"en":"Stripping Roller (2)","img":"images/parts/autocoro-029.jpg","group":"Winding Head"},{"en":"Interceptor","img":"images/parts/autocoro-030.jpg","group":"Winding Head"},{"en":"Supporting Ring","img":"images/parts/autocoro-031.jpg","group":"Winding Head"},{"en":"Wax Drive Belt -Triangle-","img":"images/parts/autocoro-032.jpg","group":"Winding Head"},{"en":"Cam Gear","img":"images/parts/autocoro-033.jpg","group":"Winding Head"},{"en":"Yarn Guide","img":"images/parts/autocoro-034.jpg","group":"Winding Head"},{"en":"Dash Pot","img":"images/parts/autocoro-035.jpg","group":"Winding Head"},{"en":"Main Drive Cylinder (SRZ)","img":"images/parts/autocoro-036.jpg","group":"Winding Head"},{"en":"Drive Sleeve (SRK)","img":"images/parts/autocoro-037.jpg","group":"Winding Head"},{"en":"Drive Sleeve Opti Drive (SRZ)","img":"images/parts/autocoro-038.jpg","group":"Winding Head"},{"en":"Holder Sensor Corolab","img":"images/parts/autocoro-039.jpg","group":"Winding Head"},{"en":"Grooved Ball Bearing 608KDDB","img":"images/parts/autocoro-040.jpg","group":"Winding Head"},{"en":"Bearing Bolt","img":"images/parts/autocoro-041.jpg","group":"Winding Head"},{"en":"Pressure Regulator","img":"images/parts/autocoro-042.jpg","group":"Winding Head"},{"en":"Cam Roller cpl.","img":"images/parts/autocoro-043.jpg","group":"Winding Head"},{"en":"Pressure Arm Roll (SRK)","img":"images/parts/autocoro-044.jpg","group":"Winding Head"},{"en":"Hook","img":"images/parts/autocoro-045.jpg","group":"Section"},{"en":"Ejector cpl.","img":"images/parts/autocoro-046.jpg","group":"Section"},{"en":"Clamping Piece","img":"images/parts/autocoro-047.jpg","group":"Section"},{"en":"Butterfly Valve","img":"images/parts/autocoro-048.jpg","group":"Section"},{"en":"Butterfly Valve (2)","img":"images/parts/autocoro-049.jpg","group":"Section"},{"en":"Butterfly Valve (3)","img":"images/parts/autocoro-050.jpg","group":"Section"},{"en":"Cable Carriage","img":"images/parts/autocoro-051.jpg","group":"Section"},{"en":"Roller with Bearing cpl.","img":"images/parts/autocoro-052.jpg","group":"Section"},{"en":"Cylinder 16×30","img":"images/parts/autocoro-053.jpg","group":"Section"},{"en":"Voltage Regulator","img":"images/parts/autocoro-054.jpg","group":"Suction Device"},{"en":"Traction Magnet","img":"images/parts/autocoro-055.jpg","group":"Suction Device"},{"en":"Coupling Half (2×)","img":"images/parts/autocoro-056.jpg","group":"Suction Device"},{"en":"Tension Pulley","img":"images/parts/autocoro-057.jpg","group":"Suction Device"},{"en":"Shaft","img":"images/parts/autocoro-058.jpg","group":"Suction Device"},{"en":"Handle","img":"images/parts/autocoro-059.jpg","group":"Suction Device"},{"en":"Chain Wheel T=30","img":"images/parts/autocoro-060.jpg","group":"Suction Device"},{"en":"Deflection Pulley","img":"images/parts/autocoro-061.jpg","group":"Suction Device"},{"en":"Bracket","img":"images/parts/autocoro-062.jpg","group":"Suction Device"},{"en":"Distance Ring","img":"images/parts/autocoro-063.jpg","group":"Drive"},{"en":"Gear Wheel T=38","img":"images/parts/autocoro-064.jpg","group":"Drive"},{"en":"Ring Labyrinth","img":"images/parts/autocoro-065.jpg","group":"Drive"},{"en":"Omega Coupling","img":"images/parts/autocoro-066.jpg","group":"Drive"},{"en":"Coupling Half","img":"images/parts/autocoro-067.jpg","group":"Drive"},{"en":"Clamping Piece","img":"images/parts/autocoro-068.jpg","group":"Drive"},{"en":"Clamping Tube","img":"images/parts/autocoro-069.jpg","group":"Drive"},{"en":"Cover","img":"images/parts/autocoro-070.jpg","group":"Drive"},{"en":"Lever","img":"images/parts/autocoro-071.jpg","group":"Drive"},{"en":"Light Barrier","img":"images/parts/autocoro-072.jpg","group":"Coromat"},{"en":"Running Wheel","img":"images/parts/autocoro-073.jpg","group":"Coromat"},{"en":"Pinion T=21","img":"images/parts/autocoro-074.jpg","group":"Coromat"},{"en":"Brush","img":"images/parts/autocoro-075.jpg","group":"Coromat"},{"en":"Yarn Guide Roll","img":"images/parts/autocoro-076.jpg","group":"Coromat"},{"en":"Initiator","img":"images/parts/autocoro-077.jpg","group":"Coromat"},{"en":"Shaft","img":"images/parts/autocoro-078.jpg","group":"Coromat"},{"en":"Jointed Head","img":"images/parts/autocoro-079.jpg","group":"Coromat"},{"en":"Intermediate Shaft","img":"images/parts/autocoro-080.jpg","group":"Coromat"},{"en":"Cam Disk A-7","img":"images/parts/autocoro-081.jpg","group":"Coromat"},{"en":"Cam Disk A-17","img":"images/parts/autocoro-082.jpg","group":"Coromat"},{"en":"Cam Disk A-1","img":"images/parts/autocoro-083.jpg","group":"Coromat"},{"en":"Supporting Plate","img":"images/parts/autocoro-084.jpg","group":"Coromat"},{"en":"Ejector","img":"images/parts/autocoro-085.jpg","group":"Coromat"},{"en":"Insertion Wire (MFW)","img":"images/parts/autocoro-086.jpg","group":"Coromat"},{"en":"Suction Tube SRK","img":"images/parts/autocoro-087.jpg","group":"Coromat"},{"en":"Suction Tube SRZ+1\"50","img":"images/parts/autocoro-088.jpg","group":"Coromat"},{"en":"Suction Tube SRZ","img":"images/parts/autocoro-089.jpg","group":"Coromat"},{"en":"Hand Crank cpl.","img":"images/parts/autocoro-090.jpg","group":"Cone Sleeve Supply"},{"en":"Spacer Bush","img":"images/parts/autocoro-091.jpg","group":"Cone Sleeve Supply"},{"en":"Gear Wheel T=40","img":"images/parts/autocoro-092.jpg","group":"Cone Sleeve Supply"},{"en":"Gear Wheel T=20","img":"images/parts/autocoro-093.jpg","group":"Cone Sleeve Supply"},{"en":"Pressure Spring","img":"images/parts/autocoro-094.jpg","group":"Cone Sleeve Supply"},{"en":"Lever","img":"images/parts/autocoro-095.jpg","group":"Cone Sleeve Supply"},{"en":"Feeler Wire","img":"images/parts/autocoro-096.jpg","group":"Cone Sleeve Supply"},{"en":"Conveyor Belt 1.760×113mm","img":"images/parts/autocoro-097.jpg","group":"Cone Sleeve Supply"},{"en":"Step Motor","img":"images/parts/autocoro-098.jpg","group":"Cone Sleeve Supply"},{"en":"Guide Tube","img":"images/parts/autocoro-099.jpg","group":"Spin Box"},{"en":"Lifting Bow","img":"images/parts/autocoro-100.jpg","group":"Spin Box"},{"en":"Tube -Square-","img":"images/parts/autocoro-101.jpg","group":"Spin Box"},{"en":"Suspension Ring -Steel-","img":"images/parts/autocoro-102.jpg","group":"Spin Box"},{"en":"Suspension Piece -Plastic-","img":"images/parts/autocoro-103.jpg","group":"Spin Box"},{"en":"Brake Shoe","img":"images/parts/autocoro-104.jpg","group":"Spin Box"},{"en":"Magnet Bush MRPS","img":"images/parts/autocoro-105.jpg","group":"Spin Box"},{"en":"Valve Bushing cpl.","img":"images/parts/autocoro-106.jpg","group":"Spin Box"},{"en":"Ring SW21","img":"images/parts/autocoro-107.jpg","group":"Spin Box"},{"en":"Rotor Chamber SE8 cpl.","img":"images/parts/autocoro-108.jpg","group":"Spin Box"},{"en":"Rotor Chamber SE9-10 cpl.","img":"images/parts/autocoro-109.jpg","group":"Spin Box"},{"en":"Rotor Chamber SE11-12 cpl.","img":"images/parts/autocoro-110.jpg","group":"Spin Box"},{"en":"Seal Gasket","img":"images/parts/autocoro-111.jpg","group":"Spin Box"},{"en":"Plastic Bushing and Washer","img":"images/parts/autocoro-112.jpg","group":"Spin Box"},{"en":"Membrane","img":"images/parts/autocoro-113.jpg","group":"Spin Box"},{"en":"Starting Bush","img":"images/parts/autocoro-114.jpg","group":"Spin Box"},{"en":"Seal Ring","img":"images/parts/autocoro-115.jpg","group":"Spin Box"},{"en":"Condenser","img":"images/parts/autocoro-116.jpg","group":"Spin Box"},{"en":"Gear Wheel cpl.","img":"images/parts/autocoro-117.jpg","group":"Spin Box"},{"en":"Adapter","img":"images/parts/autocoro-118.jpg","group":"Spin Box"},{"en":"Support Cover","img":"images/parts/autocoro-119.jpg","group":"Spin Box"},{"en":"Intake Motor","img":"images/parts/autocoro-120.jpg","group":"Spin Box"},{"en":"Seal (Fibre Channel)","img":"images/parts/autocoro-121.jpg","group":"Spin Box"},{"en":"Slotted Handle","img":"images/parts/autocoro-122.jpg","group":"Spin Box"},{"en":"Elastosil","img":"images/parts/autocoro-123.jpg","group":"Spin Box"},{"en":"Cover Plate","img":"images/parts/autocoro-124.jpg","group":"Spin Box"}];

/* ---- Samatex (Germany) — Ring-frame: Rieter Ring & Zinser Ring ------------ */
const RIETER_PARTS = [{"code":"RSM.R026","en":"Membrane small grey","img":"images/parts/rieter-01.jpg"},{"code":"RSM.R022","en":"Metal Ring small","img":"images/parts/rieter-02.jpg"},{"code":"RSM.R024","en":"Rubber Seal black","img":"images/parts/rieter-03.jpg"},{"code":"RSM.R025","en":"Spring","img":"images/parts/rieter-04.jpg"},{"code":"RSM.R041","en":"Clip for Outside Gripper","img":"images/parts/rieter-05.jpg"},{"code":"RSM.R020","en":"Outside Gripper (body only)","img":"images/parts/rieter-06.jpg"},{"code":"RSM.R018","en":"Outside Gripper complete","img":"images/parts/rieter-07.jpg"},{"code":"RSM.R001","en":"Bobbin Peg red","img":"images/parts/rieter-08.jpg"},{"code":"RSM.R002","en":"Bobbin Peg blue","img":"images/parts/rieter-09.jpg"},{"code":"RSM.R038","en":"Peg Tray","img":"images/parts/rieter-10.jpg"},{"code":"RSM.R016","en":"Carrier Bottom Part","img":"images/parts/rieter-11.jpg"},{"code":"RSM.R039","en":"Carrier Bottom Part short","img":"images/parts/rieter-12.jpg"},{"code":"RSM.R028","en":"Spindle Brake","img":"images/parts/rieter-13.jpg"},{"code":"RSM.R034","en":"Carrier Upper Part (Peg left · Gauge 70 mm)","img":"images/parts/rieter-14.jpg"},{"code":"RSM.R017","en":"Carrier Upper Part (Peg right · Gauge 70 mm)","img":"images/parts/rieter-15.jpg"},{"code":"RSM.R036","en":"Carrier Upper Part (Peg left · Gauge 75 mm)","img":"images/parts/rieter-16.jpg"},{"code":"RSM.R035","en":"Carrier Upper Part (Peg right · Gauge 75 mm)","img":"images/parts/rieter-17.jpg"}];

const ZINSER_PARTS = [{"code":"RSM.Z100","en":"Driver","img":"images/parts/zinser-01.jpg"},{"code":"RSM.Z150","en":"Deflector","img":"images/parts/zinser-02.jpg"},{"code":"RSM.Z153","en":"Cheese Head Screw M5×15","img":"images/parts/zinser-03.jpg"},{"code":"RSM.Z152","en":"Thrust Piece","img":"images/parts/zinser-04.jpg"},{"code":"RSM.Z050","en":"Grey Insert 26/28","img":"images/parts/zinser-05.jpg"},{"code":"RSM.Z051","en":"Red Insert 20/23","img":"images/parts/zinser-06.jpg"},{"code":"RSM.Z052","en":"Blue Insert 23/26","img":"images/parts/zinser-07.jpg"},{"code":"RSM.Z053","en":"Purple Insert 18/21","img":"images/parts/zinser-08.jpg"},{"code":"RSM.Z057","en":"PU-Insert","img":"images/parts/zinser-09.jpg"},{"code":"RSM.Z056","en":"Piston","img":"images/parts/zinser-10.jpg"},{"code":"RSM.Z058","en":"Piston with PU-Insert","img":"images/parts/zinser-11.jpg"},{"code":"RSM.Z055","en":"Spring","img":"images/parts/zinser-12.jpg"},{"code":"RSM.Z054","en":"Membrane","img":"images/parts/zinser-13.jpg"},{"code":"RSM.Z049","en":"Rear Plate with Metal Insert","img":"images/parts/zinser-14.jpg"},{"code":"RSM.Z045","en":"Front Head (colour inserts)","img":"images/parts/zinser-15.jpg"},{"code":"RSM.Z041","en":"Complete Outside Gripper","img":"images/parts/zinser-16.jpg"}];

/* ---- PhiComp AG (Switzerland) — Rotor cup & bearing, semi-automated OE machines
   (Schlafhorst/Oerlikon/Saurer BD-series, Rieter BT9xx/R3x, Taitan, Rifa). Speed is
   the rotor's rated max rpm. Coating and service life are derived from the type's
   suffix by coatingOf()/serviceLife() in script.js, so they are not stored here.
   PhiComp's order numbers are deliberately not published — do not add them back. */
const ROTOR_CUP_BEARING = [
  { type: "C533/U-D", speed: "110,000" },
  { type: "C536/U-D", speed: "90,000" },
  { type: "C536/U-DN", speed: "90,000" },
  { type: "S536/U-D", speed: "90,000" },
  { type: "C338/U-D", speed: "90,000" },
  { type: "C341/U-D", speed: "90,000" },
  { type: "C344/U-D", speed: "70,000" },
  { type: "C250/U-D", speed: "65,000" },
  { type: "C254/U-D", speed: "60,000" },
  { type: "C531/T-D", speed: "110,000" },
  { type: "C533/T-D", speed: "110,000" },
  { type: "S533/Tr-D", speed: "110,000" },
  { type: "C533/Tr-D", speed: "110,000" },
  { type: "C531/R-D", speed: "110,000" },
  { type: "C248/S-D", speed: "65,000" },
  { type: "T 32 D", speed: "110,000" },
  { type: "T 32 DN", speed: "110,000" },
  { type: "T 33 D", speed: "110,000" },
  { type: "T 33 DN", speed: "110,000" },
  { type: "T 34 D", speed: "110,000" },
  { type: "T 34 DN", speed: "110,000" },
  { type: "T 34 DD", speed: "110,000" },
  { type: "T 34 DDN", speed: "110,000" },
  { type: "Ts 36 D", speed: "90,000" },
  { type: "Ts 36 DN", speed: "90,000" },
  { type: "Ts 40 D", speed: "80,000" },
  { type: "Ts 40 DN", speed: "80,000" },
  { type: "Ts 43 D", speed: "75,000" },
  { type: "Ts 43 DN", speed: "75,000" },
  { type: "Vs 34 DN", speed: "110,000" },
  { type: "Vs 36 DN", speed: "90,000" },
  { type: "Vs 43 DN", speed: "75,000" },
  { type: "Z 37 DN", speed: "90,000" },
  { type: "Z 40 DN", speed: "80,000" },
  { type: "Z 43 DN", speed: "75,000" },
  { type: "Tc 36 DN", speed: "90,000" },
  { type: "R 36 D", speed: "90,000" }
];

/* ---- PhiComp AG (Switzerland) — SolidRotor, single-piece rotor for Autocoro 8-11 */
const SOLID_ROTOR = [
  { type: "G 628 DD" },
  { type: "G 630 DD" },
  { type: "G 631 DD" },
  { type: "G 633 DD" },
  { type: "G 636 DD" },
  { type: "T 633 DD" },
  { type: "Tx 633 DD" },
  { type: "T 636 DD" },
  { type: "T 640 DD" },
  { type: "T 646 DD" },
  { type: "Tc 636 DD" },
  { type: "Tc 640 DD" },
  { type: "Tc 646 DD" },
  { type: "U 640 DD" },
  { type: "S 652 DD" },
  { type: "K 631 DD" }
];
