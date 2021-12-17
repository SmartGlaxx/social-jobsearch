import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './userprofile.css'
import axios from 'axios'
import { Grid } from '@material-ui/core'
import { FaUserAlt, FaUsers, FaImages, FaExclamationCircle, FaHome, FaUser } from 'react-icons/fa'
import { Dummy } from '../dummy'
import {Topbar, Sidebar, Backdrop, Posts} from '../../Components';
import { UseAppContext } from '../../Contexts/app-context'
import {Link, useNavigate} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
import Axios from 'axios'
import OtherUsers from '../../Components/OtherUsers/otherUsers'
import LoadingIcons from 'react-loading-icons'
import ProfileImage from '../../assets/profile.jfif'
import CoverImage from '../../assets/cover.jfif'
import Button from '@restart/ui/esm/Button'
import Profile from "../../assets/profile.jfif"

const UserProfile =()=>{
const {loggedIn, setLoading, loading, currentUser, currentUserParsed, allUsers, postcreated, setPostCreated,
tempAllUsers, setNewCurrentUser, setUserClicked, userClicked, setFetchedUser, fetchedUser, setTestValue, testValue} = UseAppContext()
const [formValue, setFormValue] = useState('')
const [error, setError] = useState({status : false, msg:''})
const {_id : userId, username : userUsername, followings, followers} = fetchedUser
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
const unFollowurl = 'https://smart-job-search.herokuapp.com/api/v1/user/unfollow'
const getUserurl = `https://smart-job-search.herokuapp.com/api/v1/user/${userId}/${userUsername}`
const posturl = 'https://smart-job-search.herokuapp.com/api/v1/posts'
// const [userClicked, setUserClicked] = useState(false)
const [newPage, setNewPage] = useState(false)
const [timelineposts, setTimelinePosts] = useState([])

const setValues = (e)=>{
    setFormValue(e.target.value)
}

// if(followings == undefined){
//     followings = currentUser.followings    
// }



const {id, username} = useParams()

useEffect(()=>{
    fetchUser(`https://smart-job-search.herokuapp.com/api/v1/user/${id}/${username}`)
},[id, username])


// let lastUrl = window.location.href; 
// new MutationObserver(() => {
//   const url = window.location.href;
//   if (url !== lastUrl) {
//     lastUrl = url;
//     onUrlChange();
//   }
// }).observe(document, {subtree: true, childList: true});


function onUrlChange() {
  setNewPage(true)
  setTimeout(()=>{
    setNewPage(false)
  },1000)
}



///forget these

    // if(userId != id && username != userUsername){ 
    //     fetchUser(`https://smart-job-search.herokuapp.com/api/v1/user/${id}/${username}`)
    // }


    const fetchTimelinePosts = async(url)=>{
        const options = {
            url: url,
            method : "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            }
        }
       // dispatch({type : LOADING, payload : true})
    
        const result = await Axios(options)

        const {response, data} = result.data
        if(response == 'Success'){
            
           const newTimelinePosts = data.sort((a,b)=>{
               return new Date(b.createdAt) - new Date(a.createdAt)
           })
           setTimelinePosts(newTimelinePosts)
        }else if(response == 'Fail'){
           setError({status : true, msg : "Fialed to fetch timeline posts"})
           return setTimeout(()=>{
                setError({status : false, msg :''})
        }, 4000)
        }
        
    }

useEffect(()=>{
    fetchTimelinePosts(`${posturl}/${id}/${username}/timeline`)

},[id, username, userClicked])

const fetchUser = async(fetchurl)=>{
    const result = await axios(fetchurl)
    const fetchedUserVal = result.data.data 
    
    setFetchedUser(fetchedUserVal)

}

const setPostData = (value1, value2)=>{
    setAlertMsg({status : value1, msg : value2})
    setPostCreated(true)
    setTimeout(()=>{
        setPostCreated(false)
    }, 3000)
}
const setDataValues = (value, data)=>{
    setNewCurrentUser(data)
    setLoading(value)
}
let newUserFollowings  = []
if(currentUserParsed){
     newUserFollowings = currentUserParsed.followings
}




//UNFOLLOW USER
const unfollow =async(e, id, followedUsername)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
   
        const options = {
            url: `${unFollowurl}/${id}/${followedUsername}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                userUsername : username                
            }
        } 
       
        const result = await axios(options)
        console.log(result)
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                // window.location.href=`/userprofile/${_id}/${username}`
                // setDataValues(true, data)
            } 
        }else{
            setAlertMsg({status : true, msg : 'An error occured while following'})  
        }       
        
    // }

}

const submit = async(e)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
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

        const {data, response} = result.data
       console.log(data)
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

if(loading || allUsers.length == 0 || !username && !timelineposts || !fetchedUser.followings){
    return <div style={{width: "100%",height : "100vh", 
    display: 'grid', placeItems: "center"}}>
       <LoadingIcons.Puff  stroke="#555" strokeOpacity={.9} />
   </div>
}

const {_id : idCurrent , username : usernameCurrent} = currentUserParsed

const firstLetter = username[0]
const otherLettes = username.slice(1)
const usernameCpitalized = firstLetter.toUpperCase() + otherLettes
    return <>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <Grid className='profile' container > 
        <Grid className='profile-left-border' item xs={false} sm={1} ></Grid> 
        

        <Grid className='profile-center'item xs={12} sm={10} container>
            

            <Grid className='profile-center-left' item sm={false} md={1} ></Grid>
            
             <Grid className='profile-top'  item xs={12}> 
                <img src ={CoverImage} alt='Cover Image' className='cover-image'/>
                <div className='profile-img-box'>
                    <img src={ProfileImage} alt='Profile Image' className='profile-img' />
                <div className='profile-summary'> 
                    <div>
                        <h1>{usernameCpitalized}</h1>
                        <div>{`Following : ${followings.length}`}</div>
                        <div>{`Followers : ${followers.length}`}</div>
                    </div>
                </div>
                <div className='btn-box'>
                    
                { idCurrent == userId && usernameCurrent == userUsername ?
                    <Button className='btn'>Edit Profile</Button> :
                    <Button className='btn'>Send Message</Button>
                }
                </div>
            </div>
            </Grid>
            
            <Grid className='profile-center-right' item sm={false} md={1} ></Grid>
            
            <Grid className=''item sm={12}  container >
            
            <Grid className='profile-center-inner-left'item sm={12} md={6} style={{marginTop:"10rem"}}>
                
            <div className='profile-center-inner-left-1' >
                <div className='profile-center-inner-left-2'>
                    <h3>My Bio</h3>
                    <h4>Description here</h4>
                    { 
                        id == userId && username == userUsername &&
                     <><Button className='bio-btn'>Edit Bio</Button><br/></>
                    }
                    <div className='icons-box'>
                        <FaHome className='icons'/> Lives in  City here
                    </div>
                    <div className='icons-box'>
                        <FaUser className='icons'/> A brife descrption headers
                    </div>
                    <div className='icons-box'>
                        <FaUsers className='icons'/> Followed by {followers.length} users
                    </div>
                </div>   
              <hr className='profile-center-top-hr' />
              <h3>Following</h3>
              <div className='connections-box'>
              {
            allUsers.length == 0 ? 
            <div style={{width: "100%",height : "7rem", 
                display: 'grid', placeItems: "center"}}>
                <LoadingIcons.Puff stroke="#555" strokeOpacity={.9} />
            </div>:
               fetchedUser ?
            allUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, followings} = fetchedUser
                      if(allUser._id !== _id && followings.includes(allUser._id)){
                        return <div key={id} className='otherUsers-inner'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="follow-img"/>
                            </Link>
                            <div className='follow-name'>{username}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>unfollow(e, id, username)} className='follow-btn'>{newUserFollowings.includes(allUser._id) ? `Unfollow` : `Follow`}</button>
                            </form>
                        </div>
                     }
                })
                : null
            
           }
           </div>
           <h3>Followers</h3>
              <div className='connections-box'>
              {
            allUsers.length == 0 ? 
            <div style={{width: "100%",height : "7rem", 
                display: 'grid', placeItems: "center"}}>
                <LoadingIcons.Puff stroke="#555" strokeOpacity={.9} />
            </div>:
               fetchedUser ?
            allUsers.map(allUser => {
                const {_id : id, username} = allUser
                const {_id, followers} = fetchedUser
                      if(allUser._id !== _id && followers.includes(allUser._id)){
                        return <div key={id} className='otherUsers-inner'>
                            <Link to={`/userprofile/${allUser._id}/${username}`} onClick={()=>setUserClicked(!userClicked)}>
                                <img src={Profile} alt={username} className="follow-img"/>
                            </Link>
                            <div className='follow-name'>{username}</div>
                            <form>
                                <br/>
                                <button onClick={(e)=>unfollow(e, id, username)} className='follow-btn'>{ newUserFollowings.includes(allUser._id) ? `Unfollow` : `Follow`}</button>
                            </form>
                        </div>
                     }
                })
                : null
            
           }
           </div>
           <hr className='profile-center-top-hr' />
            </div>    
            </Grid>
            <Grid className='profile-center-inner-right'item sm={12} md={6} style={{marginTop:"10rem"}}>
            { idCurrent == userId && usernameCurrent == userUsername &&
            <div className='profile-center-top' >
                <div className='profile-center-top-inner'>
                    <FaUserAlt className='icon' size='30'/>
                    <input type='hidden' name='userId' />
                    <input type='hidden'  name='username'/>
                    <input type='text' name='post-input' placeholder='Make a post' className='profile-center-input' 
                    value={formValue} onChange={setValues}/>
                </div>     
                {
                    error.status && <div className='errorNotice'><FaExclamationCircle />{error.msg}</div>
                }   
                <hr className='profile-center-top-hr'/>
                <div className='profile-center-top-inner2' >
                    <label htmlFor='picture' >
                        <div className="profile-center-input-item">
                            <FaImages className='profile-center-input-icon' size='30'/> Picture
                       </div>
                     <input id='picture' type='file' className='profile-center-input2'/>
                    </label>
                    <button className='post-btn' onClick={submit}>Post</button>
                </div>     
            </div> 
            }
            <div className='profile-center-middle'>
              {!timelineposts ?
              <div style={{width: "100%",height : "100vh", 
              display: 'grid', placeItems: "center"}}>
                 <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
             </div> :
                <>
                    {
                    timelineposts.map(item =>{
                        const {id} = item
                        return <Posts key={id} {...item}/>
                    })
                    }
                </>
              }   
            </div>
            </Grid>

            </Grid>
            <Grid className='profile-center-right' item sm={12}  ></Grid> 
        </Grid>
        
        <Grid className='profile-right-border' item xs={false} sm={1} ></Grid>
    </Grid>
    </>
}

export default UserProfile
