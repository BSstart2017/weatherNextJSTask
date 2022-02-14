import weatherBitApi, {WeatherBitCityDataType} from "../../pages/api/WeatherBitApi";
import geoHelperApi, {HelperCityType} from "../../pages/api/GeoHelperApi";
import weatherBitReducer, {
    actions,
    DefaultStateType, getHelperCityThunk, getWeatherBitCityIntervalThunk,
    getWeatherBitCityThunk, getWeatherLatLonThunk,
    imgWeatherBackgroundType
} from "../WeatherBitReducer";
/*
jest.mock('../../api/WeatherBitApi')
jest.mock('../../api/GeoHelperApi')

const weatherBitApiMock = weatherBitApi as jest.Mocked<typeof weatherBitApi>
const geoHelperApiMock = geoHelperApi as jest.Mocked<typeof geoHelperApi>

const dispatchMock = jest.fn()
const getStateMock = jest.fn()

let defaultState = {
    weatherData: null as null | WeatherBitCityDataType,
    weatherSeniorData: null as null | Array<WeatherBitCityDataType>,
    imgWeatherBackground: [
        {code: 200, img: `${process.env.PUBLIC_URL}/assets/images/ThunderstormWithLightRain.jpg`}
    ] as Array<imgWeatherBackgroundType>,
    helperCityData: null as null | HelperCityType,
    isLoading: false,
    isErrorCity: false
} as DefaultStateType

const weatherData = {
    app_temp: -0.4,
    aqi: 63,
    city_name: "Toruń",
    clouds: 0,
    country_code: "PL",
    datetime: "2022-02-13:14",
    dewpt: -2.1,
    dhi: 63.46,
    dni: 568.93,
    elev_angle: 13.16,
    ghi: 184.98,
    h_angle: 54,
    key: "71a683a0-8cda-11ec-bc03-455dfdac8c9f",
    lat: 53.01375,
    lon: 18.59814,
    ob_time: "2022-02-13 14:22",
    pod: "d",
    precip: 0,
    pres: 1011.44,
    rh: 65.7411,
    slp: 1018.35,
    snow: 0,
    solar_rad: 185,
    state_code: "73",
    station: "AV104",
    sunrise: "06:06",
    sunset: "15:54",
    temp: 3.6,
    timezone: "Europe/Warsaw",
    ts: 1644762138,
    uv: 2.77101,
    vis: 5,
    weather: {icon: "c01d", code: 800, description: "Clear sky"},
    wind_cdir: "SSW",
    wind_cdir_full: "south-southwest",
    wind_dir: 194,
    wind_spd: 2.96245,
}
const cityHelperData = {
    language: "en",
    pagination: {limit: 20, totalCount: 6, currentPage: 1, totalPageCount: 1},
    result: [{
        area: "Flintshire",
        externalIds: {geonames: '12265214'},
        id: 530169,
        localizedNames: {en: 'Berth-ddu'},
        name: "Berth-ddu",
        regionId: 88
    }, {
        area: "Wrexham",
        externalIds: {geonames: '12264011'},
        id: 530382,
        localizedNames: {en: 'Ddol'},
        name: "Ddol",
        regionId: 88,
    }],
    success: true,
}

describe('weatherBitReducer actions', () => {
    it('weatherBitReducer actions.setIsLoading', () => {
        let action = actions.setIsLoading(true)
        let newState = weatherBitReducer(defaultState, action)
        expect(newState.isLoading).toBe(true)
    })
    it('weatherBitReducer actions.isErrorCity', () => {
        let action = actions.setIsErrorCity(true)
        let newState = weatherBitReducer(defaultState, action)
        expect(newState.isErrorCity).toBe(true)
    })
    it('weatherBitReducer actions.setWeatherData', () => {
         let action = actions.setWeatherData(weatherData)
         let newState = weatherBitReducer(defaultState,action)
         expect(newState.weatherData?.weather.code).toBe(800)
    })
    it('weatherBitReducer actions.setWeatherSeniorData and setDeleteWeatherSeniorData', () => {
        //weatherData === null
         let action = actions.setWeatherSeniorData([weatherData])
         let newState = weatherBitReducer(defaultState,action)
         expect(newState.weatherSeniorData?.[0].weather?.code).toBe(800)
        //weatherData !== null
        let actionWeather = actions.setWeatherSeniorData([weatherData])
        let newStateWeather = weatherBitReducer(newState,actionWeather)
        expect(newStateWeather.weatherSeniorData?.length).toBe(2)
        //delete weatherData !== null
        let actionDelete = actions.setDeleteWeatherSeniorData(weatherData)
        let newStateDelete = weatherBitReducer(newState,actionDelete)
        expect(newStateDelete.weatherSeniorData?.length).toBe(0)
        //delete weatherData === null
        let actionDeleteNull = actions.setDeleteWeatherSeniorData(weatherData)
        let newStateDeleteNull = weatherBitReducer(defaultState,actionDeleteNull)
        expect(newStateDeleteNull.weatherSeniorData?.length).toBe(0)
    })
    it('weatherBitReducer actions.setHelperCityData', () => {
        let action = actions.setHelperCityData(cityHelperData)
        let newState = weatherBitReducer(defaultState,action)
        expect(newState.helperCityData?.result[0].id).toBe(530169)
    })
})

describe ('weatherBitReducer thunk', ()=>{
    describe('weatherBitReducer getWeatherBitCityThunk', ()=>{
        const thunk = getWeatherBitCityThunk('torun')
        it('weatherBitReducer getWeatherBitCityThunk success', async () =>{
            weatherBitApiMock.getWeatherCity.mockReturnValue(Promise.resolve(weatherData))
            await thunk(dispatchMock, getStateMock, {})
            expect(dispatchMock).toBeCalledTimes(2)
            expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.setWeatherData(weatherData))
            expect(dispatchMock).toHaveBeenNthCalledWith(2, actions.setWeatherSeniorData([weatherData]))
        })
        it('weatherBitReducer getWeatherBitCityThunk error', async () =>{
            weatherBitApiMock.getWeatherCity.mockReturnValue(Promise.reject({error: 'Error'}))
            await thunk(dispatchMock, getStateMock, {})
            expect(dispatchMock).toBeCalledTimes(1)
            expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.setIsErrorCity(true))
        })
    })
    describe('weatherBitReducer getWeatherBitCityIntervalThunk', ()=>{
        const thunk = getWeatherBitCityIntervalThunk('torun')
        it('weatherBitReducer getWeatherBitCityIntervalThunk success', async () =>{
            weatherBitApiMock.getWeatherCity.mockReturnValue(Promise.resolve(weatherData))
            await thunk(dispatchMock, getStateMock, {})
            expect(dispatchMock).toBeCalledTimes(1)
            expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.setWeatherData(weatherData))
        })
        it('weatherBitReducer getWeatherBitCityIntervalThunk error', async () =>{
            weatherBitApiMock.getWeatherCity.mockReturnValue(Promise.reject({error: 'Error'}))
            await thunk(dispatchMock, getStateMock, {})
            expect(dispatchMock).toBeCalledTimes(0)
        })
    })
    describe('weatherBitReducer getWeatherLatLonThunk', ()=>{
        const thunk = getWeatherLatLonThunk({lat:25, lng:25})
        it('weatherBitReducer getWeatherLatLonThunk success', async () =>{
            weatherBitApiMock.getWeatherLatLon.mockReturnValue(Promise.resolve(weatherData))
            await thunk(dispatchMock, getStateMock, {})
            expect(dispatchMock).toBeCalledTimes(4)
            expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.setIsLoading(true))
            expect(dispatchMock).toHaveBeenNthCalledWith(2, actions.setWeatherData(weatherData))
            expect(dispatchMock).toHaveBeenNthCalledWith(3,actions.setWeatherSeniorData([weatherData]))
            expect(dispatchMock).toHaveBeenNthCalledWith(4, actions.setIsLoading(false))
        })
        it('weatherBitReducer getWeatherLatLonThunk error', async () =>{
            weatherBitApiMock.getWeatherLatLon.mockReturnValue(Promise.reject({error: 'Error'}))
            await thunk(dispatchMock, getStateMock, {})
            expect(dispatchMock).toBeCalledTimes(2)
            expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.setIsLoading(true))
            expect(dispatchMock).toHaveBeenNthCalledWith(2, actions.setIsLoading(false))
        })
    })
    describe('weatherBitReducer getHelperCityThunk', ()=>{
        const thunk = getHelperCityThunk('Torun')
        it('weatherBitReducer getHelperCityThunk success', async () =>{
            geoHelperApiMock.getHelperCity.mockReturnValue(Promise.resolve(cityHelperData))
            await thunk(dispatchMock, getStateMock, {})
            expect(dispatchMock).toBeCalledTimes(1)
            expect(dispatchMock).toHaveBeenNthCalledWith(1, actions.setHelperCityData(cityHelperData))
        })
        it('weatherBitReducer getHelperCityThunk error', async () =>{
            geoHelperApiMock.getHelperCity.mockReturnValue(Promise.reject({error: 'Error'}))
            await thunk(dispatchMock, getStateMock, {})
            expect(dispatchMock).toBeCalledTimes(0)
        })
    })
})

*/
