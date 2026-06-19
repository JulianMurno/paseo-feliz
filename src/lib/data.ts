import type { PricingPlan, Service, Walker } from "./types";

// ----------------------------------------------------------------------------
// Datos de ejemplo (modo demo). La app funciona sin base de datos usando esto.
// Cuando Supabase/Prisma estén configurados, reemplaza estas funciones por
// consultas reales (ver src/lib/walkers.ts).
// ----------------------------------------------------------------------------

export const services: Service[] = [
  {
    icon: "dog",
    title: "Paseo individual",
    description:
      "Atención exclusiva para tu perro, a su ritmo y con rutas seguras pensadas para él.",
  },
  {
    icon: "paw",
    title: "Socialización en grupo",
    description:
      "Paseos en grupos pequeños para que tu perro juegue y socialice de forma supervisada.",
  },
  {
    icon: "bolt",
    title: "Paseo exprés 20 min",
    description:
      "Una salida rápida para hacer sus necesidades cuando andas con poco tiempo.",
  },
  {
    icon: "location-dot",
    title: "Rastreo GPS en vivo",
    description:
      "Sigue la ubicación de tu paseador en tiempo real durante todo el recorrido.",
  },
  {
    icon: "heart",
    title: "Cuidado senior",
    description:
      "Paseos tranquilos y con cuidados especiales para perros mayores o con necesidades.",
  },
  {
    icon: "camera",
    title: "Fotos y videos",
    description:
      "Recibe actualizaciones con fotos y videos del paseo directamente en tu móvil.",
  },
];

