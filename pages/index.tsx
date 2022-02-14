import {useDispatch, useSelector} from "react-redux"
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {AutoComplete, Button, Col, Divider, Layout, Row, Table} from "antd"
import Image from 'next/image'
import type {NextPage} from 'next'
import {
  getHelperCityResult, getImgWeatherBackground, getIsErrorCity,
  getIsLoading,
  getWeatherData,
  getWeatherSeniorData
} from "../redux/Selectors/WeatherBitSelector"
import {
  actions,
  getHelperCityThunk,
  getWeatherBitCityIntervalThunk,
  getWeatherBitCityThunk,
  getWeatherLatLonThunk
} from "../redux/WeatherBitReducer"
import {getBrowserLocation, PositionType} from "../utils/geo"
import 'antd/dist/antd.css';
import {WeatherBitCityDataType} from "./api/WeatherBitApi"
import styles from "../styles/App.module.css"

const App: NextPage = () => {

  const dispatch = useDispatch()
  const weatherSeniorData = useSelector(getWeatherSeniorData)
  const hasMounted = useRef<boolean>(false)
  const isLoading = useSelector(getIsLoading)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      //get localStorage
      const localStorageWeatherSeniorData = localStorage.getItem('WeatherSeniorData')
      if (localStorageWeatherSeniorData) {
        dispatch(actions.setWeatherSeniorData(JSON.parse(localStorageWeatherSeniorData)))
      }
      //Get/Set geoCode
      getBrowserLocation().then((curLoc: PositionType)=>{
        dispatch(getWeatherLatLonThunk(curLoc))
      }).catch((defaultLocation: PositionType) =>{
        dispatch(getWeatherLatLonThunk(defaultLocation))
      })
    } else if (weatherSeniorData?.length !== 0) {
      localStorage.setItem('WeatherSeniorData', JSON.stringify(weatherSeniorData))
    }
  }, [dispatch, weatherSeniorData])


  return (
      <div className={styles.container}>
        <WeatherBackground/>
        {!isLoading
            ?  <Layout className={styles.containerLayout}>
              <Row className={styles.containerHeader} align={"middle"}>
                <AutoCompleteGeoHelper/>
                <Col className={styles.containerPositionCenter} xl={4} md={0} sm={0} xs={0}>
                  <span>WEATHER APP</span>
                </Col>
              </Row>
              <Row justify={'space-around'} >
                <ContentWeatherInfo/>
                <ContentTable/>
              </Row>
            </Layout>
            : <Preloader />
        }
      </div>
  )
}

const Preloader: FC = () => {
  const imgLoading = `/assets/images/CapsuleLoading.svg`
  return (
      <>
        <Image layout="fill" src={imgLoading} alt="noPhoto"/>
      </>
  )
}

const AutoCompleteGeoHelper: FC = () => {

  const delay = 600000 //5 min

  const dispatch = useDispatch()

  const helperCityResult = useSelector(getHelperCityResult)
  const weatherData = useSelector(getWeatherData)
  const isErrorCity = useSelector(getIsErrorCity)

  const [helperCityName, setHelperCityName] = useState<string>('')
  const [weatherInterval, setWeatherInterval] = useState<NodeJS.Timer | null>(null)

  const handlerSearchCity = useCallback((city: string) => {
    if (city.length >= 2) dispatch(getHelperCityThunk(city))
  }, [dispatch])

  const handlerSelectCity = useCallback((city: string) => {
    dispatch(getWeatherBitCityThunk(city))
    setHelperCityName('')
  }, [dispatch])

  const handlerChangeCity = useCallback((city: string) => {
    setHelperCityName(city)
  }, [])

  const handlerClickSearch = useCallback(() => {
    dispatch(getWeatherBitCityThunk(helperCityName))
    setHelperCityName('')
  }, [dispatch, helperCityName])

  const handlerClickAutoComplete = useCallback(() => {
    dispatch(actions.setIsErrorCity(false))
  }, [dispatch])


  useEffect(() => {
    if (!weatherData){
      return
    }
    if (weatherInterval === null) {
      setWeatherInterval(setInterval(() =>
          dispatch(getWeatherBitCityIntervalThunk(weatherData.city_name)), delay)
      )
    } else {
      clearInterval(weatherInterval)
      setWeatherInterval(setInterval(() =>
          dispatch(getWeatherBitCityIntervalThunk(weatherData.city_name)), delay)
      )
    }
  }, [dispatch, weatherData])

  return (
      <>
        <Col className={styles.containerPositionEnd} xl={4} md={8} sm={8} xs={0}>
          <span>RADAR Geo Helper</span>
        </Col>
        <Col className={styles.containerPositionCenter} xl={5} md={8} sm={12} xs={16}>
          <AutoComplete
              autoFocus={true}
              value={helperCityName}
              onClick={handlerClickAutoComplete}
              className={styles.autoComplete}
              options={helperCityResult}
              onSelect={handlerSelectCity}
              onSearch={handlerSearchCity}
              onChange={handlerChangeCity}
              placeholder="Enter the name of the city"
          />
          {isErrorCity &&
              <span className={styles.errorMessage}>No city found!!</span>
          }
        </Col>
        <Col xl={11} md={4} sm={4} xs={8} >
          <Button type={"primary"} disabled={helperCityName.length === 0} onClick={handlerClickSearch}>
            Search
          </Button>
        </Col>
      </>
  )
}

