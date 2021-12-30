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
receiverUsername, img : chatImage, repliedId, repliedUsername, repliedMessage, repliedImg})=>{
    const {currentUserParsed, allUsers, setPostCreated, setChatUser} = UseAppContext()
    const [error, setError] = useState({status : false, msg:''})
    const {userId, userUsername, id} = useParams()
    const [replyBox, setReplyBox] = useState(false)
    const [formData, setFormData] = useState('')

const setReplyForm = ()=>{
    setReplyBox(true)
}
const setChatUserName=()=>{
    setChatUser(receiverUsername)
}
console.log(formData)
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
    
   const replyUrl = `https://smart-job-search.herokuapp.com/api/v1/messages/share/${_id}/${userId}/${username}/${receiverId}/${receiverUsername}`
    
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
                    receiverId : receiverId,
                    receiverUsername : receiverUsername,
                    message : formData,
                    repliedId :  senderId,
                    repliedUsername : senderUsername,
                    repliedMessage : chat,
                    repliedImg : chatImage
            }
                }
            
            
            const result = await Axios(options)
            console.log("res share", result, options.data)
            // const {formatedMessage, response} = result.data
           
            // if(response === 'Success'){ 
            //     const elmnt = document.getElementById("content");
            //    setTimeout(() => {
            //     elmnt.scrollIntoView();   
            //    }, 1000);
            //     setPostData(true, "Your post has been submited")
            // }else if(response === 'Fail'){
            //     const {message} = result.data
            //     setError({status : true, msg : message})
            //     setTimeout(()=>{
            //         setError({status : false, msg :''})
            //     }, 4000)
            // }
    
}
    return <div className="chat-container-inner">      
    {replyBox && <div>
    <input type = 'text' onChange={(e)=>setFormData(e.target.value)} />
    <Button onClick={replyMessage}>REPLY</Button>
    </div> } 
    {
        repliedMessage && <div>{repliedMessage}</div>
    }
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
                        <Button ><FaTrash /></Button>
                    </Typography>
                </Popover>
                <div className="chatbody">
                    {chat}
                </div>
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
                        <Button><FaReply /></Button>
                        <Button ><FaTrash /></Button>
                    </Typography>
                </Popover>
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
