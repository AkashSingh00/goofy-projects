import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to get user's geolocation
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherData(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            setError('Error getting location: ' + error.message);
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };

    // Function to fetch weather data from OpenWeatherMap
    const fetchWeatherData = async (lat, lon) => {
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        if (!apiKey) {
          setError('API key is missing. Please set REACT_APP_WEATHER_API_KEY in your environment variables.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        
        setWeather(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching weather data: ' + (error.response ? error.response.data.message : error.message));
        setLoading(false);
      }
    };

    // Start the process by getting the user's location
    getLocation();
  }, []);

  // Function to render the weather information
  const renderWeather = () => {
    if (loading) return <div className="loading">Loading weather data...</div>;
    if (error) return <div className="error">{error}</div>;
    
    if (weather) {
      const { main, weather: weatherConditions, name } = weather;
      return (
        <div className="weather-container">
          <h2 className="city-name">{name}</h2>
          <div className="temperature">
            <span className="temp-value">{Math.round(main.temp)}°C</span>
            <div className="temp-details">
              <p>Feels like: {Math.round(main.feels_like)}°C</p>
              <p>Min: {Math.round(main.temp_min)}°C | Max: {Math.round(main.temp_max)}°C</p>
            </div>
          </div>
          <div className="weather-condition">
            <img 
              src={`https://openweathermap.org/img/wn/${weatherConditions[0].icon}@2x.png`}
              alt={weatherConditions[0].description}
              className="weather-icon"
            />
            <p className="weather-description">{weatherConditions[0].description}</p>
          </div>
          <div className="weather-details">
            <p>Humidity: {main.humidity}%</p>
            <p>Pressure: {main.pressure} hPa</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Tracker</h1>
        {renderWeather()}
      </header>
    </div>
  );
}

export default App;
