import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './userprofile.css'
import axios from 'axios'
import { Grid } from '@material-ui/core'
import { FaUserAlt, FaUsers, FaImages, FaExclamationCircle, FaHome, FaUser, FaCamera, FaEllipsisH } from 'react-icons/fa'
import { Dummy } from '../dummy'
import {Topbar, Sidebar, Backdrop, Posts} from '../../Components';
import { UseAppContext } from '../../Contexts/app-context'
import {Link, useNavigate} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
import Axios from 'axios'
import OtherUsers from '../../Components/OtherUsers/otherUsers'
import LoadingIcons from 'react-loading-icons'
import ProfileImage from '../../assets/profile.jpg'
import CoverImage from '../../assets/coverpic.jpg'
import Button from '@restart/ui/esm/Button'
import Profile from "../../assets/profile.jfif"
import { Timeline } from '@material-ui/icons'


const UserProfile =()=>{
const {loggedIn, setLoading, loading, setLazyLoading, lazyLoading, currentUser, currentUserParsed, allUsers, 
    postcreated, setPostCreated, tempAllUsers, setNewCurrentUser, setUserClicked, userClicked, setFetchedUser, 
    fetchedUser, setTestValue, testValue} = UseAppContext()
const [formValue, setFormValue] = useState('')
const [error, setError] = useState({status : false, msg:''})
const {_id : userId, username : userUsername, followings, followers, 
    profilePicture : userProfilePicture, coverPicture : userCoverPicture} = fetchedUser
// const {profilePicture : userProfilePicture, coverPicture : userCoverPicture} = currentUserParsed
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
const followurl = 'https://smart-job-search.herokuapp.com/api/v1/user/follow'
const unFollowurl = 'https://smart-job-search.herokuapp.com/api/v1/user/unfollow'
const getUserurl = `https://smart-job-search.herokuapp.com/api/v1/user/${userId}/${userUsername}`
const posturl = 'https://smart-job-search.herokuapp.com/api/v1/posts'
// const [userClicked, setUserClicked] = useState(false)
const [newPage, setNewPage] = useState(false)
// const [timelineposts, setTimelinePosts] = useState([])
const [profilePicture, setProfilePicture] = useState('')
const [timelineposts, setTimelinePosts] = useState([])
const [coverImage, setCoverImage] = useState('')
const [profileImage, setProfileImage] = useState('')
const [postImage, setPostImage] = useState('')
const [coverPicturePreview, setCoverPicturePreview] = useState('')
const [profilePicturePreview, setProfilePicturePreview] = useState('')
const [postPicturePreview, setPostPicturePreview] = useState('')
// const [profilereviewBox, setProfilereviewBox] = useState(false)
const [coverPreviewBox, setCoverPreviewBox] = useState(false)
const [profilePreviewBox, setProfilePreviewBox] = useState(false)
const [postPreviewBox, setPostPreviewBox] = useState(false)

// const [imageValue, setProfilePicture] = useState('')

//pagination constants
let [page, setPage] = useState(0)
let [incrementor, setIncrementor] = useState(1)
const [timeline, setTimeline] = useState([])
const [arrayofArrayList, setArrayofArrayList] = useState([])


const setValues = (e)=>{
    setFormValue(e.target.value)
}

const setUserCoverPicture = (value)=>{
    setCoverPreviewBox(false)
    setTestValue(value)
}

const setUserProfilePicture = (value)=>{
    setProfilePreviewBox(false)
    setTestValue(value)
}

//upload cover image and return url 

const uploadCoverPicture = async(value)=>{
    const  url =`${posturl}/uploadprofileimage/${userId}/${username}`

    const fd = new FormData()
    fd.append("image", value, value.name)

    const result = await axios.post(`https://smart-job-search.herokuapp.com/api/v1/user/uploadcoverimage/${userId}/${username}`, fd)
    
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
        setUserCoverPicture(message)
    }else if(response == 'Fail'){
       setError({status : true, msg : "Fialed to upload profile image"})
       return setTimeout(()=>{
            setError({status : false, msg :''})
    }, 4000)
    }
}

