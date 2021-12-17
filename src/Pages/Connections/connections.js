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
if(currentUserParsed){
    newUserConections = currentUserParsed.connections
}

const {id, username} = useParams()

//ACCEPT CONNECTION REQUEST FROM A USER
const acceptRequest = async(value1, value2)=>{
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
        setError({status : true, msg : "Failed to post comment"})
    }
}


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
        console.log('result now', result)
        // console.log('result now', result)
        // if(result.data.response == "Success"){
        //     const reponse_2 = await axios(getUserurl)
        //     const {data} = reponse_2.data
        //     if(data){
        //         setTestValue(!testValue)
        //         // window.location.href=`/userprofile/${_id}/${username}`
        //         // setDataValues(true, data)
        //     } 
        // }else{
        //     setAlertMsg({status : true, msg : 'An error occured while following'})  
        // }       
        
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


let userConnectionRequests = currentUserParsed.connectionRequests ? currentUserParsed.connectionRequests : []
let userConnections = currentUserParsed.connections ? currentUserParsed.connections : []

    const connectionRequestsArray =  allUsers.filter(user =>{
        if(currentUserParsed.connectionRequests){
            if(currentUserParsed.connectionRequests.includes(user._id)){
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

        console.log('connectionRequestsArray', connectionRequestsArray )
    return <>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <Grid className='connections' container > 
        <Grid className='connections-left' item sm={false} md={2} ></Grid> 
            <Grid className='connections-center'  item md={10} > 
            <h3>People you can connect with</h3>
            <div className='connections-center-inner' >
            {
            tempAllUsers &&
            tempAllUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, connections} = currentUserParsed.connections ? currentUserParsed : JSON.parse(currentUser)
                        if(allUser._id !== _id && !connections.includes(allUser._id)){
                        return <div key={id} className='connetions-box'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="connections-img"/>
                            </Link>
                            <div className='connections-name'>{username}</div>
                            <form>
                                <br/>
                                {/* <div>{username}</div> */}
                                <button onClick={(e)=>connectRequest(e, id, username)} className='connect-btn'>{ !newUserConections ? null : newUserConections.includes(allUser._id) ? `Disconnect` : `Connect`}</button>
                            </form>
                        </div>
                        }
                })
            }
            </div>
            <div className='button-nav'>
            <button className='more-btn' onClick={()=>setRandomUsers(allUsers)}>Find Random Users</button>
            </div>
            <div>Connection Requests {userConnectionRequests.length}</div>
            {

                connectionRequestsArray.map(user =>{
                    const {_id, username, followers, followings, connections} = user
                    return <><div>{username}</div><Button onClick={()=>acceptRequest(_id,username)}>Accept</Button>
                    <Button>Decline</Button></>
                })
            }
            <div>Connections {connectionsArray.length}</div>
            {

                userConnections.map(user =>{
                    //your connections here
                    const {_id, username, followers, followings, connections} = user
                    return <div>{username}</div>
                })
            }
            </Grid>
        </Grid>
        </>
}

export default Connections