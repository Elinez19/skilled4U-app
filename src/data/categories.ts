export type IconFamilyType = "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";

export interface Category {
  id: string;
  title: string;
  iconName: string;
  iconFamily: IconFamilyType;
  subServices?: string[];
}

export const POPULAR_CATEGORIES: Category[] = [
  {
    id: "1",
    title: "A.C / Refrigeration Services",
    iconName: "air-conditioner",
    iconFamily: "MaterialCommunityIcons",
    subServices: [
      "A.C Gas Filling / Servicing",
      "A.C Repair or Installation",
      "Refrigerator Repair",
      "Freezer Repair",
      "Water Dispenser",
      "Cold Room Servicing"
    ]
  },
  {
    id: "2",
    title: "Carpentry / Interior Services",
    iconName: "hammer-wrench",
    iconFamily: "MaterialCommunityIcons",
    subServices: [
      "Windows and Doors",
      "Cabinetry",
      "Furniture",
      "Roofing",
      "Window Blinds Install / Repair",
      "Curtains Installation",
      "Wall Panel",
      "Flooring - Vynyl/Wood",
      "TV Mounting / Install",
      "Curtain / Blind Install",
      "Home Fittings Install"
    ]
  },
  {
    id: "3",
    title: "Plumbing Services",
    iconName: "pipe-leak",
    iconFamily: "MaterialCommunityIcons",
    subServices: [
      "Plumbing Repair/Install",
      "Drain / Leaks Fixing",
      "Pumping Machine",
      "Toilet Repairs",
      "Water Treatment / Tank Washing",
      "Borehole"
    ]
  },
  {
    id: "4",
    title: "Cleaning / Laundry / Fumigation",
    iconName: "broom",
    iconFamily: "MaterialCommunityIcons",
    subServices: [
      "Residential Cleaning",
      "Office / Janitorial Cleaning",
      "Fumigation",
      "Laundry Service",
      "Upholstery / Rug"
    ]
  },
  {
    id: "5",
    title: "Appliances Electronics",
    iconName: "television-classic",
    iconFamily: "MaterialCommunityIcons",
    subServices: [
      "Washing Machine",
      "Blender / Air Fryer",
      "Exercise Equipment",
      "Gas / Electric Cooker",
      "Microwave",
      "TV - Repair / Mounting",
      "Fan",
      "Home Theater",
      "Remote Gate Control"
    ]
  },
  {
    id: "6",
    title: "Electrical Services",
    iconName: "lightning-bolt-outline",
    iconFamily: "MaterialCommunityIcons",
    subServices: [
      "Wiring and Rewiring",
      "Lighting Installation",
      "Generator Repair",
      "Inverter Installation"
    ]
  }
];

export const ALL_CATEGORIES: Category[] = [
  { id: "all_1", title: "A.C / Refrigeration Services", iconName: "person", iconFamily: "Ionicons", subServices: [
      "A.C Gas Filling / Servicing",
      "A.C Repair or Installation",
      "Refrigerator Repair",
      "Freezer Repair",
      "Water Dispenser",
      "Cold Room Servicing"
  ] },
  { id: "all_2", title: "Aluminum/Glass", iconName: "person", iconFamily: "Ionicons", subServices: ["Window Installation", "Glass Repair"] },
  { id: "all_3", title: "Appliances Electronics", iconName: "person", iconFamily: "Ionicons", subServices: [
      "Washing Machine",
      "Blender / Air Fryer",
      "Exercise Equipment",
      "Gas / Electric Cooker",
      "Microwave",
      "TV - Repair / Mounting",
      "Fan",
      "Home Theater",
      "Remote Gate Control"
  ] },
  { id: "all_4", title: "AUTO Services", iconName: "person", iconFamily: "Ionicons", subServices: ["Mechanic", "Car Wash", "Towing"] },
  { id: "all_5", title: "Barber / Barbing Service", iconName: "person", iconFamily: "Ionicons", subServices: ["Haircut", "Beard Trim"] },
  { id: "all_6", title: "Beauty Services", iconName: "person", iconFamily: "Ionicons", subServices: ["Manicure", "Pedicure", "Facial"] },
  { id: "all_7", title: "Brick Layer / Tiller / POP", iconName: "person", iconFamily: "Ionicons", subServices: ["Brick Laying", "Tiling", "POP Ceiling"] },
  { id: "all_8", title: "Carpentry / Interior Services", iconName: "person", iconFamily: "Ionicons", subServices: [
      "Windows and Doors",
      "Cabinetry",
      "Furniture",
      "Roofing",
      "Window Blinds Install / Repair",
      "Curtains Installation",
      "Wall Panel",
      "Flooring - Vynyl/Wood",
      "TV Mounting / Install",
      "Curtain / Blind Install",
      "Home Fittings Install"
  ] },
  { id: "all_9", title: "Catering Services", iconName: "person", iconFamily: "Ionicons", subServices: ["Event Catering", "Meal Prep"] },
  { id: "all_10", title: "Haulage / Movers", iconName: "person", iconFamily: "Ionicons", subServices: ["Home Relocation", "Office Moving"] },
  { id: "all_11", title: "Make-Up Artist", iconName: "person", iconFamily: "Ionicons" },
  { id: "all_12", title: "Painter/Screeder/Wallpaper", iconName: "person", iconFamily: "Ionicons" },
  { id: "all_13", title: "Phone/Laptop/Printers", iconName: "person", iconFamily: "Ionicons" },
  { id: "all_14", title: "Photographer/Video", iconName: "person", iconFamily: "Ionicons" },
  { id: "all_15", title: "Plumbing Services", iconName: "person", iconFamily: "Ionicons" },
  { id: "all_16", title: "Testing - Official Use", iconName: "person", iconFamily: "Ionicons" },
  { id: "all_17", title: "Vehicle Towing", iconName: "person", iconFamily: "Ionicons" },
  { id: "all_18", title: "Welder Service", iconName: "person", iconFamily: "Ionicons" },
];