const WeatherBackground : FC = () => {

  const imgServerProblem = `/assets/images/ServerProblem.jpg`

  const weatherData = useSelector(getWeatherData)
  const imgWeatherBackground = useSelector(getImgWeatherBackground)

  const ImgWeatherBackgroundMemo = useMemo(() => imgWeatherBackground.map(
      (imgWeather) => {
        if (weatherData && imgWeather.code === weatherData.weather.code ) {
          return <Image key={imgWeather.code}
                        layout="fill"
                        className={styles.backgroundImages}
                      src={imgWeather ? imgWeather.img : imgServerProblem} alt={"imgServerProblem"}/>
        } else { return null }
      }
  ), [imgServerProblem, imgWeatherBackground, weatherData])

  return (
      <>
        { weatherData
            ? ImgWeatherBackgroundMemo
            : <Image layout="fill"
                     className={styles.backgroundImages}
                     src={imgServerProblem} alt="imgServerProblem"/>}
      </>
  )
}

const ContentTable: FC = () => {

  const columns = [
    {title: 'City', dataIndex: 'city_name'},
    {title: 'Temp', dataIndex: 'temp'},
    {title: 'Date', dataIndex: 'ob_time'},
    {
      title: 'Action',
      render: (field: WeatherBitCityDataType) => (
          <Button onClick={() => handlerClickDeleteFields(field)} type={"primary"} danger>Delete</Button>
      )
    }
  ]

  const dispatch = useDispatch()

  const weatherSeniorData = useSelector(getWeatherSeniorData)

  const rowSelection = {
    onChange: useCallback((selectedRowKeys: React.Key[], selectedRows: WeatherBitCityDataType[]) => {
      dispatch(actions.setWeatherData(selectedRows[0]))
    }, [dispatch])
  }

  const handlerClickDeleteFields = useCallback((field: WeatherBitCityDataType) => {
    dispatch(actions.setDeleteWeatherSeniorData(field))
  }, [dispatch])

  return (
      <>
        { weatherSeniorData &&
            <Col xl={10} md={18} sm={22} xs={24} >
              <Divider className={styles.divider} orientation="center" >Request History</Divider>
              <Table
                  className={styles.tableStyle}
                  loading={!weatherSeniorData}
                  rowKey={record => record.key}
                  rowSelection={{
                    type: "radio",
                    ...rowSelection,
                  }}
                  pagination={{defaultPageSize: 1, pageSize: 4}}
                  columns={columns}
                  dataSource={weatherSeniorData ? weatherSeniorData : []}
              />
            </Col>
        }
      </>
  )
}

const ContentWeatherInfo: FC = () => {

  const weatherData = useSelector(getWeatherData)

  const iconWeather = `https://www.weatherbit.io/static/img/icons/${weatherData?.weather.icon}.png`
  const imgServerProblem = `/assets/images/ServerProblem.jpg`

  return (
      <>
        {weatherData && <Col xl={7} md={12} sm={22} xs={22} className={styles.containerInfo}>
          <Image width={'100'} height={'100'}
               src={weatherData.weather.icon ? iconWeather : imgServerProblem}
               alt={'imgServerProblem'}/>
          <div className={styles.contentHeader}>
            <p>{weatherData.weather.description}</p>
            <p>{weatherData.temp} °C</p>
          </div>
          <div className={styles.contentBottom}>
            <p>Last update time: {weatherData.ob_time}</p>
            <p>
              {weatherData.city_name + ' ' + weatherData.country_code + ' ' + weatherData.timezone}
            </p>
            <p>
              Pressure: {weatherData.pres} Wind direction: {weatherData.wind_dir}
            </p>
            <p>Relative humidity: {weatherData.rh}%</p>
            <p>Cloud coverage: {weatherData.clouds}%</p>
            <p>Visibility: {weatherData.vis}KM</p>
          </div>
        </Col>
        }
      </>
  )
}

export default App


//App.getInitialProps = async ({ store }) => {
 // store.dispatch(await getWeatherBitCityThunk('torun'));
//}