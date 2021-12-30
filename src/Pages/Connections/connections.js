import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './connections.css'
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

const Connections =()=>{
const {loggedIn, setLoading, loading, currentUser, currentUserParsed, allUsers, postcreated, setPostCreated, setTempAllusers,
tempAllUsers, setNewCurrentUser, setUserClicked, userClicked, setFetchedUser, fetchedUser, setTestValue, testValue} = UseAppContext()
const [formValue, setFormValue] = useState('')
const [error, setError] = useState({status : false, msg:''})
const {_id : userId, username : userUsername, followings, followers, connections, connectionRequests} = JSON.parse(currentUser)
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
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


let userSentConnectionRequests = currentUserParsed.sentConnectionRequests ? currentUserParsed.sentConnectionRequests : []
let userReceivedConnectionRequests = currentUserParsed.receivedConnectionRequests ? currentUserParsed.receivedConnectionRequests : []
let userConnections = currentUserParsed.connections ? currentUserParsed.connections : []

console.log('now par',userSentConnectionRequests,  userReceivedConnectionRequests, currentUserParsed)
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

        // console.log('connectionRequestsArray', connectionRequestsArray )
    return <>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <Grid className='connections' container > 
        <Grid className='connections-left' item xs ={false} sm={false} md={2} >
        <LeftNavigation />   
        </Grid> 
            <Grid className='connections-center' xs={12} item sm={12} md={10} > 
            <h2>Connections</h2>
            <h4>People you can connect with</h4><br />
            <div className='connections-center-inner' >
            {
            tempAllUsers &&
            tempAllUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed && !currentUserParsed.connections.includes(allUser._id) && !currentUserParsed.receivedConnectionRequests.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{username}</div>
                            <form>
                                <br/>
                                {/* {
                                    !sentConnectionRequestsArray.includes(allUser._id) && !connectionsArray.includes(allUsers._id) && !receivedConnectionRequestsArray.includes(allUser._id) &&
                                } */}
                                <button onClick={(e)=>connectRequest(e, id, username)} className='connect-btn'>
                                    { !currentUserParsed.sentConnectionRequests.includes(allUser._id) ? `Connect Request` : 
                                    !currentUserParsed.receivedConnectionRequests.includes(allUser._id) ? `Cancel Request` : null}
                                </button>
                            </form>
                        </div>
                        }
                })
            }
            </div>
            <div className='button-nav'>
            <button className='more-btn' onClick={()=>setRandomUsers(allUsers)}>Find Random Users</button>
            </div>
            <h4> Received Connection Requests ({userReceivedConnectionRequests.length})</h4>
            <br />
        <div className='connections-center-inner' >
            {
            tempAllUsers &&
            tempAllUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed.receivedConnectionRequests.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{username}</div>
                            <form>
                                <br/>
                                <div className='connect-response'>
                                <button onClick={(e)=>acceptConnectRequest(e, id, username)} className='connect-btn2'>
                                    Accept
                                </button>
                                <button onClick={(e)=>declineConnectRequest(e, id, username)} className='connect-btn2'>
                                    Decline
                                </button>
                                </div>
                            </form>
                        </div>
                        }
                })
            }
            </div>
             <h4> Sent Connection Requests ({userSentConnectionRequests.length})</h4>
            <div className='connections-center-inner' >
            {
            tempAllUsers &&
            tempAllUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed.sentConnectionRequests.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{username}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>connectRequest(e, id, username)} className='connect-btn3'>
                                    Cancel
                                </button>
                            </form>
                        </div>
                        }
                })
            }
            </div>
            <h3>Connections ({connectionsArray.length})</h3>
             <div className='connections-center-inner' >
            {
            tempAllUsers &&
            tempAllUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && currentUserParsed.connections.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{username}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>disconnectRequest(e, id, username)} className='connect-btn3'>
                                    Disconnect
                                </button>
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

export default Connections