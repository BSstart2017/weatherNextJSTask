import { AppStateType } from "../store"
import {createSelector} from "reselect";
import {HelperCityType} from "../../pages/api/GeoHelperApi";

export const getWeatherData = (state: AppStateType) => state.WeatherBitReducer.weatherData
export const getImgWeatherBackground = (state: AppStateType) => state.WeatherBitReducer.imgWeatherBackground
export const getHelperCityData = (state: AppStateType) => state.WeatherBitReducer.helperCityData
export const getWeatherSeniorData = (state: AppStateType) => state.WeatherBitReducer.weatherSeniorData
export const getIsLoading = (state: AppStateType) => state.WeatherBitReducer.isLoading
export const getIsErrorCity = (state: AppStateType) => state.WeatherBitReducer.isErrorCity


export const getHelperCityResult = createSelector(getHelperCityData, (
    helperCityDat : HelperCityType
) : Array<HelperCityResultType> | undefined =>{
    if (helperCityDat){
        return  [...helperCityDat.result.map((result) =>( result.name ) )]
            .filter((item, index, array)=> array.indexOf(item) === index)
            .map(item=>({value: item, label: item}))
    }
})

export type HelperCityResultType = {
    value: string
    label: string
}
