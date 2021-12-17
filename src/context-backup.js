import React, {useEffect, useReducer} from 'react'
import  reducer  from '../Reducers/auth-reducer'

import axios from 'axios'


const AppContext = React.createContext()


const InitialState = {
    loading : false,
    loggedIn : false,
    registered : false,
    currentUser : {},
    verified : false
}
export const AppProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer, InitialState)

    // useEffect(()=>{
    //     dispatch({type: "LOADING"})
    // },[])

    return <AppContext.Provider value={{
        ...state
    }}>
    {children}
    </AppContext.Provider>
}

export const UseContext = ()=>{
    return React.useContext(AppContext)
}