export const walkers: Walker[] = [
  {
    id: "carlos-m",
    name: "Carlos M.",
    avatarUrl: "https://i.pravatar.cc/300?img=12",
    bio: "Educador canino con +6 años de experiencia. Me especializo en perros enérgicos que necesitan rutas largas y juego activo. ¡Tu peludo estará en las mejores manos!",
    city: "Ciudad de México",
    neighborhood: "Condesa",
    pricePerHour: 150,
    experience: 6,
    verified: true,
    available: true,
    specialties: ["Razas grandes", "Alta energía", "Adiestramiento básico"],
    latitude: 19.4116,
    longitude: -99.1707,
    rating: 4.9,
    reviews: [
      {
        id: "r1",
        authorName: "Lucía Fernández",
        authorAvatar: "https://i.pravatar.cc/150?img=45",
        dogName: "Toby",
        dogBreed: "Labrador",
        rating: 5,
        comment:
          "Carlos es increíble. Toby vuelve feliz y cansado de cada paseo. El rastreo GPS me da muchísima tranquilidad.",
        createdAt: "2026-05-28T10:00:00Z",
      },
      {
        id: "r2",
        authorName: "Diego Ramírez",
        authorAvatar: "https://i.pravatar.cc/150?img=33",
        dogName: "Rocco",
        dogBreed: "Pastor Alemán",
        rating: 5,
        comment:
          "Puntual, responsable y se nota que ama a los perros. Lo recomiendo al 100%.",
        createdAt: "2026-05-15T16:30:00Z",
      },
    ],
  },
  {
    id: "valeria-s",
    name: "Valeria S.",
    avatarUrl: "https://i.pravatar.cc/300?img=47",
    bio: "Amante de los animales y veterinaria en formación. Cuido cada detalle: hidratación, descanso y mucho cariño. Perfecta para perros senior o con cuidados especiales.",
    city: "Ciudad de México",
    neighborhood: "Roma Norte",
    pricePerHour: 130,
    experience: 4,
    verified: true,
    available: true,
    specialties: ["Perros senior", "Cuidados especiales", "Razas pequeñas"],
    latitude: 19.4189,
    longitude: -99.1605,
    rating: 5.0,
    reviews: [
      {
        id: "r3",
        authorName: "Ana Torres",
        authorAvatar: "https://i.pravatar.cc/150?img=20",
        dogName: "Luna",
        dogBreed: "Chihuahua",
        rating: 5,
        comment:
          "Valeria trata a Luna como si fuera suya. Sus fotos del paseo me alegran el día.",
        createdAt: "2026-06-01T09:00:00Z",
      },
    ],
  },
  {
    id: "andres-p",
    name: "Andrés P.",
    avatarUrl: "https://i.pravatar.cc/300?img=15",
    bio: "Corredor y entusiasta del aire libre. Si tu perro necesita quemar energía, soy tu paseador. Rutas por parques y áreas verdes seguras.",
    city: "Ciudad de México",
    neighborhood: "Polanco",
    pricePerHour: 170,
    experience: 5,
    verified: true,
    available: false,
    specialties: ["Running canino", "Alta energía", "Grupos"],
    latitude: 19.4324,
    longitude: -99.1962,
    rating: 4.8,
    reviews: [
      {
        id: "r4",
        authorName: "Pablo Méndez",
        authorAvatar: "https://i.pravatar.cc/150?img=51",
        dogName: "Max",
        dogBreed: "Husky",
        rating: 5,
        comment:
          "Max necesita muchísimo ejercicio y Andrés lo entiende perfecto. Excelente servicio.",
        createdAt: "2026-05-20T18:00:00Z",
      },
      {
        id: "r5",
        authorName: "Sofía Castro",
        authorAvatar: "https://i.pravatar.cc/150?img=24",
        dogName: "Nala",
        dogBreed: "Border Collie",
        rating: 4,
        comment: "Muy buen paseador, solo a veces difícil de agendar por lo solicitado que está.",
        createdAt: "2026-04-30T12:00:00Z",
      },
    ],
  },
  {
    id: "mariana-l",
    name: "Mariana L.",
    avatarUrl: "https://i.pravatar.cc/300?img=32",
    bio: "Paciente, cariñosa y con mano izquierda para perros tímidos o rescatados. Construyo confianza paso a paso para que el paseo sea un momento feliz.",
    city: "Ciudad de México",
    neighborhood: "Coyoacán",
    pricePerHour: 140,
    experience: 7,
    verified: true,
    available: true,
    specialties: ["Perros tímidos", "Rescatados", "Socialización"],
    latitude: 19.3501,
    longitude: -99.1618,
    rating: 4.7,
    reviews: [
      {
        id: "r6",
        authorName: "Jorge Núñez",
        authorAvatar: "https://i.pravatar.cc/150?img=60",
        dogName: "Canela",
        dogBreed: "Mestizo",
        rating: 5,
        comment:
          "Canela es rescatada y muy miedosa. Mariana logró que confiara en ella. Eternamente agradecido.",
        createdAt: "2026-06-05T11:00:00Z",
      },
    ],
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "single",
    name: "Paseo Único",
    price: 150,
    period: "por paseo",
    description: "Ideal para probar el servicio o necesidades puntuales.",
    features: [
      "1 paseo de 45 minutos",
      "Rastreo GPS en vivo",
      "Reporte con fotos",
      "Paseador verificado",
    ],
    cta: "Reservar paseo",
  },
  {
    id: "weekly",
    name: "Plan Semanal",
    price: 500,
    period: "por semana",
    featured: true,
    description: "La opción favorita de los dueños. Rutina y precio justo.",
    features: [
      "5 paseos de 45 minutos",
      "Rastreo GPS en vivo",
      "Reporte con fotos y videos",
      "Paseador fijo asignado",
      "Soporte prioritario",
    ],
    cta: "Empezar ahora",
  },
  {
    id: "monthly",
    name: "Plan Mensual",
    price: 1800,
    period: "por mes",
    description: "Máximo ahorro para quienes pasean a diario.",
    features: [
      "20 paseos de 45 minutos",
      "Rastreo GPS en vivo",
      "Reporte con fotos y videos",
      "Paseador fijo asignado",
      "Cuidado de fin de semana",
      "Soporte prioritario 24/7",
    ],
    cta: "Contratar plan",
  },
];

// Helpers de acceso a "datos" (demo). Reemplazables por consultas a Prisma.
export function getWalkers(): Walker[] {
  return walkers;
}

export function getWalkerById(id: string): Walker | undefined {
  return walkers.find((w) => w.id === id);
}

export function getFeaturedWalkers(limit = 4): Walker[] {
  return [...walkers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
