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

export interface OnboardingServiceItem {
  id: string;
  title: string;
  iconName: string;
  iconFamily: IconFamilyType;
}

export const CUSTOMER_ONBOARDING_SERVICES: OnboardingServiceItem[] = [
  { id: "plumbing", title: "Plumbing", iconName: "pipe-valve", iconFamily: "MaterialCommunityIcons" },
  { id: "electrical", title: "Electrical", iconName: "flash-outline", iconFamily: "Ionicons" },
  { id: "carpentry", title: "Carpentry", iconName: "hammer-outline", iconFamily: "Ionicons" },
  { id: "tailoring", title: "Tailoring &\nFashion", iconName: "shirt-outline", iconFamily: "Ionicons" },
  { id: "painting", title: "Painting", iconName: "format-paint", iconFamily: "MaterialCommunityIcons" },
  { id: "home_repair", title: "Home Repair", iconName: "build-outline", iconFamily: "Ionicons" },
  { id: "beauty", title: "Beauty &\nWellness", iconName: "sparkles-outline", iconFamily: "Ionicons" },
  { id: "cleaning", title: "Cleaning", iconName: "broom", iconFamily: "MaterialCommunityIcons" },
  { id: "welding", title: "Welding &\nFabrication", iconName: "flame-outline", iconFamily: "Ionicons" },
  { id: "more", title: "More", iconName: "ellipsis-horizontal", iconFamily: "Ionicons" },
];

export const ARTISAN_CRAFT_CATEGORIES: OnboardingServiceItem[] = [
  { id: "plumber", title: "Plumber", iconName: "pipe-leak", iconFamily: "MaterialCommunityIcons" },
  { id: "electrician", title: "Electrician", iconName: "flash-outline", iconFamily: "Ionicons" },
  { id: "carpenter", title: "Carpenter", iconName: "build-outline", iconFamily: "Ionicons" },
  { id: "painter", title: "Painter", iconName: "format-paint", iconFamily: "MaterialCommunityIcons" },
  { id: "mason", title: "Mason", iconName: "wall", iconFamily: "MaterialCommunityIcons" },
  { id: "ac_technician", title: "AC Technician", iconName: "air-conditioner", iconFamily: "MaterialCommunityIcons" },
  { id: "welder", title: "Welder", iconName: "flame-outline", iconFamily: "Ionicons" },
  { id: "tiler", title: "Tiler", iconName: "grid-outline", iconFamily: "Ionicons" },
  { id: "other", title: "Other", iconName: "ellipsis-horizontal", iconFamily: "Ionicons" },
];

export const ARTISAN_SKILLS_OPTIONS: OnboardingServiceItem[] = [
  { id: "plumbing", title: "Plumbing", iconName: "water-outline", iconFamily: "Ionicons" },
  { id: "pipe_fitting", title: "Pipe Fitting", iconName: "git-commit-outline", iconFamily: "Ionicons" },
  { id: "leak_repair", title: "Leak Repair", iconName: "shield-checkmark-outline", iconFamily: "Ionicons" },
  { id: "installation", title: "Installation", iconName: "construct-outline", iconFamily: "Ionicons" },
  { id: "maintenance", title: "Maintenance", iconName: "settings-outline", iconFamily: "Ionicons" },
  { id: "other", title: "Other", iconName: "briefcase-outline", iconFamily: "Ionicons" },
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  { label: "Less than 1 year", value: "0-1" },
  { label: "1 - 3 years", value: "1-3" },
  { label: "3 - 5 years", value: "3-5" },
  { label: "5 - 10 years", value: "5-10" },
  { label: "10+ years", value: "10+" },
];

export const SERVICE_RADIUS_OPTIONS = [
  { label: "2 km", value: "2 km" },
  { label: "5 km", value: "5 km" },
  { label: "10 km", value: "10 km" },
  { label: "15 km", value: "15 km" },
  { label: "25 km", value: "25 km" },
  { label: "50 km", value: "50 km" },
];
