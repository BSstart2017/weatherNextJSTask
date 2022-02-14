import { Action, applyMiddleware, combineReducers, compose, createStore } from "redux"
import thunkMiddleware, { ThunkAction } from "redux-thunk"
import WeatherBitReducer from "./WeatherBitReducer";

let rootReducer = combineReducers({
    WeatherBitReducer
})

type RootReducerType = typeof rootReducer
export type AppStateType = ReturnType<RootReducerType>

export type InferActionType<T> = T extends {[key : string]: (...arg: any[])=> infer U} ? U : never
export type BaseThunkType<A extends Action, P = Promise<void>> = ThunkAction<P, AppStateType, unknown, A>

export default createStore(rootReducer, compose(applyMiddleware(thunkMiddleware)))
