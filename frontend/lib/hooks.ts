import { useDispatch, useSelector, useStore } from 'react-redux'
import { type RootState, type AppDispatch, type AppStore, makeStore } from './store'
const { store } = makeStore();


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = typeof store;