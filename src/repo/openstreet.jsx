async function fetchCoordinates(place) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.length === 0) return null;
    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
    };
}
