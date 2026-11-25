from datetime import datetime
from backend.app.providers.air_quality.base import BaseAirQualityProvider
from backend.app.schemas.air_quality import (
    CurrentAirQuality, 
    PollutantConcentrations, 
    WeatherContext,
    AirQualityForecastResponse,
    HourlyForecastItem,
    DailyForecastItem
)

class MockAirQualityProvider(BaseAirQualityProvider):
    name: str = "Calibrated Sensor Station Simulator"
    is_live: bool = False
    rate_limit_per_minute: int = 1000
    documentation_url: str = "https://cpcb.nic.in/air-quality-standards/"
    licensing: str = "Synthetic Reference Architecture"

    CITY_PRESETS = {
        "delhi": {
            "name": "Delhi NCR",
            "sub_area": "Anand Vihar & South Ext",
            "aqi": 284,
            "risk_level": "severe",
            "primary": "pm25",
            "pm25": 198.4,
            "pm10": 312.0,
            "no2": 84.5,
            "o3": 38.2,
            "co": 2.8,
            "so2": 18.3,
            "temp": 24.0,
            "humidity": 68.0,
            "wind_speed": 4.8,
            "condition": "Atmospheric Haze & Calm Winds"
        },
        "london": {
            "name": "London",
            "sub_area": "Marylebone Road / Southwark",
            "aqi": 68,
            "risk_level": "moderate",
            "primary": "no2",
            "pm25": 14.2,
            "pm10": 24.1,
            "no2": 56.4,
            "o3": 42.0,
            "co": 0.6,
            "so2": 5.1,
            "temp": 15.0,
            "humidity": 78.0,
            "wind_speed": 16.2,
            "condition": "Overcast roadside vehicle flux"
        },
        "newyork": {
            "name": "New York City",
            "sub_area": "Midtown Manhattan & Queens",
            "aqi": 45,
            "risk_level": "low",
            "primary": "o3",
            "pm25": 8.5,
            "pm10": 16.0,
            "no2": 21.0,
            "o3": 38.0,
            "co": 0.4,
            "so2": 3.2,
            "temp": 19.0,
            "humidity": 55.0,
            "wind_speed": 11.4,
            "condition": "Clear sky, high dispersion"
        },
        "tokyo": {
            "name": "Tokyo",
            "sub_area": "Shinjuku & Shibuya basin",
            "aqi": 32,
            "risk_level": "low",
            "primary": "pm25",
            "pm25": 6.8,
            "pm10": 12.2,
            "no2": 18.0,
            "o3": 26.0,
            "co": 0.3,
            "so2": 2.1,
            "temp": 17.0,
            "humidity": 52.0,
            "wind_speed": 8.5,
            "condition": "Clean maritime airflow"
        },
        "jakarta": {
            "name": "Jakarta",
            "sub_area": "Central Jakarta & Rawamangun",
            "aqi": 168,
            "risk_level": "high",
            "primary": "pm25",
            "pm25": 88.5,
            "pm10": 142.0,
            "no2": 48.0,
            "o3": 45.0,
            "co": 1.6,
            "so2": 12.0,
            "temp": 31.0,
            "humidity": 82.0,
            "wind_speed": 6.0,
            "condition": "Thermal boundary trapping"
        }
    }

    async def get_current(self, lat: float, lon: float, location_name: str, standard: str = "IN_NAAQS") -> CurrentAirQuality:
        # Match location preset or default to Delhi
        key = "delhi"
        loc_lower = location_name.lower()
        for k in self.CITY_PRESETS:
            if k in loc_lower or self.CITY_PRESETS[k]["name"].lower() in loc_lower:
                key = k
                break
                
        preset = self.CITY_PRESETS[key]

        return CurrentAirQuality(
            aqi=preset["aqi"],
            standard=standard,
            risk_level=preset["risk_level"],
            primary_pollutant=preset["primary"],
            pollutants=PollutantConcentrations(
                pm25=preset["pm25"],
                pm10=preset["pm10"],
                no2=preset["no2"],
                o3=preset["o3"],
                co=preset["co"],
                so2=preset["so2"]
            ),
            weather=WeatherContext(
                temperature=preset["temp"],
                humidity=preset["humidity"],
                wind_speed=preset["wind_speed"],
                wind_direction="NW (Inversion Layer)",
                condition=preset["condition"],
                uv_index=4.0
            ),
            timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC (Calibrated Ground Model)"),
            location_name=preset["name"],
            sub_area=preset["sub_area"],
            latitude=lat,
            longitude=lon,
            confidence_score=94,
            active_sensors=14,
            outdoor_recommendation=(
                "Avoid strenuous outdoor activities; shift workouts indoors and wear certified N95 for road commutes."
                if preset["risk_level"] == "severe" else
                "Moderate air quality. Sensitive individuals should avoid prolonged exposure along heavily trafficked arterial corridors."
            ),
            health_advisory="Micro-fine particulates can penetrate deep alveolar tissue. Maintain indoor filtered air.",
            data_source="Calibrated Ground Sensor Synthetic Mesh",
            is_demo=True
        )

    async def get_forecast(self, lat: float, lon: float, location_name: str, standard: str = "IN_NAAQS") -> AirQualityForecastResponse:
        key = "delhi"
        loc_lower = location_name.lower()
        for k in self.CITY_PRESETS:
            if k in loc_lower:
                key = k
                break
        base_aqi = self.CITY_PRESETS[key]["aqi"]
        scale = base_aqi / 284.0

        hourly = [
            HourlyForecastItem(hour="06:00", aqi=int(310 * scale), risk_level="severe", pm25=220 * scale, wind_speed=2.1, label="Morning Inversion Peak"),
            HourlyForecastItem(hour="08:00", aqi=int(284 * scale), risk_level="severe", pm25=198 * scale, wind_speed=3.5, label="Morning Commute"),
            HourlyForecastItem(hour="10:00", aqi=int(235 * scale), risk_level="high", pm25=160 * scale, wind_speed=5.2, label="Solar Heating Lift"),
            HourlyForecastItem(hour="12:00", aqi=int(185 * scale), risk_level="high", pm25=110 * scale, wind_speed=7.8, label="Midday Dispersion"),
            HourlyForecastItem(hour="14:00", aqi=int(145 * scale), risk_level="moderate", pm25=75 * scale, wind_speed=8.5, label="Best Aeration Window"),
            HourlyForecastItem(hour="16:00", aqi=int(172 * scale), risk_level="moderate", pm25=92 * scale, wind_speed=6.1, label="Pre-Rush Rebound"),
            HourlyForecastItem(hour="18:00", aqi=int(248 * scale), risk_level="high", pm25=168 * scale, wind_speed=3.8, label="Evening Traffic Spike"),
            HourlyForecastItem(hour="20:00", aqi=int(295 * scale), risk_level="severe", pm25=210 * scale, wind_speed=2.4, label="Nocturnal Boundary Drop"),
            HourlyForecastItem(hour="22:00", aqi=int(320 * scale), risk_level="severe", pm25=235 * scale, wind_speed=1.8, label="Overnight Stagnation")
        ]

        daily = [
            DailyForecastItem(day="Today (Observed)", avg_aqi=int(245 * scale), peak_aqi=int(320 * scale), risk_level="severe", dominant_condition="Trapped fine particulates & low wind"),
            DailyForecastItem(day="Tomorrow", avg_aqi=int(210 * scale), peak_aqi=int(275 * scale), risk_level="high", dominant_condition="Slight westerly breeze in late afternoon"),
            DailyForecastItem(day="Day 3", avg_aqi=int(165 * scale), peak_aqi=int(215 * scale), risk_level="high", dominant_condition="Reduced industrial & commercial transit"),
            DailyForecastItem(day="Day 4", avg_aqi=int(230 * scale), peak_aqi=int(290 * scale), risk_level="severe", dominant_condition="Weekday commute surge"),
            DailyForecastItem(day="Day 5", avg_aqi=int(190 * scale), peak_aqi=int(240 * scale), risk_level="high", dominant_condition="Passing cloud cover with slight turbulent mixing")
        ]

        return AirQualityForecastResponse(
            location_name=location_name,
            standard=standard,
            hourly=hourly,
            daily=daily
        )
