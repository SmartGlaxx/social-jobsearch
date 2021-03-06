import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './follows.css'
import axios from 'axios'
import { Grid } from '@material-ui/core'
import { FaUserAlt, FaUsers, FaImages, FaExclamationCircle, FaHome, FaUser, FaAngleRight, FaAngleLeft} from 'react-icons/fa'
import { Dummy } from '../dummy'
import {Topbar, Sidebar, Backdrop} from '../../Components';
import { UseAppContext } from '../../Contexts/app-context'
import {Link, useNavigate} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
import Axios from 'axios'
import OtherUsers from '../../Components/OtherUsers/otherUsers'
import LoadingIcons from 'react-loading-icons'
import ProfileImage from '../../assets/profile.jfif'
import CoverImage from '../../assets/cover.jfif'
import Button from '@restart/ui/esm/Button'
import Profile from "../../assets/profile.jfif"
import { LeftNavigation } from '../../Components'

const Follows =()=>{
const {loggedIn, setLoading, loading, currentUser, currentUserParsed, allUsers, postcreated, setPostCreated, setTempAllusers,
tempAllUsers, setNewCurrentUser, setUserClicked, userClicked, setFetchedUser, fetchedUser, setTestValue, testValue} = UseAppContext()
const [formValue, setFormValue] = useState('')
const [error, setError] = useState({status : false, msg:''})
const {_id : userId, username : userUsername, followings, followers, connections, connectionRequests} = JSON.parse(currentUser)
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
const followurl = 'https://smart-job-search.herokuapp.com/api/v1/user/follow'
const unFollowurl = 'https://smart-job-search.herokuapp.com/api/v1/user/unfollow'
const getUserurl = `https://smart-job-search.herokuapp.com/api/v1/user/${userId}/${userUsername}`
const posturl = 'https://smart-job-search.herokuapp.com/api/v1/posts'
// const [userClicked, setUserClicked] = useState(false)
const [newPage, setNewPage] = useState(false)
const [timelineposts, setTimelinePosts] = useState([])

// const setValues = (e)=>{
//     setFormValue(e.target.value)
// }


const setValues = (value, data)=>{
    setNewCurrentUser(data)
    setLoading(value)
}

let newUserConections  = []
if(currentUserParsed.connections){
    newUserConections = currentUserParsed.connections
}

const {id, username} = useParams()


//CONNECTION REQUEST TO USER
const connectRequest =async(e, value1, value2)=>{
    e.preventDefault()
    
    const {_id , username} = currentUserParsed
   
        const options = {
            url : `https://smart-job-search.herokuapp.com/api/v1/user/connectrequest/${value1}/${value2}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username                
            }
        } 
        
        const result = await axios(options)
      
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                // window.location.href=`/userprofile/${_id}/${username}`
                // setDataValues(true, data)
            } 
        }else{
            setAlertMsg({status : true, msg : 'Failed to send request from user'})  
        }       
        
    // }

}


//ACCEPT CONNECTION REQUEST FROM A USER
const acceptConnectRequest = async(e, value1, value2)=>{
    e.preventDefault()
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
    const options ={
        url : `https://smart-job-search.herokuapp.com/api/v1/user/acceptconnectrequest/${value1}/${value2}`,
        method : "PATCH",
        headers : {
           "Accept" : "Application/json",
           "Content-Type" : "Application/json;charset=utf-8"
        },
        data :{
            userId : currentUserId,
            username : currentUserName
        }
    }
    
    const result = await axios(options)
    
    const {response} = result.data
    if(response == 'Success'){
        const reponse_2 = await axios(getUserurl)
        const {data} = reponse_2.data
        
        if(data){
            // window.location.href='/' 
            // setValues(true, data)
            setTestValue(!testValue)
        } 
    }else{
        setError({status : true, msg : "Failed to accept request from user"})
    }
}


//DECLINE CONNECTION REQUEST FROM A USER
const declineConnectRequest = async(e, value1, value2)=>{
    e.preventDefault()
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
    const options ={
        url : `https://smart-job-search.herokuapp.com/api/v1/user/declineconnectrequest/${value1}/${value2}`,
        method : "PATCH",
        headers : {
           "Accept" : "Application/json",
           "Content-Type" : "Application/json;charset=utf-8"
        },
        data :{
            userId : currentUserId,
            username : currentUserName
        }
    }
    
    const result = await axios(options)
    
    const {response} = result.data
    if(response == 'Success'){
        const reponse_2 = await axios(getUserurl)
        const {data} = reponse_2.data
        
        if(data){
            // window.location.href='/' 
            // setValues(true, data)
            setTestValue(!testValue)
        } 
    }else{
        setError({status : true, msg : "Failed to decline request from user"})
    }
}


//DISCONNECTION REQUEST TO USER
const disconnectRequest =async(e, value1, value2)=>{
    e.preventDefault()
    
    const {_id , username} = currentUserParsed
   
        const options = {
            url : `https://smart-job-search.herokuapp.com/api/v1/user/disconnectrequest/${value1}/${value2}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username                
            }
        } 
        
        const result = await axios(options)
      
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                // window.location.href=`/userprofile/${_id}/${username}`
                // setDataValues(true, data)
            } 
        }else{
            setAlertMsg({status : true, msg : 'Failed to disconnect from user'})  
        }       
        
    // }

}


let randomStart = 0
let randomEnd = 0


if(allUsers.length !== 0){
randomStart = Math.floor(Math.random() * 10)
if(allUsers.length - randomStart <= 5){
    randomStart = 0
}
randomEnd = randomStart + 20
}

const setRandomUsers = (value)=>{
    setTempAllusers(value.slice(randomStart,randomEnd))
}

useEffect(()=>{
setRandomUsers(allUsers)
},[allUsers])


let userFollowers = currentUserParsed.followers ? currentUserParsed.followers : []
let userFollowings = currentUserParsed.followings ? currentUserParsed.followings : []
// let userConnections = currentUserParsed.connections ? currentUserParsed.connections : []


    const sentConnectionRequestsArray =  allUsers.filter(user =>{
        if(currentUserParsed.sentConnectionRequests){
            if(currentUserParsed.sentConnectionRequests.includes(user._id)){
                return user
            }
            }else{
                return
            }
    })
    const receivedConnectionRequestsArray =  allUsers.filter(user =>{
        if(currentUserParsed.receivedConnectionRequests){
            if(currentUserParsed.receivedConnectionRequests.includes(user._id)){
                return user
            }
            }else{
                return
            }
    })
    const  connectionsArray =  allUsers.filter(user =>{
        if(currentUserParsed.connections){
            if(currentUserParsed.connections.includes(user._id)){
                return user
            }
        }else{
            return
        }
        })        

    let newUserFollowings  = []
    if(currentUserParsed){
         newUserFollowings = currentUserParsed.followings
    }

        //FOLLOW USER
const follow =async(e, id, followedUsername)=>{
    e.preventDefault()
    const {_id , username} = JSON.parse(currentUser)
   
        const options = {
            url: `${followurl}/${id}/${followedUsername}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username                
            }
        } 
       
        const result = await axios(options)
        
        if(result.data.response == "Success"){
          
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            
            if(data){
                // window.location.href='/' 
                // setValues(true, data)

                setTestValue(!testValue)
                setPostCreated(true)
                setTimeout(()=>{
                    setPostCreated(false)
                }, 3000)
            } 
        }else{
            setAlertMsg({status : true, msg : 'An error occured while following'})  
        }       
        
    // }

}



