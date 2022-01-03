 './messages.css'
import {useState, useEffect} from 'react'
import {useParams} from "react-router-dom"
import axios from 'axios'
import { FaUserAlt, FaUsers, FaImages, FaHome, FaUser, FaCamera, FaEllipsisH, FaTelegramPlane,
    FaFileImage } from 'react-icons/fa'
import { Topbar, Sidebar, Backdrop } from "../../Components"
import {Button, Grid} from '@material-ui/core'
import { UseAppContext } from '../../Contexts/app-context'
import Axios from 'axios'
import SinglgeMessage from './singleMessage'
import { Satellite } from '@material-ui/icons'
import { LeftNavigation } from '../../Components'

const Chat = ()=>{

    const {loggedIn, setTestValue, currentUserParsed, allUsers, setChatUser, chatUser, replySent } = UseAppContext()
    const [error, setError] = useState({status : false, msg:''})
    const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
    const [messageImagePreview, setMessageImagePreview] = useState('')
    const [messageImage, setMessageImage] = useState('')
    const [postPreviewBox, setPostPreviewBox] = useState(false)
    // const [fetchedOtherUser, setFetchedOtherUser] = useState({})
    const [chatCreated, setChatCreated] = useState(false)
    const [messageImagePreviewBox, setMessageImagePreviewBox] = useState(false)
    const msgImgurl = 'https://smart-job-search.herokuapp.com/api/v1/messages'
    let chatUsername = ''

const {userId, userUsername, id, otherUsername} = useParams()
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
    setMessageImagePreviewBox(false)
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
    },[chatCreated, replySent])
    
    const setFormValue = (e, value1, value2)=>{
        e.preventDefault()
        setFormData({userID : value1, userName : value2,  message : e.target.value})
        
    }


    //select message pic
const selectMessagePic = (e, value1, value2)=>{
    e.preventDefault()
    setMessageImage(e.target.files[0])
    setFormData({userID : value1, userName : value2})
}

useEffect(()=>{
    if(messageImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setMessageImagePreview(fileReader.result)
        }
        fileReader.readAsDataURL(messageImage)
        setMessageImagePreviewBox(true)
    
    }else{
        return
    }
},[messageImage])


