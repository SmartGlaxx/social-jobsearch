import './messages.css'
import {useState, useEffect} from 'react'
import {useParams} from "react-router-dom"
import axios from 'axios'
import { FaUserAlt, FaUsers, FaImages, FaHome, FaUser, FaCamera, FaEllipsisH, FaTelegramPlane } from 'react-icons/fa'
import { Topbar, Sidebar, Backdrop } from "../../Components"
import {Button, Grid} from '@material-ui/core'
import { UseAppContext } from '../../Contexts/app-context'
import Axios from 'axios'

const Chat = ()=>{

    const {currentUserParsed, allUsers, setPostCreated} = UseAppContext()
    const [error, setError] = useState({status : false, msg:''})
    const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
    const [postPicturePreview, setPostPicturePreview] = useState('')
    const [postImage, setPostImage] = useState('')
    const [postPreviewBox, setPostPreviewBox] = useState(false)

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
    setPostCreated(true)
    setFormData({
        recipient : "",
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
        fetchedMsg.map(msg =>{
            if(msg.receiverId !== userId  || msg.senderId !== userId){
                setOtherUser({
                    id : msg.receiverId,
                    username : msg.receiverUsername
                })
            }
        })
    },[fetchedMsg])
   

    useEffect(()=>{
        fetchUsersChat(`https://smart-job-search.herokuapp.com/api/v1/messages/chat/${userId}/${userUsername}/${id}`)
    },[])
    
    const setFormValue = (e, value1, value2)=>{
        e.preventDefault()
      
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



    return <div>
        <Topbar />
        <Sidebar />
        <Backdrop />
        <Grid container>
            <Grid item xs={false} sm={3} className="inbox-left">
            </Grid>
            <Grid item xs={12} sm={6} className="inbox-center">
        {
            fetchedMsg.map(message =>{
                const {_id, createdAt, message : chat, senderId, senderUsername, receiverId, receiverUsername} = message
                
                    if(senderId == userId){
                        return <div className='userChat' key={_id}>
                            {chat}
                    </div>
                    }else if(senderId == id){
                        return <div className='otherUserChat' key={_id}>
                        {chat}
                    </div>  
                    }
               
            })
        }
         <div className='sendingBox'>
        <textarea value={formData.message} type='text' onChange={(e)=>setFormValue(e,otherUser.id, otherUser.username)} placeholder='Your message' variant = 'contained'
            name='message' className='chatinput'></textarea><br />

        <Button style={{ position: "absolute", top:"1rem", right:"0rem"}} className='send-btn' onClick={sendMessage}><FaTelegramPlane className='submit-icon'/></Button>
        {/* <Button  className='formbutton' onClick={sendMessage}>Send</Button> */}
        </div>







            </Grid>
         <Grid item xs={false} sm={3} className="inbox-left">
        </Grid>
    </Grid>
    </div>
}

export default Chat