import { useEffect, useState } from 'react'
import './homepage.css'
import { Grid } from '@material-ui/core'
import { FaUserAlt, FaImages, FaExclamationCircle } from 'react-icons/fa'
import { UseAppContext } from '../../Contexts/app-context'
import {Topbar, Sidebar, Backdrop, Posts} from '../../Components';
import {Link, useNavigate} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
import Axios from 'axios'
import OtherUsers from '../../Components/OtherUsers/otherUsers'
import LoadingIcons from 'react-loading-icons'
import Button from '@restart/ui/esm/Button'

const HomePage =()=>{
const {loggedIn, loading, currentUser,timelineposts, allUsers, postcreated, setPostCreated} = UseAppContext()
const [formValue, setFormValue] = useState('')
const [error, setError] = useState({status : false, msg:''})
const {_id , username} = JSON.parse(currentUser)
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})

const setValues = (e)=>{
    setFormValue(e.target.value)
}

const setPostData = (value1, value2)=>{
    setAlertMsg({status : value1, msg : value2})
    setPostCreated(true)
    setTimeout(()=>{
        setPostCreated(false)
    }, 3000)
}




const submit = async(e)=>{
    e.preventDefault()
    const url = `https://smart-job-search.herokuapp.com/api/v1/posts`
    if(!formValue){
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
                userId : _id,
                username : username,
                description : formValue
                
            }
        }

        const result = await Axios(options)
        setFormValue('')
        const {data, response} = result.data
    
        if(response === 'Success'){ 
            setPostData(true, "Your post has been submited")
            
            // return window.location.href = '/'
        }else if(response === 'Fail'){
            const {message} = result.data
            setError({status : true, msg : message})
            setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
}

if(loggedIn == false){
    return window.location.href = '/login'
}

if(loading || allUsers.length == 0){
    return <div style={{width: "100%",height : "100vh", 
    display: 'grid', placeItems: "center"}}>
       <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
   </div>
}



    return <>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <Grid className='homepage' container > 
        <Grid className='homepage-left' item xs={false} sm={3} >
            <div className='homepage-left-inner' >
                <div className='homepage-left-top'>
                <Link to={`/userprofile/${_id}/${username}`}>
                    <FaUserAlt /> {username}
                </Link>
                </div>
                <ul className='homepage-left-ul'>
                    <li className='homepage-left-li'>
                       <Link to={`/connections/${_id}/${username}`}><Button>Connections</Button></Link>
                    </li>
                    <li className='homepage-left-li'>
                        My Connections
                    </li>
                    <li className='homepage-left-li'>
                        Jobs
                    </li>
                </ul>
            </div>
        </Grid>
        <Grid className='homepage-center'item xs={12} sm={6} >
            <div className='homepage-center-top'>
                <div className='homepage-center-top-inner'>
                <Link to={`/userprofile/${_id}/${username}`}>
                    <FaUserAlt className='icon' size='30'/>
                </Link>
                    <input type='hidden' name='userId' />
                    <input type='hidden'  name='username'/>
                    <input type='text' name='post-input' placeholder='Make a post' className='homepage-center-input' 
                    value={formValue} onChange={setValues}/>
                </div>     
                {
                    error.status && <div className='errorNotice'><FaExclamationCircle />{error.msg}</div>
                }   
                <hr className='homepage-center-top-hr'/>
                <div className='homepage-center-top-inner2'>
                    <label htmlFor='picture' >
                        <div className="homepage-center-input-item">
                            <FaImages className='homepage-center-input-icon' size='30'/> Picture
                       </div>
                     <input id='picture' type='file' className='homepage-center-input2'/>
                    </label>
                    <button className='post-btn' onClick={submit}>Post</button>
                </div>     
            </div>    
            <div className='homepage-center-middle'>
              {!timelineposts ? 
                <div style={{width: "100%",height : "100vh", 
                display: 'grid', placeItems: "center"}}>
                    <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
                </div> :
                timelineposts.length == 0 ? <>
                <h3>No posts yet. Follow other users and create posts</h3> 
                    <OtherUsers />
                <h4>People you may know</h4> 
                </>
                :
                <>
                <OtherUsers />
                {
                  timelineposts.map(item =>{
                    //   const {_id} = item
                      return <Posts key={item._id} {...item}/>
                  })
                }
                </>
              }   
            </div>
        </Grid>
        <Grid className='homepage-right' item xs={false} sm={3} >
            three
        </Grid>
    
    </Grid>
    </>
}

export default HomePage
