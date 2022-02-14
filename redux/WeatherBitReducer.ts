import {BaseThunkType, InferActionType} from "./store"
import weatherBitApi, {WeatherBitCityDataType} from "../pages/api/WeatherBitApi"
import geoHelperApi, {HelperCityType} from "../pages/api/GeoHelperApi"
import {PositionType} from "../utils/geo"


let defaultState = {
    weatherData : null as null | WeatherBitCityDataType,
    weatherSeniorData : null as null | Array<WeatherBitCityDataType>,
    imgWeatherBackground : [
        {code: 200, img: `/assets/images/ThunderstormWithLightRain.jpg` },
        {code: 201, img: `/assets/images/ThunderstormWithLightRain.jpg` },
        {code: 202, img: `/assets/images/ThunderstormWithLightRain.jpg` },
        {code: 230, img: `/assets/images/ThunderstormWithLightRain.jpg` },
        {code: 231, img: `/assets/images/ThunderstormWithLightRain.jpg` },
        {code: 232, img: `/assets/images/ThunderstormWithLightRain.jpg` },
        {code: 233, img: `/assets/images/ThunderstormWithLightRain.jpg` },
        {code: 300, img: `/assets/images/LightDrizzle.jpg` },
        {code: 301, img: `/assets/images/LightDrizzle.jpg` },
        {code: 302, img: `/assets/images/LightDrizzle.jpg` },
        {code: 500, img: `/assets/images/LightRain.jpg` },
        {code: 501, img: `/assets/images/LightRain.jpg` },
        {code: 502, img: `/assets/images/LightRain.jpg` },
        {code: 511, img: `/assets/images/LightRain.jpg` },
        {code: 520, img: `/assets/images/ShowerRain.jpg` },
        {code: 521, img: `/assets/images/ShowerRain.jpg` },
        {code: 522, img: `/assets/images/ShowerRain.jpg` },
        {code: 600, img: `/assets/images/ShowerRain.jpg` },
        {code: 601, img: `/assets/images/ShowerRain.jpg` },
        {code: 602, img: `/assets/images/HeavySnow.jpg` },
        {code: 610, img: `/assets/images/HeavySnow.jpg` },
        {code: 611, img: `/assets/images/HeavySnow.jpg` },
        {code: 612, img: `/assets/images/HeavySnow.jpg` },
        {code: 621, img: `/assets/images/HeavySnow.jpg` },
        {code: 622, img: `/assets/images/HeavySnow.jpg` },
        {code: 623, img: `/assets/images/HeavySnow.jpg` },
        {code: 700, img: `/assets/images/Fog.jpg` },
        {code: 711, img: `/assets/images/Fog.jpg` },
        {code: 721, img: `/assets/images/Fog.jpg` },
        {code: 731, img: `/assets/images/Fog.jpg` },
        {code: 741, img: `/assets/images/Fog.jpg` },
        {code: 751, img: `/assets/images/Fog.jpg` },
        {code: 800, img: `/assets/images/CleareSky.jpg` },
        {code: 801, img: `/assets/images/BrokenClouds.jpg` },
        {code: 802, img: `/assets/images/BrokenClouds.jpg` },
        {code: 803, img: `/assets/images/BrokenClouds.jpg` },
        {code: 804, img: `/assets/images/BrokenClouds.jpg` },
        {code: 900, img: `/assets/images/ShowerRain.jpg` },
    ] as Array<imgWeatherBackgroundType>,
    helperCityData : null as null | HelperCityType,
    isLoading : false,
    isErrorCity : false
}

