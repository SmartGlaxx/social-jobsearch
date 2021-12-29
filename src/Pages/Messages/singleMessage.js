import {useParams} from "react-router-dom"
import { UseAppContext } from '../../Contexts/app-context'
import TimeAgo from 'timeago-react'
import { FaEllipsisV, FaReply,  FaTrash} from 'react-icons/fa'
import { Button } from "@material-ui/core"
import { useEffect } from "react"

const SinglgeMessage = ({_id, createdAt, message : chat, senderId, senderUsername, receiverId, receiverUsername})=>{
    const {currentUserParsed, allUsers, setPostCreated, setChatUser} = UseAppContext()
    const {userId, userUsername, id} = useParams()

const setChatUserName=()=>{
    setChatUser(receiverUsername)
}

useEffect(()=>{
    setChatUserName()
},[senderId, receiverId])
    return <div className="chat-container-inner">        
        { 
            senderId == userId ?  <div className='userChat' key={_id}>
                <button className="chat-options" ><FaEllipsisV /></button>
                <div className="chatbody">
                    {chat}
                </div>
               <div className="chat-time">
                   <TimeAgo datetime={createdAt} locale='en_US'/>
               </div>
            </div>
                : senderId == id ? <div className='otherUserChat' key={_id}> 
                <button className="chat-options" ><FaEllipsisV /></button>
                <div className="chatbody">
                    {chat}  
                </div>
               <div className="chat-time">
                    <TimeAgo datetime={createdAt} locale='en_US'/>    
                </div>
            </div> 
            : null
            
        }
</div>
}
export default SinglgeMessage