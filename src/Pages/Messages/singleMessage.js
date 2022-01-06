import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


import {useParams} from "react-router-dom"
import { UseAppContext } from '../../Contexts/app-context'
import TimeAgo from 'timeago-react'
import { FaEllipsisV, FaReply,  FaTrash} from 'react-icons/fa'
import { useEffect } from "react"
import Axios from 'axios'

const SinglgeMessage = ({_id, createdAt, message : chat, senderId, senderUsername, receiverId, 
receiverUsername, img : chatImage, repliedId, repliedUsername, repliedMessage, repliedImg, otherUser})=>{
    const {currentUserParsed, allUsers, setPostCreated, setChatUser, setReplySent, replySent,
        setScrollIntoViewValue, scrollIntoViewValue} = UseAppContext()
    const [error, setError] = useState({status : false, msg:''})
    const {userId, userUsername, id} = useParams()
    const [replyBox, setReplyBox] = useState(false)
    const [formData, setFormData] = useState('')
    

//scroll-into-view function
const callScrollIntoViewFunc = ()=>{
    setScrollIntoViewValue(!scrollIntoViewValue)
}

const setPostData = (value1, value2)=>{
    setReplySent(!replySent)
    setReplyBox(false)
    setFormData("")
    callScrollIntoViewFunc()
}


const setReplyForm = ()=>{
    setReplyBox(true)
}
const setChatUserName=()=>{
    setChatUser(receiverUsername)
}



//popover starts
const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));


  const classes = useStyles();
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
   const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);
  const popoverId1 = open1 ? 'simple-popover1' : undefined;
  const popoverId2 = open2 ? 'simple-popover2' : undefined;

  //popover ends



useEffect(()=>{
    setChatUserName()
},[senderId, receiverId])


const replyMessage = async(e)=>{
 
    e.preventDefault()
    const {_id : userId , username} = currentUserParsed
    // const userData = formData.recipient
    // const recipientId = userData.split(' ')[0]
    // const recipientUsername = userData.split(' ')[1]
    // if(!formData.recipient || !formData.message){
    //     return setError({status : true, msg:'Please select a recipient and enter your message'})
    // }
    const {id : otherUserId, username : otherUserUsername} = otherUser
   const replyUrl = `https://smart-job-search.herokuapp.com/api/v1/messages/reply/${_id}/${userId}/${username}/${otherUserId}/${otherUserUsername}`
    
        if(!formData){
            setError({status : true, msg : "Pleae enter a text to post"})
           return setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
  
        const options = {
                url: replyUrl,
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;charset=UTF-8"
                },
                data:{
                    //  sharedId, sharedUsername, sharedMessage, shareImg
                    senderId : userId,
                    senderUsername : username,
                    receiverId : otherUserId,
                    receiverUsername : otherUserUsername,
                    message : formData,
                    repliedId :  senderId,
                    repliedUsername : senderUsername,
                    repliedMessage : chat,
                    repliedImg : chatImage
            }
                }
            
            const result = await Axios(options)  
            const {response} = result.data
            
            if(response === 'Success'){ 
                setPostData(true, "Your post has been submited")
            }else if(response === 'Fail'){
                const {message} = result.data
                setError({status : true, msg : message})
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
    
}

const deleteSent = async(e, _id)=>{
    e.preventDefault()
    const {_id : userId , username} = currentUserParsed
   const deleteUrl = `https://smart-job-search.herokuapp.com/api/v1/messages/deletesent/${_id}`
    
        const options = {
                url: deleteUrl,
                method : "DELETE",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;charset=UTF-8"
                },
                data:{
                    userId : userId,
                    username : username
                }
            }
            
            const result = await Axios(options)  
            const {response} = result.data
            if(response === 'Success'){ 
                setPostData(true, "Your post has been submited")
            }else if(response === 'Fail'){
                const {message} = result.data
                setError({status : true, msg : message})
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
}

const deleteReceived = async(e, _id)=>{
    e.preventDefault()
    const {_id : userId , username} = currentUserParsed
   const deleteUrl = `https://smart-job-search.herokuapp.com/api/v1/messages/deletereceived/${_id}`
    
        const options = {
                url: deleteUrl,
                method : "DELETE",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;charset=UTF-8"
                },
                data:{
                    userId : userId,
                    username : username
                }
            }
            
            const result = await Axios(options)  
            const {response} = result.data
            if(response === 'Success'){ 
                setPostData(true, "Your post has been submited")
            }else if(response === 'Fail'){
                const {message} = result.data
                setError({status : true, msg : message})
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
}




    return <div className="chat-container-inner" >      
    {/* {
        replyBox && <div style={{boder : "none", position:"relative", background: "red", float:"right", zIndex : "10"}}>
    <input type = 'text' onChange={(e)=>setFormData(e.target.value)} /><br />
    <Button onClick={replyMessage}>REPLY</Button>
    </div> 
    }  */}
        { 
            senderId == userId ?  <div className='userChat' key={_id}>
                <button className="chat-options" 
                aria-describedby={id} variant="contained" onClick={handleClick1}
                ><FaEllipsisV /></button>
                 <Popover
                    id={popoverId1}
                    open={open1}
                    anchorEl={anchorEl1}
                    onClose={handleClose1}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                >
                    <Typography className='popover-optons1'>
                        <Button onClick={()=>setReplyForm()}><FaReply /></Button>
                        <Button onClick={(e)=>deleteSent(e,_id)}><FaTrash /></Button>
                    </Typography>
                </Popover>
                {
                    repliedMessage && <div className='replies'>{repliedMessage}</div>
                }
                {
                    repliedImg && <div className='replies'><img src={repliedImg} alt='image' style={{width:"100%", height:"100%"}}/></div>
                }
                {chat && <div className="chatbody" >
                    {chat}
                </div>}
                {
                    chatImage && <img src={chatImage} alt='image' style={{width:"100%", height:"100%"}}/>
                }
               <div className="chat-time">
                   <TimeAgo datetime={createdAt} locale='en_US'/>
               </div>
            </div>
                : senderId == id ? <div className='otherUserChat' key={_id}> 
                <button className="chat-options" 
                aria-describedby={id} variant="contained"  onClick={handleClick2}
                ><FaEllipsisV /></button>
                <Popover
                    id={popoverId2}
                    open={open2}
                    anchorEl={anchorEl2}
                    onClose={handleClose2}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                >
                    <Typography className='popover-optons2'>
                        <Button onClick={()=>setReplyForm()}><FaReply /></Button>
                        <Button onClick={(e)=>deleteReceived(e,_id)}><FaTrash /></Button>
                    </Typography>
                </Popover>
                {
                    repliedMessage && <div className='replies'>{repliedMessage}</div>
                }
                {
                    repliedImg && <div className='replies'><img src={repliedImg} alt='image' style={{width:"100%", height:"100%"}}/></div>
                }
                {chat && <div className="chatbody" >
                    {chat}
                </div>}
                {
                    chatImage && <img src={chatImage} alt='image' style={{width:"100%", height:"100%"}}/>
                }
               <div className="chat-time">
                    <TimeAgo datetime={createdAt} locale='en_US'/>    
                </div>
            </div> 
            : null
            
        }
            {
                replyBox && <div className='reply-box'>
                <input type = 'text' onChange={(e)=>setFormData(e.target.value)}  className='reply-input'/><br />
                <Button onClick={replyMessage}  className='reply-btn' style={{background:"var(--button-background)"}}>REPLY</Button>
                </div> 
            }

</div>
}
export default SinglgeMessage
