import { PrismaClient, Role } from "@prisma/client";

// Semilla de ejemplo para poblar la base de datos de Supabase.
// Ejecuta con: npm run db:seed
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando datos de Paseo Feliz...");

  // Walker de ejemplo
  const walkerUser = await prisma.user.upsert({
    where: { email: "carlos.walker@paseofeliz.demo" },
    update: {},
    create: {
      email: "carlos.walker@paseofeliz.demo",
      name: "Carlos M.",
      avatarUrl: "https://i.pravatar.cc/300?img=12",
      role: Role.WALKER,
      walkerProfile: {
        create: {
          bio: "Educador canino con +6 años de experiencia.",
          pricePerHour: 150,
          city: "Ciudad de México",
          latitude: 19.4116,
          longitude: -99.1707,
          experience: 6,
          verified: true,
          available: true,
          specialties: ["Razas grandes", "Alta energía"],
        },
      },
    },
    include: { walkerProfile: true },
  });

  // Owner de ejemplo con mascota
  const ownerUser = await prisma.user.upsert({
    where: { email: "lucia.owner@paseofeliz.demo" },
    update: {},
    create: {
      email: "lucia.owner@paseofeliz.demo",
      name: "Lucía Fernández",
      avatarUrl: "https://i.pravatar.cc/150?img=45",
      role: Role.OWNER,
      ownerProfile: {
        create: {
          pets: { create: { name: "Toby", breed: "Labrador" } },
        },
      },
    },
    include: { ownerProfile: { include: { pets: true } } },
  });

  const ownerId = ownerUser.ownerProfile!.id;
  const walkerId = walkerUser.walkerProfile!.id;
  const petId = ownerUser.ownerProfile!.pets[0]?.id;

  // Reseña de ejemplo
  await prisma.review.create({
    data: {
      ownerId,
      walkerId,
      rating: 5,
      comment: "Carlos es increíble. Toby vuelve feliz de cada paseo.",
    },
  });

  // Booking de ejemplo
  await prisma.booking.create({
    data: {
      ownerId,
      walkerId,
      petId,
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      duration: 45,
      location: "Parque México, Condesa",
      notes: "Toby es muy sociable, le encanta correr.",
    },
  });

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
