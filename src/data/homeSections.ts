import { images } from "../constants/images";

export const PRODUCT_DEALS = [
  {
    id: "1",
    title: "Plumbing Fixes",
    discount: "20% OFF",
    price: "$40",
    image: images.onboardingPlumber,
  },
  {
    id: "2",
    title: "Deep Cleaning",
    discount: "15% OFF",
    price: "$60",
    image: images.onboardingCleaner,
  },
];

export const SPECIAL_PROMOS = [
  {
    id: "1",
    title: "Weekend Promo",
    description: "Get 30% off your first 3 bookings",
    color: "#00B7FF",
  },
  {
    id: "2",
    title: "Refer a Friend",
    description: "Earn $10 for every friend you refer",
    color: "#f59e0b",
  }
];

export const TRENDING_PRODUCTS = [
  {
    id: "1",
    title: "AC Installation",
    category: "Refrigeration",
    rating: "4.8",
    reviews: "120",
    image: images.onboardingPainter, // placeholder
  },
  {
    id: "2",
    title: "Home Painting",
    category: "Interior",
    rating: "4.9",
    reviews: "85",
    image: images.onboardingPainter,
  }
];

export const ELITE_PROVIDERS = [
  {
    id: "1",
    name: "John Doe",
    specialty: "Master Plumber",
    rating: "5.0",
    reviews: "240",
    image: images.onboardingPlumber,
  },
  {
    id: "2",
    name: "Jane Smith",
    specialty: "Pro Cleaner",
    rating: "4.9",
    reviews: "180",
    image: images.onboardingCleaner,
  }
];
