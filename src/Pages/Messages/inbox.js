import './messages.css'
import { Button, Grid } from "@material-ui/core"
import { UseAppContext } from "../../Contexts/app-context"
import { Topbar, Sidebar, Backdrop } from "../../Components"
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { FaImages, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import axios from 'axios'
import LoadingIcons from 'react-loading-icons'
import { LeftNavigation } from '../../Components'
import Profile from "../../assets/profile.jfif"

const Inbox = () =>{
    const {loggedIn, currentUserParsed} = UseAppContext()
    const [newAllMessages, setNewAllMessages] = useState([])
    const [userUniqueIds, setUserUniqueIds] = useState([])
    const [fetchedUsers, setFetchedUsers] = useState([])
    const  {_id : userId, username : userUsername } = currentUserParsed
    const messageUrl =  `https://smart-job-search.herokuapp.com/api/v1/messages/${userId}/${userUsername}`
    
    const fetchUserMessages = async(url)=>{
      
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
        
        const {response, allUserMessages} = result.data
        
        if(response == 'Success' && allUserMessages){
            
           const newAllUserMessages = allUserMessages.sort((a,b)=>{
               return a.senderId - b.senderId
           })
           setNewAllMessages(newAllUserMessages)
        }else if(response == 'Fail'){
        //    setError({status : true, msg : "Fialed to fetch timeline posts"})
           return setTimeout(()=>{
                // setError({status : false, msg :''})
        }, 4000)
        }
        
    }

useEffect(()=>{
    fetchUserMessages(messageUrl)
},[fetchedUsers])

const filterMessages = ()=>{
    
    const filteredSent = [...new Set(newAllMessages.map(item => item.senderId))] 
    const filteredReceived = [...new Set(newAllMessages.map(item => item.receiverId))]  
    const filtered = [...new Set(filteredSent.concat(filteredReceived))]  
    setUserUniqueIds(filtered)

}

useEffect(()=>{
  filterMessages()
},[newAllMessages])



const fetchUsers = async(fetchurl)=>{
    const result = await axios(fetchurl)
    const fetchedUserVal = result.data.usersData 
    setFetchedUsers(fetchedUserVal)

}

useEffect(()=>{
    fetchUsers(`https://smart-job-search.herokuapp.com/api/v1/user`)
},[newAllMessages, userUniqueIds])



if(loggedIn == false){
    return window.location.href = '/login'
}


    return <div>
        <Topbar />
        <Sidebar />
        <Backdrop />
        <Grid container>
            <Grid item xs={false} sm={2} className="">
                <LeftNavigation />
            </Grid>
            <Grid item xs={12} sm={8} className="inbox-center">
                <div className='inbox-center-search'>
                    <FaSearch className='icons2' />
                    <input type='search' className='message-search' placeholder='Search Messages'/>
                </div>
                <Link to='/composemessage'>New Message</Link>
                <div className='unread-messages'>
                    {
                    fetchedUsers.length && userUniqueIds.length ? fetchedUsers.map(user => {
                     
                            if(userUniqueIds.includes(user._id) && user._id !== userId  ){
                                const {_id : id, username : otherUsername, profilePicture} = user
                                let otherUername
                                if(otherUsername){
                                    otherUername = otherUsername.slice(0,1).toUpperCase().concat(otherUsername.slice(1).toLowerCase())
                                }
                                return <div className='inbox-userbox'>
                                    <img src={profilePicture ? profilePicture : Profile} className='inbox-photo'/>
                                    <Link to={`/chat/${userId}/${userUsername}/${id}/${otherUsername}`} className='inbox-name'>{otherUername}</Link><br/>
                                    </div>
                            }
                         }) : 
                         <div style={{width: "100%",height : "5rem", 
                             display: 'grid', placeItems: "center"}}>
                                <h4>No Messages in your inbox</h4>
                             <LoadingIcons.Puff  stroke="#555" strokeOpacity={.9} />
                         </div>  
                          
                     
                   }
                </div>
            </Grid>
            <Grid item xs={false} sm={2} className="inbox-right">
            </Grid>
        </Grid>
    </div>
}


export default Inbox