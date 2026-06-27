// Tipos compartidos de Paseo Feliz (alineados con el esquema de Prisma)

export type Role = "OWNER" | "WALKER";

export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  dogName?: string;
  dogBreed?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO
}

export interface Walker {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  city: string;
  neighborhood: string;
  pricePerHour: number;
  experience: number; // años
  verified: boolean;
  available: boolean;
  specialties: string[];
  latitude: number;
  longitude: number;
  rating: number; // promedio
  reviews: Review[];
}

// Vista de una reserva tal como la consumen los componentes (datos ya unidos).
export interface BookingView {
  id: string;
  walkerId: string;
  walkerName: string;
  walkerAvatar: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  petName: string;
  petBreed: string;
  date: string; // ISO
  duration: number; // minutos
  location: string;
  notes?: string;
  status: BookingStatus;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  featured?: boolean;
  description: string;
  features: string[];
  cta: string;
}

export interface Service {
  icon: string; // nombre de icono FontAwesome (solid)
  title: string;
  description: string;
}
