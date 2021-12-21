import React, {useEffect, useReducer} from 'react'
import  reducer  from '../Reducers/app-reducer'
import Axios from 'axios'
import { useParams } from 'react-router-dom'
const CURRENTUSER = "CURRENTUSER"; const LOGGEDIN = 'LOGGEDIN' ; 
const LOADING = 'LOADING'; const MENUOPEN = 'MENUOPEN', TIMELINEPOSTS ='TIMELINEPOSTS', 
ALERT='ALERT'; const ALLUSERS = "ALLUSERS"; const TEMPALLUSERS = 'TEMPALLUSERS';
const SETCUSERFOLLOWINGS = "SETCUSERFOLLOWINGS"; const SETNEWTEMPUSER = 'SETNEWTEMPUSER'
const POSTCREATED = 'POSTCREATED'; const SETSIDEBAR = 'SETSIDEBAR' ; const USERCLICKED = 'USERCLICKED';
const SETFETCHEDUSER = 'SETFETCHEDUSER'; const COMMENTSENT = 'COMMENTSENT';
const CURRENTUSERPARSED = 'CURRENTUSERPARSED' ; const TESTVALUE = 'TESTVALUE'; const LAZYLOADING = 'LAZYLOADING'


const getLoggedIn = ()=>{
    let value
    if(localStorage.getItem('LoggedIn')){
        return  value = Boolean(localStorage.getItem('LoggedIn'))
    }else{
        return value = false
    }
    return value
}
const getCurrentUser = ()=>{
    let value
    if(localStorage.getItem('CurrentUser')){
         value = localStorage.getItem('CurrentUser')
    }else{
        value = {}
    }
    return value
}
const getUserFollowings = ()=>{
    let value
    if(localStorage.getItem('UserFollowings')){
         value = localStorage.getItem('UserFollowings')
    }else{
        value = []
    }
    return value
}

const AppContext = React.createContext()
const initialState = {
    //auth-context

    loggedIn : getLoggedIn(),
    registered : false,
    currentUserParsed : {},
    currentUser : getCurrentUser(),
    tempCurrentUser : {},
    verified : false,

    //page-context
    alert : {status : false, msg : ''},
    loading : false,
    lazyLoading : false,
    sidebarOpen : false,
    timelineposts : [],
    allUsers : [],
    tempAllUsers : [],
    postcreated : false,

    userClicked : false,
    fetchedUser : {},

    commentSent : false,
    testValue : false
}

export const AppProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer, initialState)
    const allUsersUrl = "https://smart-job-search.herokuapp.com/api/v1/user"
    const posturl = 'https://smart-job-search.herokuapp.com/api/v1/posts'


    //SET LOADING 
    const setLoading =(value)=> {
    //    console.log('LOADING')
            dispatch({type : LOADING, payload : value})
     }

    //FETCH TIME-LINE POSTS
    const fetchTimelinePosts = async(url)=>{
      
        const options = {
            url: url,
            method : "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            }
        }
       // dispatch({type : LOADING, payload : true})
       
        const result = await Axios(options)
        const {response, allPosts} = result.data
        if(response == 'Success' && allPosts){
           const newTimelinePosts = allPosts.sort((a,b)=>{
               return new Date(b.createdAt) - new Date(a.createdAt)
           })
            dispatch({type : TIMELINEPOSTS, payload : newTimelinePosts})
        }else if(response == 'Fail'){
            dispatch({type: ALERT, payload : "An error occured"})
        }
        
    }
    // console.log('joler ', state.timelineposts )
    // const checkeUser = state.currentUser
    
    // console.log(con._id)
   
    
    //FETCH TIME-LINE POSTS USEEFFECT
    useEffect(()=>{
       
        // setInterval(()=>{
          
            const checkeUser = state.currentUser
            let parsedCheckeUser = ''
            
            //CHECK IF CURRENTUSER IS IN LOCALSTORAGE

            if(JSON.parse(checkeUser)._id !== null){
                parsedCheckeUser = JSON.parse(checkeUser)
               let {_id, username} = parsedCheckeUser
                fetchTimelinePosts(`${posturl}/${_id}/${username}/timeline`)
             }
             if(state.currentUser._id !== null){
               return parsedCheckeUser = state.currentUser 
               let {_id, username} = parsedCheckeUser
                fetchTimelinePosts(`${posturl}/${_id}/${username}/timeline`)
             }
             
            
            // }else{
            //     let _id = '';
            //     let username = '';
            //     fetchTimelinePosts(`${posturl}/${_id}/${username}`)
           //  }
        //}, 10000)       
    },[state.postcreated, state.userClicked])


    //FETCH OTHER USER TIMELINE POSTS

    const setTimelinePosts = (value)=>{
        dispatch({type : TIMELINEPOSTS, payload : value})
    }

    //FETCH ALL USERS
    const fetchAllUsers = async(url)=>{
    // dispatch({type : LOADING, payload : true})
    await Axios(url).then(result =>{
    
        const {response} = result.data
        
        if(response == 'Success'){
            ///dispatch({type : LOADING, payload : false})
            const {usersData} = result.data
            dispatch({type : ALLUSERS, payload : usersData})
        }else if(response == 'Fail'){
            //dispatch({type : LOADING, payload : false})
            dispatch({type: ALERT, payload : "An error occured fetching other users"})
        }
    })
        
    }

    //FETCH ALL USERS USEEFFECT
    useEffect(()=>{
        if(state.timelineposts.length == 0){
                fetchAllUsers(allUsersUrl) 
        }
       
    },[])

    //FETCH ALL USERS WHEN MORE BUTTON IS CLICKED
    const setTempAllusers = (value)=>{
        dispatch({type : TEMPALLUSERS, payload : value})
    }

    //SET CURRENT USER
   const setCurrentUser = (value)=>{
      
        localStorage.setItem('CurrentUser',JSON.stringify(value))
    //    localStorage.setItem('UserFollowings', JSON.stringify(value.followings))
        //dispatch({type : CURRENTUSER, payload : value})
    //    dispatch({type : SETCUSERFOLLOWINGS, payload : value.followings})
    }

