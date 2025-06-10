
export async function fetchWeatherData(lat, lon, startDate, endDate) {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,precipitation_sum,relative_humidity_2m_mean,shortwave_radiation_sum&timezone=auto`;

    const res = await fetch(url);
    const json = await res.json();

    const { time, temperature_2m_max, precipitation_sum, relative_humidity_2m_mean, shortwave_radiation_sum } = json.daily;

    return time.map((date, index) => ({
        date,
        temperature: temperature_2m_max[index],
        precipitation: precipitation_sum[index],
        humidity: relative_humidity_2m_mean[index],
        radiation: shortwave_radiation_sum[index],
    }));
}