const weatherBitReducer = (state = defaultState, action: ActionType) : DefaultStateType => {
  switch (action.type){
    case "weatherBit/Aliaksandr_Andreyeu/WEATHER_BIT_SUCCESS":
      return {
          ...state,
          weatherData: action.data
      }
      case "weatherBit/Aliaksandr_Andreyeu/WEATHER_BIT_SENIOR_SUCCESS":
      return {
          ...state,
          weatherSeniorData: state.weatherSeniorData ? [...action.data, ...state.weatherSeniorData] : action.data
      }
      case "weatherBit/Aliaksandr_Andreyeu/WEATHER_BIT_SENIOR_DELETE_SUCCESS":
          return {
              ...state,
              weatherSeniorData: state.weatherSeniorData
                  ? [...state.weatherSeniorData.filter((item)=> item.key !== action.data.key)]
                  : []
          }
    case "weatherBit/Aliaksandr_Andreyeu/HELPER_CITY_SUCCESS":
      return {
          ...state,
          helperCityData: action.data
      }
      case "weatherBit/Aliaksandr_Andreyeu/IS_LOADING_SUCCESS":
          return {
              ...state,
              isLoading: action.isLoading
          }
      case "weatherBit/Aliaksandr_Andreyeu/IS_ERROR_CITY_SUCCESS":
          return {
              ...state,
              isErrorCity: action.isErrorCity
          }
    default:
      return state
  }
}

export const actions = {
   setWeatherData: (data: WeatherBitCityDataType) => (
       {type : 'weatherBit/Aliaksandr_Andreyeu/WEATHER_BIT_SUCCESS', data} as const
   ),
   setWeatherSeniorData: (data: Array<WeatherBitCityDataType>) => (
       {type : 'weatherBit/Aliaksandr_Andreyeu/WEATHER_BIT_SENIOR_SUCCESS', data} as const
   ),
   setHelperCityData: (data: HelperCityType) => (
       {type : 'weatherBit/Aliaksandr_Andreyeu/HELPER_CITY_SUCCESS', data} as const
   ),
    setDeleteWeatherSeniorData: (data: WeatherBitCityDataType) => (
        {type : 'weatherBit/Aliaksandr_Andreyeu/WEATHER_BIT_SENIOR_DELETE_SUCCESS', data} as const
    ),
    setIsLoading: (isLoading: boolean) => (
        {type : 'weatherBit/Aliaksandr_Andreyeu/IS_LOADING_SUCCESS', isLoading} as const
    ),
    setIsErrorCity: (isErrorCity: boolean) => (
        {type : 'weatherBit/Aliaksandr_Andreyeu/IS_ERROR_CITY_SUCCESS', isErrorCity} as const
    )
}

export const getWeatherBitCityThunk = (city: string): ThunkType => async (dispatch) => {
    try {
        const response = await weatherBitApi.getWeatherCity(city)
        dispatch(actions.setWeatherData(response))
        dispatch(actions.setWeatherSeniorData([response]))
    } catch (err: any) {
        console.log(err)
        dispatch(actions.setIsErrorCity(true))
    }
}

export const getWeatherBitCityIntervalThunk = (city: string): ThunkType => async (dispatch) => {
    try {
        const response = await weatherBitApi.getWeatherCity(city)
        dispatch(actions.setWeatherData(response))
    } catch (err: any) {
        console.log(err)
    }
}


export const getWeatherLatLonThunk = (curLoc: PositionType): ThunkType => async (dispatch) => {
    try {
        dispatch(actions.setIsLoading(true))
        const response = await weatherBitApi.getWeatherLatLon(curLoc)
        dispatch(actions.setWeatherData(response))
        dispatch(actions.setWeatherSeniorData([response]))
    } catch (err: any) {
        console.log(err)
    } finally {
        dispatch(actions.setIsLoading(false))
    }
}

export const getHelperCityThunk = (city:string): ThunkType => async (dispatch, getState) => {
    try {
        const response = await geoHelperApi.getHelperCity(city)
        console.log(response)
        dispatch(actions.setHelperCityData(response))
    } catch (err: any) {
        console.log(err)
    }
}

export default weatherBitReducer

export type DefaultStateType = typeof defaultState
type ActionType = InferActionType<typeof actions>
type ThunkType = BaseThunkType<ActionType>

export type imgWeatherBackgroundType = {
    code: number
    img: string
}