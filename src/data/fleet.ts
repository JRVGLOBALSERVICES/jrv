export interface FleetCar {
  id: string;
  name: string;
  price: number;
  type: string;
  seats: number;
  transmission: string;
  fuel: string;
  year: string;
  deposit: string;
  mileage: string;
  delivery: string;
  features: string[];
  description: string;
  img: string;
  model?: string;
}

const FLEET: FleetCar[] = [
  {
    id: "perodua-axia-g1",
    name: "Perodua Axia G1",
    price: 110,
    type: "Hatchback",
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    year: "2022",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["Reverse Camera", "Bluetooth", "Keyless Entry", "Fuel Efficient"],
    description: "The Perodua Axia G1 is our most popular economy car. Perfect for city driving with excellent fuel efficiency and a compact design that makes parking a breeze. Ideal for daily commutes and short trips around Seremban.",
    img: "/images/perodua-axia.png",
    model: "/models/renault-clio.glb",
  },
  {
    id: "perodua-axia-g2",
    name: "Perodua Axia G2",
    price: 120,
    type: "Hatchback",
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    year: "2024",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["Reverse Camera", "Apple CarPlay", "Keyless Entry", "LED Headlights", "Fuel Efficient"],
    description: "The newer G2 variant of the Axia brings modern features like Apple CarPlay and LED headlights while maintaining the exceptional fuel economy you expect from Malaysia's favourite hatchback.",
    img: "/images/car-hatchback.png",
    model: "/models/car-low-poly.glb",
  },
  {
    id: "proton-exora",
    name: "Proton Exora",
    price: 170,
    type: "MPV · 7 seats",
    seats: 7,
    transmission: "Auto",
    fuel: "Petrol",
    year: "2023",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["7 Seats", "Air Conditioning", "Bluetooth", "USB Charging", "Large Boot"],
    description: "The Proton Exora is our go-to family MPV. With 7 seats and a spacious interior, it's perfect for family outings, airport transfers, and group trips. Comfortable and practical for every journey.",
    img: "/images/proton-exora.png",
    model: "/models/car-low-poly.glb",
  },
  {
    id: "proton-x50",
    name: "Proton X50",
    price: 250,
    type: "SUV",
    seats: 5,
    transmission: "Auto (DCT)",
    fuel: "Petrol",
    year: "2024",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["Panoramic Roof", "Reverse Camera", "Apple CarPlay", "Digital Dashboard", "Lane Assist", "Keyless Entry"],
    description: "The Proton X50 is a stylish compact SUV that delivers on both looks and performance. Packed with modern tech and safety features, it's our most booked car for weekend getaways.",
    img: "/images/proton-x50.png",
    model: "/models/proton-x50.glb",
  },
  {
    id: "toyota-vios",
    name: "Toyota Vios",
    price: 170,
    type: "Sedan",
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    year: "2023",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["Power Windows", "Bluetooth", "Keyless Entry", "LED Lights", "Large Boot"],
    description: "The Toyota Vios is a reliable and comfortable sedan with a spacious boot. An excellent choice for business trips and longer journeys where comfort matters.",
    img: "/images/toyota-vios.png",
    model: "/models/audi-sedan.glb",
  },
  {
    id: "toyota-yaris",
    name: "Toyota Yaris",
    price: 161,
    type: "Hatchback",
    seats: 5,
    transmission: "Auto",
    fuel: "Petrol",
    year: "2023",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["Paddle Shifters", "Sport Mode", "Bluetooth", "Keyless Entry", "LED Lights"],
    description: "The Toyota Yaris offers a sporty driving experience in a compact package. With paddle shifters and sport mode, it's the fun choice for drivers who enjoy the road.",
    img: "/images/car-hatchback.png",
    model: "/models/bmw-m3.glb",
  },
  {
    id: "honda-city-rs",
    name: "Honda City RS",
    price: 170,
    type: "Hybrid · Sedan",
    seats: 5,
    transmission: "Auto (eCVT)",
    fuel: "Petrol Hybrid",
    year: "2024",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["Hybrid Engine", "Paddle Shifters", "LED Lights", "Digital Cluster", "Honda Sensing"],
    description: "The Honda City RS combines hybrid efficiency with sporty RS styling. The eCVT transmission delivers a smooth, fuel-saving drive without compromising on performance.",
    img: "/images/honda-city.png",
    model: "/models/volvo-sedan.glb",
  },
  {
    id: "mitsubishi-xpander",
    name: "Mitsubishi Xpander",
    price: 350,
    type: "MPV",
    seats: 7,
    transmission: "Auto",
    fuel: "Petrol",
    year: "2024",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["7 Seats", "Touchscreen", "Reverse Camera", "Climate Control", "Keyless Entry"],
    description: "The Mitsubishi Xpander is a rugged 7-seater MPV designed for Malaysian roads. Tall seating position, spacious cabin, and confident handling make it perfect for family adventures.",
    img: "/images/car-suv.png",
    model: "/models/car-low-poly.glb",
  },
  {
    id: "toyota-alphard",
    name: "Toyota Alphard",
    price: 700,
    type: "Luxury MPV",
    seats: 7,
    transmission: "Auto",
    fuel: "Petrol",
    year: "2024",
    deposit: "Zero",
    mileage: "Unlimited",
    delivery: "Free (Seremban)",
    features: ["Captain Seats", "Power Doors", "Sunroof", "Rear Entertainment", "Premium Sound", "Leather Seats"],
    description: "The Toyota Alphard is the ultimate luxury MPV. With captain seats, power doors, and premium entertainment, it's the choice for VIP airport transfers and executive travel.",
    img: "/images/car-luxury.png",
    model: "/models/audi-sedan.glb",
  },
];

export function getFleet(): FleetCar[] {
  return FLEET;
}

export function getCarBySlug(slug: string): FleetCar | undefined {
  return FLEET.find((c) => c.id === slug);
}

export function getSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
