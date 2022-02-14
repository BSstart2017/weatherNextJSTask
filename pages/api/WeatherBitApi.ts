import axios from "axios"
import { v1 as uu1 } from 'uuid'
import {PositionType} from "../../utils/geo"

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_BIT_API_KEY

export const instance = axios.create({
    baseURL: `https://api.weatherbit.io/v2.0/current`,
})


const weatherBitApi = {
  getWeatherCity(city:string) {
    return instance
      .get<WeatherBitCityType>(`?key=${API_KEY}&city=${city}`)
      .then((response) =>({...response.data.data[0], key:uu1()}) )
  },
    getWeatherLatLon(curLoc:PositionType) {
        return instance
            .get<WeatherBitCityType>(`?key=${API_KEY}&lat=${curLoc.lat}&lon=${curLoc.lng}`)
            .then((response) =>({...response.data.data[0], key:uu1()}) )
    },
}

export default weatherBitApi


export type WeatherBitCityType = {
    count: number
    data: Array<WeatherBitCityDataType>
}

export type WeatherBitCityDataType = {
    key: string
    app_temp: number
    aqi: number
    city_name: string
    clouds: number
    country_code: string
    datetime: string
    dewpt: number
    dhi: number
    dni: number
    elev_angle: number
    ghi: number
    h_angle: number
    lat: number
    lon: number
    ob_time: string
    pod: string
    precip: number
    pres: number
    rh: number
    slp: number
    snow: number
    solar_rad: number
    state_code: string
    station: string
    sunrise: string
    sunset: string
    temp: number
    timezone: string
    ts: number
    uv: number
    vis: number
    weather: WeatherType
    wind_cdir: string
    wind_cdir_full: string
    wind_dir: number
    wind_spd: number
}

type WeatherType = {
    icon: string
    code: number
    description: string
}