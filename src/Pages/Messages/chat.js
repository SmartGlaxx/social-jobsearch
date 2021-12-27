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
        const filtredForNull = fetchedMsg.filter(item => item !== null)
        const fetchedMsgSorted = filtredForNull.sort((a,b)=>{
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
                        return <div className='otherUserChat'>
                        {chat}
                    </div>  
                    }
               
            })
        }
        {/* <input type = 'text' value={}  onChange={()=>setFormValue()} name='recipient' className='forminput' />




        To: <select type='text' onChange={()=>setFormValue()} name='recipient' className='forminput'><br />
                <option selected>Select Recipient</option>
                {
                allUsers.length > 1 && allUsers.map(allUser =>{
                    if(connections && connections.includes(allUser._id)){
                        const {_id, username} = allUser
                        
                        return <option value={`${_id} ${username}`} key = {_id}>{username}</option>
                            
                        
                    }
                    
                }) 

                } */}

                
                {/* </select><br />
                <textarea type='text' onChange={setFormValue} placeholder='Your message' variant = 'contained'
                cols='20' rows='5' name='message' className='forminput'></textarea><br /> */}









            </Grid>
         <Grid item xs={false} sm={3} className="inbox-left">
        </Grid>
    </Grid>
    </div>
}

export default Chat