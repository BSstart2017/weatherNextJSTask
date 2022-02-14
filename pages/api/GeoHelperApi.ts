import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_GEO_HELPER_API_KEY

export const instance = axios.create({
    baseURL: `http://geohelper.info/api/v1/`,
})

const geoHelperApi = {
  getHelperCity(city:string) {
    return instance
      .get<HelperCityType>(`cities?apiKey=${API_KEY}&locale[lang]=en&filter[name]=${city}&pagination[limit]=20`)
      .then((response) => response.data)
  },
}

export default geoHelperApi

export type HelperCityType = {
    language: string
    pagination: HelperCityPaginationType
    result: Array<HelperCityResultType>
    success: boolean
}

type HelperCityPaginationType = {
    limit: number
    totalCount: number
    currentPage: number
    totalPageCount: number
}

type HelperCityResultType = {
    area: string
    externalIds: HelperCityExternalIdsType
    id: number
    localizedNames: helperCityLocalizedNamesType
    name: string
    regionId: number
}
type HelperCityExternalIdsType = {
    geonames: string
}

type helperCityLocalizedNamesType = {
    en: string
}