//upload profile image and return url 
const uploadProfilePicture = async(value)=>{
    const  url =`${posturl}/uploadprofileimage/${userId}/${username}`

    const fd = new FormData()
    fd.append("image", value, value.name)

    const result = await axios.post(`https://smart-job-search.herokuapp.com/api/v1/user/uploadprofileimage/${userId}/${username}`, fd)

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
            profilePicture : imgSrc
        }
    }

    
    const result2 = await Axios(options)

    const {response, message} = result2.data
    
    if(response == 'Success' && message){
        setUserProfilePicture(message)
    }else if(response == 'Fail'){
       setError({status : true, msg : "Fialed to upload profile image"})
       return setTimeout(()=>{
            setError({status : false, msg :''})
    }, 4000)
    }
}


//select cover pic
const selectCoverPic = (e)=>{
    e.preventDefault()
    setCoverImage(e.target.files[0])
}

//select profile picture
const selectProfilePic = (e)=>{
    e.preventDefault()
    setProfileImage(e.target.files[0])
}

//select post pic
const selectPostPic = (e)=>{
    e.preventDefault()
    setPostImage(e.target.files[0])
}

useEffect(()=>{
    if(coverImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setCoverPicturePreview(fileReader.result)
        }
        fileReader.readAsDataURL(coverImage)
        setCoverPreviewBox(true)
        setProfilePreviewBox(false)
        setPostPreviewBox(false)
    }else{
        return
    }
},[coverImage])

useEffect(()=>{
    if(profileImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setProfilePicturePreview(fileReader.result)
        }
        fileReader.readAsDataURL(profileImage)
        setProfilePreviewBox(true)
        setCoverPreviewBox(false)
        setPostPreviewBox(false)
    }else{
        return
    }
},[profileImage])


useEffect(()=>{
    if(postImage){
        const fileReader = new FileReader()
        fileReader.onloadend = ()=>{
            setPostPicturePreview(fileReader.result)
        }
        fileReader.readAsDataURL(postImage)
        setPostPreviewBox(true)
        setCoverPreviewBox(false)
        setProfilePreviewBox(false)
    }else{
        return
    }
},[postImage])




// if(followings == undefined){
//     followings = currentUser.followings    
// }



const {id, username} = useParams()

useEffect(()=>{
    fetchUser(`https://smart-job-search.herokuapp.com/api/v1/user/${id}/${username}`)
},[postcreated, id, username, testValue])


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

        const {response, allPosts} = result.data
        if(response == 'Success' && allPosts){
            
           const newTimelinePosts = allPosts.sort((a,b)=>{
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

},[id, username, userClicked, postcreated])

const fetchUser = async(fetchurl)=>{
    const result = await axios(fetchurl)
    const fetchedUserVal = result.data.data 
    
    setFetchedUser(fetchedUserVal)

}

const setPostData = (value1, value2)=>{
    setAlertMsg({status : value1, msg : value2})
    setPostPreviewBox(false)
    setPostCreated(true)
    setFormValue('')
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

//FOLLOW USER
const follow =async(e, id, followedUsername)=>{
    e.preventDefault()
    const {_id , username} = JSON.parse(currentUser)
   
        const options = {
            url: `${followurl}/${id}/${followedUsername}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username                
            }
        } 
       
        const result = await axios(options)
        
        if(result.data.response == "Success"){
          
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            
            if(data){
                // window.location.href='/' 
                // setValues(true, data)

                setTestValue(!testValue)
                setPostCreated(true)
                setTimeout(()=>{
                    setPostCreated(false)
                }, 3000)
            } 
        }else{
            setAlertMsg({status : true, msg : 'An error occured while following'})  
        }       
        
    // }

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
                setPostCreated(true)
                setTimeout(()=>{
                    setPostCreated(false)
                }, 3000)
            } 
        }else{
            setAlertMsg({status : true, msg : 'An error occured while following'})  
        }       
        
    // }

}


//CONNECTION REQUEST TO USER
const connectRequest =async(e, value1, value2)=>{
    e.preventDefault()
    
    const {_id , username} = currentUserParsed
   
        const options = {
            url : `https://smart-job-search.herokuapp.com/api/v1/user/connectrequest/${value1}/${value2}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username                
            }
        } 
        
        const result = await axios(options)
      
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                // window.location.href=`/userprofile/${_id}/${username}`
                // setDataValues(true, data)
            } 
        }else{
            setAlertMsg({status : true, msg : 'Failed to send request from user'})  
        }       
        
    // }

}



