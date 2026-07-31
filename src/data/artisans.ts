export interface Artisan {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  categoryId: string; 
  profileImage: string; 
  isOnline: boolean;
}

export const ARTISANS: Artisan[] = [
  {
    id: "a1",
    name: "Ojubi Sunday",
    rating: 5,
    reviews: 120,
    categoryId: "all_1", 
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    isOnline: true,
  },
  {
    id: "a2",
    name: "Ibrahim Garba kabiru",
    rating: 0,
    reviews: 0,
    categoryId: "all_1",
    profileImage: "https://randomuser.me/api/portraits/men/44.jpg",
    isOnline: true,
  },
  {
    id: "a3",
    name: "Felix Oyuhu",
    rating: 0,
    reviews: 0,
    categoryId: "all_1",
    profileImage: "https://randomuser.me/api/portraits/men/60.jpg",
    isOnline: false,
  },
  {
    id: "a4",
    name: "Samson Cleaner",
    rating: 4.5,
    reviews: 50,
    categoryId: "all_4", // Just some dummy mapping
    profileImage: "https://randomuser.me/api/portraits/men/62.jpg",
    isOnline: true,
  },
  {
    id: "a5",
    name: "Jason Cleaner",
    rating: 3.5,
    reviews: 50,
    categoryId: "all_5", // Just some dummy mapping
    profileImage: "https://randomuser.me/api/portraits/men/64.jpg",
    isOnline: true,
  },
  
];
