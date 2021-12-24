import './messages.css'
import { Button, Grid } from "@material-ui/core"
import { UseAppContext } from "../../Contexts/app-context"
import { Topbar, Sidebar, Backdrop } from "../../Components"
import { useState } from 'react'
import Axios from 'axios'

const ComposeMessages = () =>{
const {currentUserParsed, allUsers} = UseAppContext()
const [error, setError] = useState({status : false, msg:''})
const {_id, username, connections} = currentUserParsed

const [formData, setFormData] = useState({
    from : username,
    recipient : "",
    message : ""
})

const setFormValue = (e)=>{
    const name = e.target.name
    const value = e.target.value

    setFormData(prev =>{
        return {...prev, [name]: value}
    })
}

//SEND MESSAGE

const sendMessage = async(e)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
    const userData = formData.recipient
    const recipientId = userData.split(' ')[0]
    const recipientUsername = userData.split(' ')[1]
    
  
    const url = `https://smart-job-search.herokuapp.com/api/v1/messages/${recipientId}/${recipientUsername}`
 
    // if(postImage){        
    // const fd = new FormData()
    // fd.append("image", postImage, postImage.name)

    // const result = await Axios.post(`https://smart-job-search.herokuapp.com/api/v1/posts/uploadimage/${_id}/${username}`, fd)

    // const {src : imgSrc} = result.data.image
        
    //     const options = {
    //         url: url,
    //         method : "POST",
    //         headers : {
    //             "Accept" : "application/json",
    //             "Content-Type" : "application/json;charset=UTF-8"
    //         },
    //         data:{
    //             userId : _id,
    //             username : username,
    //             description : formValue,
    //             img : imgSrc
    //         }
    //     }

    //     const result2 = await Axios(options)
    //     console.log("data now 2",result2)
    //     const {response, newPost} = result2.data
   
    //     if(response === 'Success' && newPost){ 
    //         setPostData(true, "Your post has been submited")
    //         // setPostcreated(!postcreated)
    //     }else if(response === 'Fail'){
            
    //         // setError({status : true, msg : message})
    //         setTimeout(()=>{
    //             setError({status : false, msg :''})
    //         }, 4000)
    //     }
    // }else{
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
            console.log(result)
        //     const {data, response} = result.data
        // //    console.log("data now",result)
        //     if(response === 'Success'){ 
        //         setPostData(true, "Your post has been submited")
                
        //         // return window.location.href = '/'
        //     }else if(response === 'Fail'){
        //         const {message} = result.data
        //         setError({status : true, msg : message})
        //         setTimeout(()=>{
        //             setError({status : false, msg :''})
        //         }, 4000)
        //     }
    // }
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
                To: <select type='text' onChange={setFormValue} name='to' name='recipient' className='forminput'><br />
                {
                allUsers.length > 1 && allUsers.map(allUser =>{
                    if(connections && connections.includes(allUser._id)){
                        const {_id, username} = allUser
                        
                        return <>
                            <option selected>Select Recipient</option>
                            <option value={`${_id} ${username}`} key = {_id}>{username}</option>
                            
                        </>
                    }
                    
                }) 

                }

                
                </select><br />
                <textarea type='text' onChange={setFormValue} placeholder='Your message' variant = 'contained'
                cols='20' rows='5' name='message' className='forminput'></textarea><br />
                
                <Button  className='formbutton' onClick={sendMessage}>Send</Button>
            </form>
            </div>
            </Grid>
            <Grid item xs={false} sm={2} className="compose-right">
            </Grid>
        </Grid>
    </div>
}


export default ComposeMessages