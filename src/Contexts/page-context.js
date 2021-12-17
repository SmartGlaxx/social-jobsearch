import React, {useEffect, useReducer} from 'react'
import  reducer  from '../Reducers/page-reducer'
import axios from 'axios'
import { UseAuthContext } from '.';
const LOADING = 'LOADING'; const MENUOPEN = 'MENUOPEN', TIMELINEPOSTS ='TIMELINEPOSTS', ALERT='ALERT'

// const getLoggedIn = ()=>{
//     let val
//     if(localStorage.getItem('LoggedIn')){
//         return val = localStorage.getItem('LoggedIn')
//     }
//     return val
// }

const AppContext = React.createContext()
const initialState = {
    loading : false,
    timelineposts : []
}

export const PageProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer, initialState)
    const {currentUser} = UseAuthContext()
    let parsedCurrentUser = JSON.parse(currentUser)
    const posturl = 'https://smart-job-search.herokuapp.com/api/v1/posts'
    
    const {_id = '', username=''} = parsedCurrentUser
   console.log(username)
    const fetchTimelinePosts = async(url)=>{
        dispatch({type : LOADING, payload : true})
        axios(url).then(result =>{
        
            const {response} = result.data
            console.log(response)
            // if(response == 'Success'){
            //     dispatch({type : LOADING, payload : false})
            //     const {data} = result.data
            //     dispatch({type : TIMELINEPOSTS, payload : data})
            // }else if(response == 'Fail'){
            //     dispatch({type : LOADING, payload : false})
            //     dispatch({type: ALERT, payload : "An error occured"})
            // }
        })
        
    }
    useEffect(()=>{
        fetchTimelinePosts(`${url}/${id}/${username}`)
    },[])

    const setCurrentUser = (value)=>{
        dispatch({type : setCurrentUser, payload : value })
    }


    return <AppContext.Provider value={{
        ...state
    }}>
    {children}
    </AppContext.Provider>
}

export const UsePageContext = ()=>{
    return React.useContext(AppContext)
}