//DISCONNECTION REQUEST TO USER
const disconnectRequest =async(e, value1, value2)=>{
    e.preventDefault()
    
    const {_id , username} = currentUserParsed
   
        const options = {
            url : `https://smart-job-search.herokuapp.com/api/v1/user/disconnectrequest/${value1}/${value2}`,
            method : "PATCH",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            },
            data:{
                userId : _id,
                username : username                
            }
        } 
        
        const result = await axios(options)
      
        if(result.data.response == "Success"){
            const reponse_2 = await axios(getUserurl)
            const {data} = reponse_2.data
            if(data){
                setTestValue(!testValue)
                // window.location.href=`/userprofile/${_id}/${username}`
                // setDataValues(true, data)
            } 
        }else{
            setAlertMsg({status : true, msg : 'Failed to disconnect from user'})  
        }       
        
    // }

}


const submit = async(e)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
    const url = `https://smart-job-search.herokuapp.com/api/v1/posts`
    if(postImage){    
  
    const fd = new FormData()
    fd.append("image", postImage, postImage.name)

    const result = await axios.post(`https://smart-job-search.herokuapp.com/api/v1/posts/uploadimage/${userId}/${username}`, fd)

    const {src : imgSrc} = result.data.image
        
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
                description : formValue,
                img : imgSrc
            }
        }

        const result2 = await Axios(options)
        console.log("data now 2",result2)
        const {response, newPost} = result2.data
   
        if(response === 'Success' && newPost){ 
            setPostData(true, "Your post has been submited")
            // setPostcreated(!postcreated)
        }else if(response === 'Fail'){
            
            // setError({status : true, msg : message})
            setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
    }else{
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
        //    console.log("data now",result)
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
}


//Pagination
//create pagination to break timelineposts which
//would be a huge array into smaller bits of 
//arrays containing arrays. That way, when you
//access an array, it'll show a specific number
//of items n a page(You choose 10 items oer page)

const paginate = (value)=>{

    const itemsPerPage = 4
    const numberOfPages = Math.ceil(value.length / itemsPerPage)


    const newArray = Array.from({length : numberOfPages},(_, index)=>{
        const startNum = index * itemsPerPage
        const endNum = itemsPerPage * incrementor
        return value.slice(startNum, endNum)

    })
    return newArray

}
//call the paginate to use/ break-up the timelineposts
//-paginate breaks the long array (timelineposts) down using the code above
//-it creats an array of arrays called arrayOfArrays
//-items in each page can now be accessed in the arrayOfArrays 
//by using an index (called page) which can be altered using a button to change 
//its default index from 0 to anu number  
//the page should display new items when the page number is changed

useEffect(()=>{
    const arrayOfArrays = paginate(timelineposts)
    setTimeline(arrayOfArrays[page])
    setArrayofArrayList(arrayOfArrays)
},[timelineposts, incrementor])

//set an incrementor to increase everytime the documents total height
//plus 50 is equal to the scrollY - scrolled vertical distance plus
//the windows inner height or display height. Now use the incremented
//value as the endpoint for the new set of documents in arrayOfArrays.
//so the page remains on 0, while the start point remians on 1st array of 
//page 0, and the endpoint extends with increase in the incrementor
useEffect(()=>{
    const fetchItems = ()=>{
        if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 2){
            setLazyLoading(true)
            setTimeout(()=>{
                setIncrementor(incrementor++)
                setLazyLoading(false)
            },3000)
            
        }
    }
    const event = window.addEventListener('scroll', fetchItems)
    return ()=> window.removeEventListener('scroll', event)
},[])
 
if(loggedIn == false){
    return window.location.href = '/login'
}
// console.log(timeline)
if(loading || allUsers.length == 0 || !username && !timelineposts || !fetchedUser.followings){
    return <div style={{width: "100%",height : "100vh", 
    display: 'grid', placeItems: "center"}}>
       <LoadingIcons.Puff  stroke="#555" strokeOpacity={.9} />
   </div>
}



