export const getWeather = async (lat, lng) => {
    try {
        // Assignment Requirement: Integrate ONE external public API
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
        );

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.current_weather) {
            throw new Error("No weather data available");
        }

        return {
            temperature: data.current_weather.temperature,
            condition: getWeatherDescription(data.current_weather.weathercode),
            code: data.current_weather.weathercode
        };
    } catch (error) {
        console.error("Error fetching weather:", error);
        return null; // Return null to handle empty state in UI
    }
};

const getWeatherDescription = (code) => {
    // WMO Weather interpretation codes
    // 0: Clear, 1-3: Cloudy, 45,48: Fog, 51-55: Drizzle, 61-65: Rain, 71-77: Snow, etc.
    if (code === 0) return "Clear sky";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Variable";
};
