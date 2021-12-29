import './messages.css'
import {useState, useEffect} from 'react'
import {useParams} from "react-router-dom"
import axios from 'axios'
import { FaUserAlt, FaUsers, FaImages, FaHome, FaUser, FaCamera, FaEllipsisH, FaTelegramPlane } from 'react-icons/fa'
import { Topbar, Sidebar, Backdrop } from "../../Components"
import {Button, Grid} from '@material-ui/core'
import { UseAppContext } from '../../Contexts/app-context'
import Axios from 'axios'
import SinglgeMessage from './singleMessage'
import { Satellite } from '@material-ui/icons'

const Chat = ()=>{

    const {loggedIn, currentUserParsed, allUsers, setChatUser, chatUser} = UseAppContext()
    const [error, setError] = useState({status : false, msg:''})
    const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
    const [postPicturePreview, setPostPicturePreview] = useState('')
    const [postImage, setPostImage] = useState('')
    const [postPreviewBox, setPostPreviewBox] = useState(false)
    const [chatCreated, setChatCreated] = useState(false)

const {userId, userUsername, id} = useParams()
const [fetchedMsg, setFetchedMsg] = useState([])
const [formData, setFormData] = useState({
    userID : '',
    userName : "",
    message : ""
})

const [otherUser, setOtherUser] = useState({
    id: "",
    username : ""
})

const setPostData = (value1, value2)=>{
    setAlertMsg({status : value1, msg : value2})
    setPostPreviewBox(false)
    setChatCreated(!chatCreated)
    setFormData({
        userName : "",
        message : ""
    })
}

    const fetchUsersChat = async(fetchurl)=>{
        const result = await axios(fetchurl)
        const fetchedMsg = result.data.allUserMessages 
        const filtredForNull = fetchedMsg.filter(item => item !== null)
        const fetchedMsgSorted = filtredForNull.sort((a,b)=>{
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
        setFetchedMsg(fetchedMsgSorted)
    
    }

    useEffect(()=>{
        const newArrId = []
        const newArrUsername = []
        fetchedMsg.map(msg =>{
            newArrId.push(msg.senderId)
            newArrId.push(msg.receiverId)
            newArrUsername.push(msg.senderUsername)
            newArrUsername.push(msg.receiverUsername)
        const newArrayId2 =  newArrId.filter(item =>{
            return item != userId
        })
        const newArrUsername2 =  newArrUsername.filter(item =>{
            return item != userUsername
        })
        const ID = newArrayId2[0]
        const UserName = newArrUsername2[0]
        setOtherUser({
                id : ID,
                username : UserName
            })
        })
    },[fetchedMsg])
    

    useEffect(()=>{
        fetchUsersChat(`https://smart-job-search.herokuapp.com/api/v1/messages/chat/${userId}/${userUsername}/${id}`)
    },[chatCreated])
    
    const setFormValue = (e, value1, value2)=>{
        e.preventDefault()
      console.log('loging,', value1, value2, otherUser )
        setFormData({userID : value1, userName : value2, message : e.target.value})
        
    }


    //SEND MESSAGE

const sendMessage = async(e)=>{
    
    e.preventDefault()
    const {_id , username} = currentUserParsed
    // const userData = formData.recipient
    // const recipientId = userData.split(' ')[0]
    // const recipientUsername = userData.split(' ')[1]
    
    const {userID : recipientId, userName : recipientUsername} = formData
    const url = `https://smart-job-search.herokuapp.com/api/v1/messages/${recipientId}/${recipientUsername}`
// console.log('formData',formData, currentUserParsed)
    if(postImage){        
    const fd = new FormData()
    fd.append("image", postImage, postImage.name)

    const result = await Axios.post(`https://smart-job-search.herokuapp.com/api/v1/messages/uploadmessageimage/${_id}/${username}`, fd)

    const {src : imgSrc} = result.data.image

        const options = {
            url: url,
            method : "POST",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                senderId : _id,
                senderUsername : username,
                receiverId : recipientId,
                receiverUsername : recipientUsername,
                message : formData.message,
                img : imgSrc
            }
        }

        const result2 = await Axios(options)
        
        const {response, formatedMessage} = result2.data
 
        if(response === 'Success' && formatedMessage){ 
            setPostData(true, "Your post has been submited")
            // setPostcreated(!postcreated)
        }else if(response === 'Fail'){
            const {message} = result2.data
            setError({status : true, msg : message})
            setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
    }else{
        if(!formData){
            setError({status : true, msg : "Pleae enter a text to post"})
           return setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
            const options = {
                url: url,
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;charset=UTF-8"
                },
                data:{
                    senderId : userId,
                    senderUsername : username,
                    receiverId : recipientId,
                    receiverUsername : recipientUsername,
                    message : formData.message
                }
            }
            
            const result = await Axios(options)
            console.log(result)
            const {formatedMessage, response} = result.data
           
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
}

if(loggedIn == false){
    return window.location.href = '/login'
}


    return <div className='chat-main'>
        <Topbar />
        <Sidebar />
        <Backdrop />
        <Grid container className="chats-container-main" >
            <Grid item xs={false} sm={3} className="chat-left">
                dstrsdsb
            </Grid>
            <Grid item xs={12} sm={6} className="chats-container">
                <div className = 'chat-title'>{chatUser}</div>
        {
            fetchedMsg.map(message =>{   
                const {_id} = message             
               return  <SinglgeMessage key={_id} {...message} />
            })
        }
         <div className='sendingBox'>
        <textarea value={formData.message} type='text' onChange={(e)=>setFormValue(e,otherUser.id, otherUser.username)} placeholder='Your message' variant = 'contained'
            name='message' className='chatinput'></textarea><br />

        <Button style={{ position: "absolute", top:"1rem", right:"0rem"}} className='send-btn' onClick={sendMessage}><FaTelegramPlane className='submit-icon'/></Button>
        {/* <Button  className='formbutton' onClick={sendMessage}>Send</Button> */}
        </div>







            </Grid>
         <Grid item xs={false} sm={3} className="chat-right">
        </Grid>
    </Grid>
    </div>
}

export default Chat