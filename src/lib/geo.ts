// Utilidades de geolocalización.

// Distancia en km entre dos coordenadas (fórmula de Haversine).
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // radio de la Tierra en km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface LatLng {
  lat: number;
  lng: number;
}

// Proyecta una coordenada a una posición porcentual (0-100) dentro de un
// bounding box, para posicionar marcadores en un mapa personalizado.
export function projectToPercent(
  point: LatLng,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  padding = 12,
): { x: number; y: number } {
  const latRange = bounds.maxLat - bounds.minLat || 1;
  const lngRange = bounds.maxLng - bounds.minLng || 1;
  const usable = 100 - padding * 2;
  const x = padding + ((point.lng - bounds.minLng) / lngRange) * usable;
  // y invertido: latitud mayor = arriba (y menor)
  const y = padding + ((bounds.maxLat - point.lat) / latRange) * usable;
  return { x, y };
}
