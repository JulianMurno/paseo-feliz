import { PrismaClient, Role, BookingStatus } from "@prisma/client";

// Semilla de Paseo Feliz. Crea paseadores, dueños, mascotas, reseñas y reservas
// reales para que la app tenga datos al arrancar.  Ejecuta: npm run db:seed
const prisma = new PrismaClient();

const walkers = [
  {
    email: "carlos.walker@paseofeliz.demo",
    name: "Carlos M.",
    avatarUrl: "https://i.pravatar.cc/300?img=12",
    bio: "Educador canino con +6 años de experiencia. Me especializo en perros enérgicos que necesitan rutas largas y juego activo.",
    pricePerHour: 150,
    city: "Ciudad de México",
    neighborhood: "Condesa",
    latitude: 19.4116,
    longitude: -99.1707,
    experience: 6,
    verified: true,
    available: true,
    specialties: ["Razas grandes", "Alta energía", "Adiestramiento básico"],
  },
  {
    email: "valeria.walker@paseofeliz.demo",
    name: "Valeria S.",
    avatarUrl: "https://i.pravatar.cc/300?img=47",
    bio: "Amante de los animales y veterinaria en formación. Perfecta para perros senior o con cuidados especiales.",
    pricePerHour: 130,
    city: "Ciudad de México",
    neighborhood: "Roma Norte",
    latitude: 19.4189,
    longitude: -99.1605,
    experience: 4,
    verified: true,
    available: true,
    specialties: ["Perros senior", "Cuidados especiales", "Razas pequeñas"],
  },
  {
    email: "andres.walker@paseofeliz.demo",
    name: "Andrés P.",
    avatarUrl: "https://i.pravatar.cc/300?img=15",
    bio: "Corredor y entusiasta del aire libre. Si tu perro necesita quemar energía, soy tu paseador.",
    pricePerHour: 170,
    city: "Ciudad de México",
    neighborhood: "Polanco",
    latitude: 19.4324,
    longitude: -99.1962,
    experience: 5,
    verified: true,
    available: false,
    specialties: ["Running canino", "Alta energía", "Grupos"],
  },
  {
    email: "mariana.walker@paseofeliz.demo",
    name: "Mariana L.",
    avatarUrl: "https://i.pravatar.cc/300?img=32",
    bio: "Paciente y cariñosa, con mano izquierda para perros tímidos o rescatados. Construyo confianza paso a paso.",
    pricePerHour: 140,
    city: "Ciudad de México",
    neighborhood: "Coyoacán",
    latitude: 19.3501,
    longitude: -99.1618,
    experience: 7,
    verified: true,
    available: true,
    specialties: ["Perros tímidos", "Rescatados", "Socialización"],
  },
];

const owners = [
  {
    email: "lucia.owner@paseofeliz.demo",
    name: "Lucía Fernández",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
    pet: { name: "Toby", breed: "Labrador" },
  },
  {
    email: "diego.owner@paseofeliz.demo",
    name: "Diego Ramírez",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    pet: { name: "Rocco", breed: "Pastor Alemán" },
  },
];

async function main() {
  console.log("🌱 Sembrando datos de Paseo Feliz...");

  // --- Walkers ---
  const walkerIds: Record<string, string> = {};
  for (const w of walkers) {
    const user = await prisma.user.upsert({
      where: { email: w.email },
      update: { name: w.name, avatarUrl: w.avatarUrl, role: Role.WALKER },
      create: {
        email: w.email,
        name: w.name,
        avatarUrl: w.avatarUrl,
        role: Role.WALKER,
        walkerProfile: {
          create: {
            bio: w.bio,
            pricePerHour: w.pricePerHour,
            city: w.city,
            neighborhood: w.neighborhood,
            latitude: w.latitude,
            longitude: w.longitude,
            experience: w.experience,
            verified: w.verified,
            available: w.available,
            specialties: w.specialties,
          },
        },
      },
      include: { walkerProfile: true },
    });
    walkerIds[w.email] = user.walkerProfile!.id;
  }

  // --- Owners + mascotas ---
  const ownerIds: Record<string, string> = {};
  const petIds: Record<string, string> = {};
  for (const o of owners) {
    const user = await prisma.user.upsert({
      where: { email: o.email },
      update: { name: o.name, avatarUrl: o.avatarUrl, role: Role.OWNER },
      create: {
        email: o.email,
        name: o.name,
        avatarUrl: o.avatarUrl,
        role: Role.OWNER,
        ownerProfile: { create: { pets: { create: o.pet } } },
      },
      include: { ownerProfile: { include: { pets: true } } },
    });
    ownerIds[o.email] = user.ownerProfile!.id;
    petIds[o.email] = user.ownerProfile!.pets[0]?.id ?? "";
  }

  const lucia = ownerIds["lucia.owner@paseofeliz.demo"];
  const diego = ownerIds["diego.owner@paseofeliz.demo"];
  const carlos = walkerIds["carlos.walker@paseofeliz.demo"];
  const valeria = walkerIds["valeria.walker@paseofeliz.demo"];
  const andres = walkerIds["andres.walker@paseofeliz.demo"];

  // --- Reseñas (evita duplicar si ya existen) ---
  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    await prisma.review.createMany({
      data: [
        { ownerId: lucia, walkerId: carlos, rating: 5, comment: "Carlos es increíble. Toby vuelve feliz y cansado de cada paseo." },
        { ownerId: diego, walkerId: carlos, rating: 5, comment: "Puntual, responsable y se nota que ama a los perros." },
        { ownerId: lucia, walkerId: valeria, rating: 5, comment: "Valeria trata a mi perra como si fuera suya. ¡Recomendadísima!" },
        { ownerId: diego, walkerId: andres, rating: 5, comment: "Mi husky necesita muchísimo ejercicio y Andrés lo entiende perfecto." },
      ],
    });
  }

  // --- Reservas (solo si no hay) ---
  const bookingCount = await prisma.booking.count();
  if (bookingCount === 0) {
    await prisma.booking.createMany({
      data: [
        {
          ownerId: lucia,
          walkerId: carlos,
          petId: petIds["lucia.owner@paseofeliz.demo"],
          date: new Date(Date.now() + 1000 * 60 * 60 * 24),
          duration: 45,
          location: "Parque México, Condesa",
          notes: "Toby es muy sociable, le encanta correr.",
          status: BookingStatus.PENDING,
        },
        {
          ownerId: diego,
          walkerId: carlos,
          petId: petIds["diego.owner@paseofeliz.demo"],
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          duration: 60,
          location: "Bosque de Chapultepec",
          status: BookingStatus.COMPLETED,
        },
      ],
    });
  }

  console.log("✅ Datos sembrados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