// const setMessagePicture = (value)=>{
//     setCoverPreviewBox(false)
//     setTestValue(value)
// }

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
    if(!formData.message && ! messageImage){
        return 
    }
    if(messageImage){      
    const fd = new FormData()
    fd.append("image", messageImage, messageImage.name)
    const {_id , username} = currentUserParsed
    const result = await Axios.post(`https://smart-job-search.herokuapp.com/api/v1/messages/uploadmessageimage/${_id}/${username}`, fd)

    const {src : imgSrc} = result.data.image
    let options = {}
    const {userID : recipientId, userName : recipientUsername} = formData
    console.log(recipientUsername, recipientId)
    if(formData.message){
         options = {
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
                message : formData.message,
                img : imgSrc
            }
        }
    }else{
         options = {
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
                img : imgSrc
            }
        }
    }
       

         const result2 = await Axios(options)
        const {response, formatedMessage} = result2.data
       
        if(response === 'Success' && formatedMessage){ 
            // const {_doc} = response
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
        console.log(recipientUsername)
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
            const {formatedMessage, response} = result.data
           
            if(response === 'Success'){ 
                const elmnt = document.getElementById("content");
               setTimeout(() => {
                elmnt.scrollIntoView();   
               }, 1000);
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

//upload message image and return url 

const uploadMessagePicture = async(value)=>{
    const {_id : userId , username} = currentUserParsed
    // const  url =`${msgImgurl}/uploadmessageimage/${userId}/${username}`

    const fd = new FormData()
    fd.append("image", value, value.name)

    const result = await axios.post(`https://smart-job-search.herokuapp.com/api/v1/user/uploadmessageimage/${userId}/${username}`, fd)
    
    const {src : imgSrc} = result.data.image
    
  const options = {
        url: `https://smart-job-search.herokuapp.com/api/v1/user/createimage/${userId}/${username}`,
        method : "PATCH",
        headers : {
            "Accept" : "application/json",
            "Content-Type" : "application/json;charset=UTF-8"
        },
        data : {
            userId : userId,
            username : username,
            coverPicture : imgSrc
        }
    }

    const result2 = await Axios(options)

    const {response, message} = result2.data
    
    if(response == 'Success' && message){
        setMessageImgePicture(message)
    }else if(response == 'Fail'){
       setError({status : true, msg : "Fialed to upload profile image"})
       return setTimeout(()=>{
            setError({status : false, msg :''})
    }, 4000)
    }
}

const setMessageImgePicture = (value)=>{
    setMessageImagePreviewBox(false)
    setTestValue(value)
}

if(loggedIn == false){
    return window.location.href = '/login'
}

setTimeout(() => {
    const elmnt = document.getElementById("content");
    elmnt.scrollIntoView();   
}, 1000);
if(otherUsername){
    chatUsername = otherUsername.slice(0,1).toUpperCase().concat(otherUsername.slice(1).toLowerCase())
}

const {_id : idCurrent , username : usernameCurrent} = currentUserParsed

    return <div className='chat-main'>
        <Topbar />
        <Sidebar />
        <Backdrop />
        <Grid container className="chats-container-main" >
        {messageImagePreviewBox && 
         <Grid item xs={12} className='preview-container'>
                <div className='message-img-preview-box'>
                    <div>
                        <img src={messageImagePreview} alt='Error loading preview' className='message-img-preview'/>
                        <div className='pic-upload-btn'>
                            <Button onClick={()=>setMessageImagePreviewBox(false)}>Cancel</Button>
                            <Button onClick={sendMessage}>Send Picture</Button>
                        </div>
                    </div>
                </div>
                </Grid>
            }
            <Grid item xs={false} sm={3} className="chat-left">
                <LeftNavigation />
            </Grid>
            <Grid item xs={12} sm={6} className="chats-container" >
                <div className = 'chat-title'>{chatUsername}</div>
                <div className='observer-container'>
                {
                    fetchedMsg.map(message =>{   
                        const {_id} = message             
                    return  <SinglgeMessage key={_id} {...message} otherUser={otherUser} />
                    })
                }
                <div id='content'></div>
            </div>
            <div className='sendingBox'>
            <textarea value={formData.message} type='text' onChange={(e)=>setFormValue(e,otherUser.id, otherUser.username)} placeholder='Your message' variant = 'contained'
                name='message' className='chatinput'></textarea><br />

            {/* {messageImagePreviewBox && 
                <div className='cover-img-preview-box'>
                    <img src={messageImagePreview} alt='Error loading preview' className='message-img-preview'/>
                    <div className='pic-upload-btn'>
                        <Button onClick={()=>setMessageImagePreviewBox(false)}>Cancel</Button>
                        <Button onClick={()=>uploadMessagePicture(messageImage)}>Send Picture</Button>
                    </div>
                </div>
                } */}
                <form className="message-img-label-box" enctype="multipart/form-data">
                    {idCurrent == userId && usernameCurrent == userUsername && <label htmlFor='messagePicture'  >
                        {/* <div style={{ position: "absolute", top:"0rem", right:"0rem", width:"2rem", background:"green", padding:"0.0.4rem"}}>  */}
                            <FaFileImage  className='msg-img-upload-icon' size='23' /> 
                        {/* </div> */}
                    <input id='messagePicture' type='file' name='messagePic' className='homepage-center-input2' 
                    onChange={(e)=>selectMessagePic(e, otherUser.id, otherUser.username)}/>
                   
                    </label>}
                    
                </form>
                <div className='send-btn' onClick={sendMessage}>
                    <FaTelegramPlane className='submit-icon' size='23'/>
                </div>
            {/* <Button  className='formbutton' onClick={sendMessage}>Send</Button> */}
            </div>







            </Grid>
         <Grid item xs={false} sm={3} className="chat-right">
        </Grid>
    </Grid>
    </div>
}

export default Chat