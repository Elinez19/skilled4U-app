import { ImageSourcePropType } from "react-native";
import { images } from "../constants/images";

export interface Artisan {
  id: string;
  name: string;
  trade: string;
  rating: number;
  reviews: number;
  distance: string;
  categoryId: string;
  serviceKey: string;
  profileImage: string;
  avatarSource: ImageSourcePropType;
  isOnline: boolean;
  hourlyRate: string;
  about: string;
  skills: string[];
  recentWork: ImageSourcePropType[];
  latOffset: number;
  lonOffset: number;
}

export interface ArtisanJobRequest {
  id: string;
  title: string;
  distance: string;
  serviceType: string;
  budget: string;
  budgetNumeric: number;
  postedAgo: string;
  image: ImageSourcePropType;
  detailImage: ImageSourcePropType;
  description: string;
  client: {
    name: string;
    rating: number;
    reviews: number;
    avatar: ImageSourcePropType;
  };
  requirements: string[];
}

export const ARTISANS: Artisan[] = [
  {
    id: "emeka-okafor",
    name: "Emeka Okafor",
    trade: "Plumber",
    rating: 4.8,
    reviews: 124,
    distance: "2.3 km",
    categoryId: "all_15",
    serviceKey: "plumbing",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    avatarSource: images.artisanEmeka,
    isOnline: true,
    hourlyRate: "₦15,000",
    about:
      "Professional plumber with 8+ years of experience in residential and commercial plumbing. Fast, reliable and affordable services.",
    skills: ["Leak Repair", "Pipe Installation", "Drain Cleaning", "Water Heater"],
    recentWork: [images.featuredSinkPipes, images.plumberWork1, images.jobSinkRepair],
    latOffset: 0.0038,
    lonOffset: -0.0042,
  },
  {
    id: "aisha-yusuf",
    name: "Aisha Yusuf",
    trade: "Electrician",
    rating: 4.7,
    reviews: 98,
    distance: "1.8 km",
    categoryId: "all_1",
    serviceKey: "electrical",
    profileImage: "https://randomuser.me/api/portraits/men/44.jpg",
    avatarSource: images.artisanAisha,
    isOnline: true,
    hourlyRate: "₦12,000",
    about:
      "Certified residential & commercial electrician with 6+ years experience in wiring, ceiling fans, inverter setup, and fault finding.",
    skills: ["Wiring Repair", "Ceiling Fans", "Inverter Setup", "Circuit Breakers"],
    recentWork: [images.electricianWork1, images.acRepairWork, images.plumberWork2],
    latOffset: 0.0046,
    lonOffset: 0.0039,
  },
  {
    id: "tunde-bello",
    name: "Tunde Bello",
    trade: "Carpenter",
    rating: 4.9,
    reviews: 156,
    distance: "3.1 km",
    categoryId: "all_8",
    serviceKey: "carpentry",
    profileImage: "https://randomuser.me/api/portraits/men/60.jpg",
    avatarSource: images.artisanTunde,
    isOnline: true,
    hourlyRate: "₦20,000",
    about:
      "Master carpenter & interior woodworker specializing in custom kitchen cabinets, doors, wardrobes, and precision furniture repairs.",
    skills: ["Cabinetry", "Door Fitting", "Furniture Repair", "Wood Flooring"],
    recentWork: [images.carpenterWork1, images.onboardingPainter, images.plumberWork1],
    latOffset: -0.0035,
    lonOffset: 0.0048,
  },
  {
    id: "samson-adekunle",
    name: "Samson Adekunle",
    trade: "AC Technician",
    rating: 4.8,
    reviews: 84,
    distance: "2.6 km",
    categoryId: "all_1",
    serviceKey: "home_repair",
    profileImage: "https://randomuser.me/api/portraits/men/62.jpg",
    avatarSource: images.acRepairWork,
    isOnline: true,
    hourlyRate: "₦14,000",
    about:
      "HVAC & split-unit AC specialist providing gas refilling, compressor servicing, and noiseless indoor unit installations.",
    skills: ["AC Gas Filling", "Split Unit Install", "Coil Servicing", "Thermostat Fix"],
    recentWork: [images.acRepairWork, images.electricianWork1, images.featuredSinkPipes],
    latOffset: -0.0028,
    lonOffset: -0.0051,
  },
  {
    id: "ngozi-okafor",
    name: "Ngozi Okafor",
    trade: "Home Cleaner",
    rating: 4.9,
    reviews: 112,
    distance: "1.5 km",
    categoryId: "all_4",
    serviceKey: "cleaning",
    profileImage: "https://randomuser.me/api/portraits/women/64.jpg",
    avatarSource: images.onboardingCleaner,
    isOnline: true,
    hourlyRate: "₦10,000",
    about:
      "Thorough residential and post-construction cleaning specialist using eco-friendly products for spotless homes and offices.",
    skills: ["Deep Cleaning", "Post-Construction", "Upholstery", "Fumigation"],
    recentWork: [images.onboardingCleaner, images.plumberWork2, images.carpenterWork1],
    latOffset: 0.0014,
    lonOffset: 0.0012,
  },
];

