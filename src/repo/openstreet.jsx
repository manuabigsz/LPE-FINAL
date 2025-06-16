export async function fetchCoordinates(place) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
    const res = await fetch(url);
    const results = await res.json();
    return results.length > 0 ? results[0] : null;
}
