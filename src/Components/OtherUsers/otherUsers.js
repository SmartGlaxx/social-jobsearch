import {useEffect, useState} from 'react'
import { UseAppContext } from "../../Contexts/app-context";
import "./otherUsers.css"
import { useRef } from "react";
import axios from "axios";
import {Spinner} from 'react-bootstrap'
import LoadingIcons from 'react-loading-icons'
import Profile from "../../assets/profile.jfif"
import { Link } from 'react-router-dom';

const OtherUsers = ()=>{
    const {loading, setNewCurrentUser, currentUser, currentUserParsed, setTempAllusers, tempAllUsers, allUsers, setLoading,
        setUserClicked, userClicked, setTestValue, testValue, setPostCreated} = UseAppContext()
    const {_id : userId, username : userUsername} = JSON.parse(currentUser)
    const followurl = 'https://smart-job-search.herokuapp.com/api/v1/user/follow'
    const getUserurl = `https://smart-job-search.herokuapp.com/api/v1/user/${userId}/${userUsername}`
    const [alertMsg, setAlertMsg] = useState({status : false, msg : ""})
    
    let randomStart = 0
    let randomEnd = 0

   const newUserFollowings = JSON.parse(currentUser).followings

   if(allUsers.length !== 0){
    randomStart = Math.floor(Math.random() * 10)
    if(allUsers.length - randomStart <= 5){
        randomStart = 0
    }
    randomEnd = randomStart + 6
}

    const setValues = (value, data)=>{
        setNewCurrentUser(data)
        setLoading(value)
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


const setRandomUsers = (value)=>{
        setTempAllusers(value.slice(randomStart,randomEnd))
}

useEffect(()=>{
    setRandomUsers(allUsers)
},[allUsers])

if(loading){
    return <div style={{width: "100%",height : "100vh", 
    display: 'grid', placeItems: "center"}}>
       <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
   </div>
}

    return<><div className='otherUsers'>
        {
            alertMsg.status && <div style={{position:"absolute", top:"20vh", background:"red", height : "40rem", width:"39rem"}}>ALERT</div> 
        }
        <div className='users-box'>
        {
            tempAllUsers.length == 0 ? 
            <div style={{width: "100%",height : "7rem", 
                display: 'grid', placeItems: "center"}}>
                <LoadingIcons.Puff stroke="#555" strokeOpacity={.9} />
            </div>: 
            tempAllUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, followings} = currentUserParsed.followings ? currentUserParsed : JSON.parse(currentUser)
                      if(allUser._id !== _id && !followings.includes(allUser._id)){
                        return <div key={id} className='otherUsers-inner'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="follow-img"/>
                            </Link>
                            <div className='folow-name'>{username}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>follow(e, id, username)} className='follow-btn'>{ newUserFollowings.includes(allUser._id) ? `Followed` : `Follow`}</button>
                            </form>
                        </div>
                     }
                })
            
        }
        </div>
    </div>
    <button className='more-btn' onClick={()=>setRandomUsers(allUsers)}>Load More Users</button>
    </>
}

export default OtherUsers