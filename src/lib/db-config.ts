// Detecta si DATABASE_URL apunta a una base de datos real (no al placeholder).
// Si no, las sincronizaciones con Prisma se omiten de forma segura, de modo que
// el login con Google siga funcionando (Supabase crea la cuenta en auth.users).
export const isDatabaseConfigured = (() => {
  const url = process.env.DATABASE_URL ?? "";
  return (
    Boolean(url) &&
    !url.includes("PASSWORD") &&
    !url.includes("YOUR-PROJECT") &&
    !url.includes("aws-0-region")
  );
})();