const {_id : idCurrent , username : usernameCurrent} = currentUserParsed

const firstLetter = username[0]
const otherLettes = username.slice(1)
const usernameCapitalized = firstLetter.toUpperCase() + otherLettes
    return <>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <Grid className='profile' container > 
        <Grid className='profile-left-border' item xs={false} sm={1} ></Grid> 
        

        <Grid className='profile-center'item xs={12} sm={10} container>
            

            <Grid className='profile-center-left' item sm={false} md={1} ></Grid>
            
             <Grid className='profile-top'  item xs={12}> 
                {/* <img src = {CoverImage} alt='Cover Image' className='cover-image'/> */}
                { <img src={userCoverPicture ? userCoverPicture : CoverImage} alt='Cover Image' className='cover-image' />}
                {coverPreviewBox && 
                    <div className='cover-img-preview-box'>
                        <img src={coverPicturePreview} alt='Error loading preview' className='cover-img-preview'/>
                        <div className='pic-upload-btn'>
                            <Button onClick={()=>setCoverPreviewBox(false)}>Cancel</Button>
                            <Button onClick={()=>uploadCoverPicture(coverImage)}>Upload Picture</Button>
                        </div>
                    </div>
                    }
                <form className="cover-label-box" enctype="multipart/form-data">
                        {idCurrent == userId && usernameCurrent == userUsername && <label htmlFor='coverPicture'  >
                            <div className="cover-label-box-inner" > 
                                <FaCamera  className='img-upload-icon' size='30' /> 
                          </div>
                        <input id='coverPicture' type='file' name='coverPic' className='homepage-center-input2' 
                        onChange={selectCoverPic}/>
                        </label>}
                        {/* <button className='post-btn' onClick={submit}>Post</button> */}
                    </form>
                <Grid className='profile-img-box' container>
                <Grid item xs={12} sm={3}>
                   { <img src={userProfilePicture ? userProfilePicture : ProfileImage} alt='Profile Image' className='profile-img' />}
                    {profilePreviewBox && 
                    <div className='profile-img-preview-box'>
                        <img src={profilePicturePreview} alt='Error loading preview' className='profile-img-preview'/>
                        <div className='pic-upload-btn'>
                            <Button onClick={()=>setProfilePreviewBox(false)}>Cancel</Button>
                            <Button onClick={()=>uploadProfilePicture(profileImage)}>Upload Picture</Button>
                        </div>
                    </div>
                    }
                    <form className="profile-label-box" enctype="multipart/form-data">
                        {idCurrent == userId && usernameCurrent == userUsername && <label htmlFor='profilePicture'  >
                            <div className="profile-label-box-inner">
                                <FaCamera  className='img-upload-icon' size='30'/> 
                          </div>
                        <input id='profilePicture' type='file' name='profilePic' className='homepage-center-input2' 
                        onChange={selectProfilePic}/>
                        </label>}
                        {/* <button className='post-btn' onClick={submit}>Post</button> */}
                    </form>
                    <div className='profile-summary-desktop'>
                        <h1 className='username'>{usernameCapitalized}</h1>
                        <div className='-followings'>{`Following : ${followings.length}`}</div>
                        <div className='-followings'>{`Followers : ${followers.length}`}</div>
                    </div>
                </Grid>
                <Grid className='profile-summary' item xs={12} sm={5}> 
                    <div className='profile-summary-inner'>
                        <h1 className='username'>{usernameCapitalized}</h1>
                        <div className='-followings'>{`Following : ${followings.length}`}</div>
                        <div className='-followings'>{`Followers : ${followers.length}`}</div>
                    </div>
                </Grid>
                <Grid className='btn-box' item xs={12} sm={4}>
                    
                { idCurrent == userId && usernameCurrent == userUsername ?
                    <Button className='btn'>Edit Profile</Button> : 
                    <>
                    <div className='other-userbtn1'>
                        <FaEllipsisH />
                    </div>
                    <div className='other-userbtn2'>
                        {  currentUserParsed && !currentUserParsed.followings.includes(userId) ?
                            <Button className='btn' onClick={(e)=>follow(e, userId, userUsername)}>Follow</Button>
                        : <Button className='btn' onClick={(e)=>unfollow(e, userId, userUsername)}>Unfollow</Button>
                        }
                        { currentUserParsed && !currentUserParsed.connections.includes(userId) &&
                            <Button onClick={(e)=>connectRequest(e, id, username)} className='btn'>
                            { !currentUserParsed.sentConnectionRequests.includes(userId) ? `Connect Request` : 
                            !currentUserParsed.receivedConnectionRequests.includes(userId) ? `Cancel Request` : null }
                        </Button>}
                    { currentUserParsed && currentUserParsed.connections.includes(userId) &&
                    <Button className='btn' onClick={(e)=>disconnectRequest(e, userId, userUsername)}>Disconnect</Button>}
                        <Button className='btn'>Send Message</Button>
                    </div>
                </>
                }
                </Grid>
            </Grid>
            </Grid>
            
            <Grid className='profile-center-right' item sm={false} md={1} ></Grid>
            
            <Grid className=''item sm={12}  container >
            
            <Grid className='profile-center-inner-left'item sm={12} md={6} style={{marginTop:"10rem"}}>
                
            <div className='profile-center-inner-left-1' >
                <div className='profile-center-inner-left-2'>
                    <h3>My Bio</h3>
                    <h4>Description here</h4>
                    { idCurrent == userId && usernameCurrent == userUsername &&
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
                                <button onClick={(e)=>unfollow(e, id, username)} className='follow-btn'>
                                    {newUserFollowings  && newUserFollowings.includes(allUser._id) ? `Unfollow` : `Follow`}</button>
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
                                {  allUser._id != currentUserParsed._id  && newUserFollowings &&
                                    <button onClick={(e)=>unfollow(e, id, username)} className='follow-btn'>{ newUserFollowings.includes(allUser._id) ? `Unfollow` : `Follow`}</button>}
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
                { <img src={userProfilePicture ? userProfilePicture : ProfileImage} alt='Profile Image' className='profile-img-2' />}
                    <input type='hidden' name='userId' />
                    <input type='hidden'  name='username'/>
                   
                     <input type='text' name='post-input' placeholder='Make a post' className='profile-center-input' 
                    value={formValue} onChange={setValues}/>
                </div>     
                {
                    error.status && <div className='errorNotice'><FaExclamationCircle />{error.msg}</div>
                }   
                <hr className='profile-center-top-hr'/>
                    {postPreviewBox && 
                    <div className='post-img-preview-box'>
                        <img src={postPicturePreview} alt='Error loading preview' className='post-img-preview'/>
                    </div>
                    }
                <div className='profile-center-top-inner2' >
                {idCurrent == userId && usernameCurrent == userUsername && <label htmlFor='postPicture'  >
                        <div className="profile-center-input-item">
                            <FaImages className='profile-center-input-icon' size='30'/> Picture
                       </div>
                     <input id='postPicture' type='file' name='postPic' className='profile-center-input2' 
                        onChange={selectPostPic}/>
                    </label>}
                    <button className='post-btn' onClick={submit}>Post</button>
                </div>     
            </div> 
           
            }
            <div className='profile-center-middle'>
              {!timeline  ?
              <div style={{width: "100%",height : "100vh", 
              display: 'grid', placeItems: "center"}}>
                 <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
             </div> :
                <>
                    {
                    timeline.map(item =>{
                        const {id} = item
                        return <Posts key={id} {...item}/>
                    })
                    }
                </>
              }   
            </div>
            {
                lazyLoading &&  (timelineposts.length > arrayofArrayList.length) && <div style={{width: "100%",height : "6rem", 
                display: 'grid', placeItems: "center"}}>
                    <LoadingIcons.Puff  stroke="#555" strokeOpacity={.9} />
                </div>
            }
            </Grid>

            </Grid>
            <Grid className='profile-center-right' item sm={12}  ></Grid> 
        </Grid>
        
        <Grid className='profile-right-border' item xs={false} sm={1} ></Grid>
    </Grid>
    </>
}

export default UserProfile
