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

/* ---- Samatex (Germany) — Autoconer winding-machine spares (image per part).
   Photos replaced 2026-07 with real product photography (previously PDF-catalogue
   crops); see CLAUDE.md "Product photo pipeline". */
const AUTOCONER_PARTS = [{"en":"Prism DS1","img":"images/parts/autoconer-v2-01.jpg"},{"en":"Opener Arm","img":"images/parts/autoconer-v2-02.jpg"},{"en":"Brake Bush","img":"images/parts/autoconer-v2-03.jpg"},{"en":"Wax Shaft","img":"images/parts/autoconer-v2-04.jpg"},{"en":"Cover","img":"images/parts/autoconer-v2-05.jpg"},{"en":"Cover Red","img":"images/parts/autoconer-v2-06.jpg"},{"en":"Cover Yellow","img":"images/parts/autoconer-v2-07.jpg"},{"en":"Pushbutton Black","img":"images/parts/autoconer-v2-08.jpg"},{"en":"Brake Ring","img":"images/parts/autoconer-v2-09.jpg"},{"en":"Swivel Lid","img":"images/parts/autoconer-v2-10.jpg"},{"en":"Tension Device","img":"images/parts/autoconer-v2-11.jpg"},{"en":"Tension Disc (LH)","img":"images/parts/autoconer-v2-12.jpg"},{"en":"Tension Disc (New Type)","img":"images/parts/autoconer-v2-13.jpg"},{"en":"Reversing Device","img":"images/parts/autoconer-v2-14.jpg"},{"en":"Piston","img":"images/parts/autoconer-v2-15.jpg"},{"en":"Ball Cage Support","img":"images/parts/autoconer-v2-16.jpg"},{"en":"Cover (2)","img":"images/parts/autoconer-v2-17.jpg"},{"en":"Cone","img":"images/parts/autoconer-v2-18.jpg"},{"en":"Membrane","img":"images/parts/autoconer-v2-19.jpg"},{"en":"Drive Belt","img":"images/parts/autoconer-v2-20.jpg"},{"en":"Connecting Cable","img":"images/parts/autoconer-v2-21.jpg"},{"en":"Scissors Blade Steel","img":"images/parts/autoconer-v2-22.jpg"},{"en":"Scissors Blade Steel (RH)","img":"images/parts/autoconer-v2-23.jpg"},{"en":"Leaf Spring","img":"images/parts/autoconer-v2-24.jpg"},{"en":"Deflection Plate RH 6\"","img":"images/parts/autoconer-v2-25.jpg"},{"en":"Stator","img":"images/parts/autoconer-v2-26.jpg"},{"en":"3/2 Valve","img":"images/parts/autoconer-v2-27.jpg"}];

/* ---- Samatex (Germany) — Autocoro rotor-spinning spares (flat, image per part).
   Photos replaced 2026-07 with real product photography; no subsystem grouping
   any more (see CLAUDE.md "Product photo pipeline" / "Data-driven rendering"). */
