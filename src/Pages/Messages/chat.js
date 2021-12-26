import './messages.css'
import {useState, useEffect} from 'react'
import {useParams} from "react-router-dom"
import axios from 'axios'
import { Topbar, Sidebar, Backdrop } from "../../Components"
import {Grid} from '@material-ui/core'

const Chat = ()=>{
const {userId, userUsername, id} = useParams()
const [fetchedMsg, setFetchedMsg] = useState([])
// console.log('url', userId, userUsername, id)

    const fetchUsersChat = async(fetchurl)=>{
        const result = await axios(fetchurl)
        const fetchedMsg = result.data.allUserMessages 
        const fetchedMsgSorted = fetchedMsg.sort((a,b)=>{
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        setFetchedMsg(fetchedMsgSorted)
    
    }
    
    useEffect(()=>{
        fetchUsersChat(`https://smart-job-search.herokuapp.com/api/v1/messages/chat/${userId}/${userUsername}/${id}`)
    },[])
    


    return <div>
              <Topbar />
        <Sidebar />
        <Backdrop />
        <Grid container>
            <Grid item xs={false} sm={2} className="inbox-left">
            </Grid>
            <Grid item xs={12} sm={8} className="inbox-center">
        {
            fetchedMsg.map(message =>{
                const {_id, createdAt, message : chat, senderId, senderUsername, receiverId, receiverUsername} = message
                
                    if(senderId == userId){
                        return <div className='userChat'>
                            {chat}
                    </div>
                    }else if(senderId == id){
                        return <div className='otherUserChat'>
                        {chat}
                    </div>  
                    }
               
            })
        }
            </Grid>
         <Grid item xs={false} sm={2} className="inbox-left">
        </Grid>
    </Grid>
    </div>
}

export default Chat