export const ARTISAN_JOB_REQUESTS: ArtisanJobRequest[] = [
  {
    id: "job-1",
    title: "Fix leaking kitchen sink",
    distance: "2.3 km",
    serviceType: "Home Service",
    budget: "₦15,000",
    budgetNumeric: 15000,
    postedAgo: "2 hrs ago",
    image: images.featuredSinkPipes,
    detailImage: images.jobSinkRepair,
    description:
      "Kitchen sink is leaking. Need a reliable plumber to fix it. Preferably available today or tomorrow.",
    client: {
      name: "Aisha Bello",
      rating: 4.8,
      reviews: 12,
      avatar: images.onboardingCleaner,
    },
    requirements: [
      "Basic plumbing tools",
      "Experience with kitchen sinks",
      "Clean and professional",
    ],
  },
  {
    id: "job-2",
    title: "Install ceiling fan",
    distance: "1.8 km",
    serviceType: "Home Service",
    budget: "₦12,000",
    budgetNumeric: 12000,
    postedAgo: "3 hrs ago",
    image: images.acRepairWork,
    detailImage: images.acRepairWork,
    description:
      "Need an experienced technician to mount and wire a new 3-blade ceiling fan in the living room.",
    client: {
      name: "John Musa",
      rating: 4.9,
      reviews: 19,
      avatar: images.artisanTunde,
    },
    requirements: [
      "Electrical test kit & step ladder",
      "Experience with ceiling fan balancing",
      "Clean and safe wiring",
    ],
  },
  {
    id: "job-3",
    title: "Electrical wiring repair",
    distance: "3.1 km",
    serviceType: "Home Service",
    budget: "₦18,000",
    budgetNumeric: 18000,
    postedAgo: "4 hrs ago",
    image: images.electricianWork1,
    detailImage: images.electricianWork1,
    description:
      "Kitchen wall socket circuit keeps tripping the distribution board breaker. Need fault diagnosis and repair.",
    client: {
      name: "Grace Uche",
      rating: 4.7,
      reviews: 8,
      avatar: images.plumberWork2,
    },
    requirements: [
      "Digital multimeter & insulated tools",
      "Circuit breaker troubleshooting",
      "Safety certified electrician",
    ],
  },
  {
    id: "job-4",
    title: "Bathroom tile repair",
    distance: "2.7 km",
    serviceType: "Home Service",
    budget: "₦20,000",
    budgetNumeric: 20000,
    postedAgo: "5 hrs ago",
    image: images.onboardingPlumber,
    detailImage: images.onboardingPlumber,
    description:
      "Replace 6 cracked floor tiles in the main bathroom and apply waterproof grouting around the shower drain.",
    client: {
      name: "Tunde Adeyemi",
      rating: 5.0,
      reviews: 24,
      avatar: images.artisanAisha,
    },
    requirements: [
      "Tile cutter & waterproof grout",
      "Neat level finishing",
      "Punctual arrival",
    ],
  },
];