const AUTOCORO_PARTS = [{"en":"Coupling","img":"images/parts/autocoro-v2-01.jpg"},{"en":"Gear Wheel cpl.","img":"images/parts/autocoro-v2-02.jpg"},{"en":"Condenser","img":"images/parts/autocoro-v2-03.jpg"},{"en":"Brake Shoe","img":"images/parts/autocoro-v2-04.jpg"},{"en":"Coupling Half","img":"images/parts/autocoro-v2-05.jpg"},{"en":"Adapter","img":"images/parts/autocoro-v2-06.jpg"},{"en":"Light Barrier","img":"images/parts/autocoro-v2-07.jpg"},{"en":"Suction Tube","img":"images/parts/autocoro-v2-08.jpg"},{"en":"Magnet Bush MRPS","img":"images/parts/autocoro-v2-09.jpg"},{"en":"Intake Motor","img":"images/parts/autocoro-v2-10.jpg"},{"en":"Piston (New)","img":"images/parts/autocoro-v2-11.jpg"},{"en":"Insert Yellow","img":"images/parts/autocoro-v2-12.jpg"},{"en":"Cover","img":"images/parts/autocoro-v2-13.jpg"},{"en":"Yarn Guide","img":"images/parts/autocoro-v2-14.jpg"},{"en":"Coil","img":"images/parts/autocoro-v2-15.jpg"},{"en":"Brush","img":"images/parts/autocoro-v2-16.jpg"},{"en":"Circuit Board","img":"images/parts/autocoro-v2-17.jpg"},{"en":"Cover with Piston","img":"images/parts/autocoro-v2-18.jpg"},{"en":"Cradle Cylinder","img":"images/parts/autocoro-v2-19.jpg"},{"en":"Manifold","img":"images/parts/autocoro-v2-20.jpg"},{"en":"Cradle Shock Absorber Cylinder with Magnet","img":"images/parts/autocoro-v2-21.jpg"},{"en":"Plunger","img":"images/parts/autocoro-v2-22.jpg"},{"en":"Cutter cpl.","img":"images/parts/autocoro-v2-23.jpg"},{"en":"Voltage Regulator","img":"images/parts/autocoro-v2-24.jpg"},{"en":"Adapter Plate LH","img":"images/parts/autocoro-v2-25.jpg"},{"en":"Air Filter","img":"images/parts/autocoro-v2-26.jpg"},{"en":"Cam Gear","img":"images/parts/autocoro-v2-27.jpg"},{"en":"Cleaner cpl.","img":"images/parts/autocoro-v2-28.jpg"},{"en":"Dash Pot","img":"images/parts/autocoro-v2-29.jpg"},{"en":"Detector (Plug Black)","img":"images/parts/autocoro-v2-30.jpg"},{"en":"Drive Sleeve SRK","img":"images/parts/autocoro-v2-31.jpg"},{"en":"Pressure Regulator","img":"images/parts/autocoro-v2-32.jpg"},{"en":"Holder","img":"images/parts/autocoro-v2-33.jpg"},{"en":"Housing","img":"images/parts/autocoro-v2-34.jpg"},{"en":"Main Drive Cylinder White (SRZ) Closed","img":"images/parts/autocoro-v2-35.jpg"},{"en":"Bracket","img":"images/parts/autocoro-v2-36.jpg"},{"en":"Motor","img":"images/parts/autocoro-v2-37.jpg"},{"en":"Spinning Position Cover","img":"images/parts/autocoro-v2-38.jpg"},{"en":"Stripping Roller Grey","img":"images/parts/autocoro-v2-39.jpg"},{"en":"Supporting Ring -Orange-","img":"images/parts/autocoro-v2-40.jpg"}];

/* ---- Samatex (Germany) — Ring-frame: Rieter Ring & Zinser Ring.
   Photos replaced 2026-07 with real product photography; order numbers dropped
   per the same "ignore the part number" instruction as the other two categories. */
const RIETER_PARTS = [{"en":"Carrier Bottom Part Short","img":"images/parts/rieter-v2-01.jpg"},{"en":"Carrier Bottom Part","img":"images/parts/rieter-v2-02.jpg"},{"en":"Carrier Upper Part (New Type)","img":"images/parts/rieter-v2-03.jpg"},{"en":"Clip for Outside Gripper","img":"images/parts/rieter-v2-04.jpg"},{"en":"Membrane","img":"images/parts/rieter-v2-05.jpg"},{"en":"Metal Ring Small","img":"images/parts/rieter-v2-06.jpg"},{"en":"Outside Gripper Complete","img":"images/parts/rieter-v2-07.jpg"},{"en":"Outside Gripper Small","img":"images/parts/rieter-v2-08.jpg"},{"en":"Peg Tray","img":"images/parts/rieter-v2-09.jpg"},{"en":"Bobbin Peg Blue","img":"images/parts/rieter-v2-10.jpg"},{"en":"Bobbin Peg Red","img":"images/parts/rieter-v2-11.jpg"},{"en":"Steel Belt","img":"images/parts/rieter-v2-12.jpg"},{"en":"Complete Rieter Belt","img":"images/parts/rieter-v2-13.jpg"},{"en":"Rubber Seal Black","img":"images/parts/rieter-v2-14.jpg"},{"en":"Spring","img":"images/parts/rieter-v2-15.jpg"}];

const ZINSER_PARTS = [{"en":"Cheese Head Screw","img":"images/parts/zinser-v2-01.jpg"},{"en":"Complete Outside Gripper","img":"images/parts/zinser-v2-02.jpg"},{"en":"Deflector","img":"images/parts/zinser-v2-03.jpg"},{"en":"Front Head","img":"images/parts/zinser-v2-04.jpg"},{"en":"Blue Insert","img":"images/parts/zinser-v2-05.jpg"},{"en":"Red Insert","img":"images/parts/zinser-v2-06.jpg"},{"en":"Grey Insert","img":"images/parts/zinser-v2-07.jpg"},{"en":"Purple Insert","img":"images/parts/zinser-v2-08.jpg"},{"en":"Membrane Transparent","img":"images/parts/zinser-v2-09.jpg"},{"en":"PU-Insert","img":"images/parts/zinser-v2-10.jpg"},{"en":"Piston with PU-Insert","img":"images/parts/zinser-v2-11.jpg"},{"en":"Piston","img":"images/parts/zinser-v2-12.jpg"},{"en":"Spring","img":"images/parts/zinser-v2-13.jpg"},{"en":"Rear Plate with Metal Insert","img":"images/parts/zinser-v2-14.jpg"}];

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
