import './messages.css'
import { Button, Grid } from "@material-ui/core"
import { UseAppContext } from "../../Contexts/app-context"
import { Topbar, Sidebar, Backdrop } from "../../Components"
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { FaImages } from 'react-icons/fa'


const ComposeMessages = () =>{
const {currentUserParsed, allUsers, setPostCreated} = UseAppContext()
const [error, setError] = useState({status : false, msg:''})
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
const [postPicturePreview, setPostPicturePreview] = useState('')
const [postImage, setPostImage] = useState('')
const [postPreviewBox, setPostPreviewBox] = useState(false)

const {_id, username, connections} = currentUserParsed
const [formData, setFormData] = useState({
    from : username,
    recipient : "",
    message : ""
})

const setPostData = (value1, value2)=>{
    setAlertMsg({status : value1, msg : value2})
    setPostPreviewBox(false)
    setPostCreated(true)
    setFormValue('')
    setTimeout(()=>{
        setPostCreated(false)
    }, 3000)
}

const setFormValue = (e)=>{
    const name = e.target.name
    const value = e.target.value

    setFormData(prev =>{
        return {...prev, [name]: value}
    })
}



const selectPostPic = (e)=>{
    e.preventDefault()
    setPostImage(e.target.files[0])
}


useEffect(()=>{
    if(postImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setPostPicturePreview(fileReader.result)
        }
        fileReader.readAsDataURL(postImage)
        setPostPreviewBox(true)
    }else{
        return
    }
},[postImage])


//SEND MESSAGE

const sendMessage = async(e)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
    const userData = formData.recipient
    const recipientId = userData.split(' ')[0]
    const recipientUsername = userData.split(' ')[1]
    
  
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
                    senderId : _id,
                    senderUsername : username,
                    receiverId : recipientId,
                    receiverUsername : recipientUsername,
                    message : formData.message
                }
            }
    
            const result = await Axios(options)
            
            const {data, response} = result.data
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
            <Grid item xs={false} sm={2} className="compose-left">
            </Grid>
            <Grid item xs={12} sm={8} className="compose-center">
            <div className='compose-center-inner'>
            <h3>Compose Message</h3>
            <form className="compose-center-form">
                From: <input type='text'  value={username} name='from' className='forminput'/><br />
                To: <select type='text' onChange={()=>setFormValue()} name='recipient' className='forminput'><br />
                <option selected>Select Recipient</option>
                {
                allUsers.length > 1 && allUsers.map(allUser =>{
                    if(connections && connections.includes(allUser._id)){
                        const {_id, username} = allUser
                        
                        return <option value={`${_id} ${username}`} key = {_id}>{username}</option>
                            
                        
                    }
                    
                }) 

                }

                
                </select><br />
                <textarea type='text' onChange={setFormValue} placeholder='Your message' variant = 'contained'
                cols='20' rows='5' name='message' className='forminput'></textarea><br />
                
                <Button  className='formbutton' onClick={sendMessage}>Send</Button>
            </form>
            </div>
            <div className='compose-center-top-inner2'>
                 <label htmlFor='postPicture' >
                        <div className="homepage-center-input-item">
                            <FaImages className='homepage-center-input-icon' size='30'/> Picture
                       </div>
                     <input id='postPicture' type='file' name='postPic' className='compose-center-input2' 
                        onChange={selectPostPic}/>
                    </label>
                </div>  
                {postPreviewBox && 
                <div className='message-img-preview-box'>
                    <>
                        <img src={postPicturePreview} alt='Error loading preview' className='message-img-preview-2'/>
                        <Button onClick={()=>setPostPreviewBox(false)}>Cancel</Button>
                    </>
                </div>
                }
            </Grid>
            <Grid item xs={false} sm={2} className="compose-right">
            </Grid>
        </Grid>
    </div>
}


export default ComposeMessages