//UNFOLLOW USER
const unfollow =async(e, id, followedUsername)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
   
        const options = {
            url: `${unFollowurl}/${id}/${followedUsername}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                userUsername : username                
            }
        } 
       
        const result = await axios(options)
        console.log(result)
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                setPostCreated(true)
                setTimeout(()=>{
                    setPostCreated(false)
                }, 3000)
            } 
        }else{
            setAlertMsg({status : true, msg : 'An error occured while following'})  
        }       
        
    // }

}


    return <>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <Grid className='follows' container > 
        <Grid className='' item xs ={false} sm={false} md={2} >
        <LeftNavigation />   
        </Grid> 
            <Grid className='follows-center' xs={12} item sm={12} md={10} > 
            <h2>Followers({userFollowers.length})</h2>
            <h4>People following you</h4><br />
            <div className='follows-center-inner' >
            {
            tempAllUsers &&
            tempAllUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, followers} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed && userFollowers.includes(allUser._id)) {
                        return <div key={id} className='follows-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="follows-img"/>
                            </Link>
                            <div className='follows-name'>{username}</div>
                        </div>
                        }
                })
            }
            </div>
            <h2>Followings({userFollowings.length})</h2>
            <h4>People you Follow </h4>
            <br />
            <div className='follows-center-inner' >
            {
            tempAllUsers &&
            tempAllUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, followings} = currentUserParsed.followings ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed && userFollowings.includes(allUser._id)){
                        return <div key={id} className='follows-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="follows-img"/>
                            </Link>
                            <div className='follows-name'>{username}</div>
                            <form>
                                <button onClick={(e)=>unfollow(e, id, username)} className='follow-btn2'>
                                    {newUserFollowings  && newUserFollowings.includes(allUser._id) ? `Unfollow` : `Follow`}</button>
                            </form>
                        </div>
                        }
                })
            }
            </div>
            </Grid>
        </Grid>
        </>
}

export default Follows