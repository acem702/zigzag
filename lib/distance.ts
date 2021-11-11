// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

export function getPrettyDistance(
  lat1: number | null | undefined,
  lon1: number | null | undefined,
  lat2: number | null | undefined,
  lon2: number | null | undefined
) {
  if (lat1 && lon1 && lat2 && lon2) {
    const distanceInKm = distance(lat1, lon1, lat2, lon2);
    const distanceInMi = distanceInKm / 1.609;

    return distanceInMi < 1 ? 'Nearby' : `~${Math.round(distanceInMi)} mi`;
  } else {
    return '';
  }

}
