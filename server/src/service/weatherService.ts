import dotenv from "dotenv";
import { describe } from "node:test";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longtitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: number;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: number,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=37ab3ec0ec74398d6cdf0f844c038c7b`
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const res = await fetch(query);
    const data = await res.json();
    return data;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(data: any): Coordinates {
    const lat = data[0].lat;
    const lon = data[0].lon;

    return {
      latitude: lat,
      longtitude: lon
    }
  }


  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `http://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longtitude}&appid=37ab3ec0ec74398d6cdf0f844c038c7b`
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(query: string): Promise<any> {
    const res = await fetch(query);
    const data = await res.json();
    return data.list;
  }



  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(weatherData: any, city: string) {
    return weatherData.map((item: any) => {
      return {
        city: city,
        date: item.dt_txt,
        icon: item.weather[0].icon,
        iconDescription: item.weather[0].description,
        tempF: item.main.temp,
        windSpeed: item.wind.speed,
        humidity: item.main.humdity,
      };
    });
  }

  // TODO: Complete buildForecastArray method

   private buildForecastArray(currentWeather: Weather, weatherData: any[], city: string) {
    const fiveDayForecast = weatherData.filter((data: any) => data.dt_txt.includes("06:00")).map((item: any) => ({
        city: city,
        // date: new Date(item.dt *1000),
        date: item.dt_txt,
        icon: item.weather[0].icon,
        iconDescription: item.weather[0].description,
        tempF: item.main.temp,
        windSpeed: item.wind.speed,
        humidity: item.main.humdity,
      
    }));

    return [currentWeather, ...fiveDayForecast ];

   }
   
   
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    // fetch call to convert cityName to lat and lon coordinates
    const query1 = this.buildGeocodeQuery(city);
    const data1 = await this.fetchLocationData(query1);
    const coordinates = this.destructureLocationData(data1)

    // fetch weatherdata according to lon and lat coordinates
    const query2 = this.buildWeatherQuery(coordinates)
    const data2 = await this.fetchWeatherData(query2);
    console.log(data2);
    const weatherData = data2;


    // parse the weatherdata to fit the requirements in the client
    const parsedWeatherData = this.parseCurrentWeather(weatherData, city)

    const fiveDayForecast = await this.buildForecastArray(parsedWeatherData[0], weatherData, city)

    // return the final output
    return fiveDayForecast;
  }
  // async getWeatherForCity(city: string) {
  //   // fetch call to convert cityName to lat and lon coordinates
  // return fetch(
  //   `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=37ab3ec0ec74398d6cdf0f844c038c7b`
  // )
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log(data);
  //     const lat = data[0].lat;
  //     const lon = data[0].lon;

  //     return fetch(
  //       `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=37ab3ec0ec74398d6cdf0f844c038c7b`
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);

  //         const weatherData = data.list;

  //         // city, date, icon, iconDescription, tempF, windSpeed, humidity

  //         const parsedWeatherData = weatherData.map((item: any) => {
  //           return {
  //             city: city,
  //             date: item.dt_txt,
  //             icon: item.weather[0].icon,
  //             iconDescription: item.weather[0].description,
  //             tempF: item.main.temp,
  //             windSpeed: item.wind.speed ,
  //             humidity: item.main.humdity
  //           }
  //         })

  //         return parsedWeatherData;

  //       })

  //     })
  // }
}

export default new WeatherService();