//    //SET USERDATA WHEN CHAGES OCCURS - LIKE FOLLOWING / UNFOLLOWING
    const setNewCurrentUser = (value)=>{
            localStorage.setItem('CurrentUser',JSON.stringify(value))
            console.log(value)
           // dispatch({type : SETNEWTEMPUSER, payload : value})
           dispatch({type : CURRENTUSER, payload : value})
    }
//    useEffect(()=>{
//        if(state.tempCurrentUser._id){
//         setCurrentUser(state.tempCurrentUser)
//        }else{
//            return
//        }
//    },[state.tempCurrentUser])

   const setPostCreated =(value)=>{
        dispatch({type : POSTCREATED, payload : value})
   }

   const fetchCurrentUser=async(userUrl)=>{

    const options = {
        url: userUrl,
        method : "GET",
        headers : {
            "Accept" : "application/json",
            "Content-Type" : "application/json;cjarset=UTF-8"
        }
    }
   
    const result = await Axios(options)
    const {response, data} = result.data
        if(data){
            dispatch({type : CURRENTUSERPARSED , payload : data})
            //return window.location.href = '/'
        }else{
            dispatch({type : CURRENTUSERPARSED , payload : {}})
        }
   }
   useEffect(()=>{
    const {_id, username} = JSON.parse(state.currentUser)
    fetchCurrentUser(`http://smart-job-search.herokuapp.com/api/v1/user/${_id}/${username}`)
   },[state.currentUser,state.testValue])

   //SET LOGGED-IN
   const setLoggedIn =(value)=>{
       if(value == true){
        localStorage.setItem('LoggedIn',"true")
       }else if(value == false){
        localStorage.setItem('LoggedIn',"false")
       }
         
       dispatch({type : LOGGEDIN, payload : value})
   }

   //OPEN SIDE BAR
   const openSidebar = ()=>{
       dispatch({type : SETSIDEBAR})
   }

   //CHECK IF A USER PROFILE IS CLICKED
   const setUserClicked =()=>{
       dispatch({type : USERCLICKED})
   }

//SET OTHER USER
const setFetchedUser = (value)=>{
    dispatch({type : SETFETCHEDUSER, payload : value})
}

//TRIGGER COMMENT SENT
const setCommentSent = (value)=>{
    dispatch({type : COMMENTSENT, payload : value})
}
//FETCH OTHER USER USEEFECT
// useEffect(()=>{
//     const {id, username} = useParams()
//     if(userId != id && username != userUsername){ 
//         fetchUser(`https://smart-job-search.herokuapp.com/api/v1/user/${id}/${username}`)
//     }
// },[userClicked])

const setTestValue = (value)=>{
    dispatch({type : TESTVALUE, payload : value})
}

//SET LAZY-LOADING FOR POSTS
const setLazyLoading = (value)=>{
    dispatch({type : LAZYLOADING, payload : value})
}
    return <AppContext.Provider value={{
        ...state, setLoading, setLazyLoading, setCurrentUser, setLoggedIn, setNewCurrentUser, setTempAllusers,
        setPostCreated, openSidebar, setUserClicked, setFetchedUser, setTimelinePosts,
        setCommentSent,  setTestValue
    }}>
    {children}
    </AppContext.Provider>
}

export const UseAppContext = ()=>{
    return React.useContext(AppContext)
}
