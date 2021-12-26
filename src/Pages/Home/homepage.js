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
const {loggedIn, loading, setLazyLoading, lazyLoading, currentUser,timelineposts, allUsers, postcreated, 
    setPostCreated, currentUserParsed, fetchedUser} = UseAppContext()
const {_id : userId, username : userUsername, followings, followers, 
    profilePicture : userProfilePicture, coverPicture : userCoverPicture} = fetchedUser
const [formValue, setFormValue] = useState('')
const [error, setError] = useState({status : false, msg:''})
const {_id , username} = JSON.parse(currentUser)
const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})

let [page, setPage] = useState(0)
let [incrementor, setIncrementor] = useState(1)
const [timeline, setTimeline] = useState([])
const [arrayofArrayList, setArrayofArrayList] = useState([])

const [postPicturePreview, setPostPicturePreview] = useState('')
const [postImage, setPostImage] = useState('')
const [postPreviewBox, setPostPreviewBox] = useState(false)

const setValues = (e)=>{
    setFormValue(e.target.value)
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
// const setPostData = (value1, value2)=>{
//     setAlertMsg({status : value1, msg : value2})
//     setPostPreviewBox(false)
//     setPostCreated(true)
//     setFormValue('')
//     setTimeout(()=>{
//         setPostCreated(false)
//     }, 3000)
// }

//select post pic
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

// const submit = async(e)=>{
//     e.preventDefault()
//     const url = `https://smart-job-search.herokuapp.com/api/v1/posts`
//     if(!formValue){
//         setError({status : true, msg : "Pleae enter a text to post"})
//        return setTimeout(()=>{
//             setError({status : false, msg :''})
//         }, 4000)
//     }
//         const options = {
//             url: url,
//             method : "POST",
//             headers : {
//                 "Accept" : "application/json",
//                 "Content-Type" : "application/json;charset=UTF-8"
//             },
//             data:{
//                 userId : _id,
//                 username : username,
//                 description : formValue
                
//             }
//         }

//         const result = await Axios(options)
//         setFormValue('')
//         const {data, response} = result.data
    
//         if(response === 'Success'){ 
//             setPostData(true, "Your post has been submited")
            
//             // return window.location.href = '/'
//         }else if(response === 'Fail'){
//             const {message} = result.data
//             setError({status : true, msg : message})
//             setTimeout(()=>{
//                 setError({status : false, msg :''})
//             }, 4000)
//         }
// }

const submit = async(e)=>{
    e.preventDefault()
    const {_id , username} = currentUserParsed
  
    const url = `https://smart-job-search.herokuapp.com/api/v1/posts`
    if(postImage){    
    // if(formValue){
    //     setError({status : true, msg : "Pleae enter a text to post"})
    //    return setTimeout(()=>{
    //         setError({status : false, msg :''})
    //     }, 4000)
    // }

    
    const fd = new FormData()
    fd.append("image", postImage, postImage.name)

    const result = await Axios.post(`https://smart-job-search.herokuapp.com/api/v1/posts/uploadimage/${_id}/${username}`, fd)

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

if(loading || allUsers.length == 0){
    return <div style={{width: "100%",height : "100vh", 
    display: 'grid', placeItems: "center"}}>
       <LoadingIcons.Puff  stroke="#555" strokeOpacity={.9} />
   </div>
}

console.log('dsfdg postPreviewBox', postPreviewBox)
const {_id : idCurrent , username : usernameCurrent} = currentUserParsed


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
                {postPreviewBox && 
                    <div className='post-img-preview-box'>
                        <img src={postPicturePreview} alt='Error loading preview' className='post-img-preview-2'/>
                        <Button onClick={()=>setPostPreviewBox(false)}>Cancel</Button>
                    </div>
                    }
                <div className='homepage-center-top-inner2'>
                 <label htmlFor='postPicture' >
                        <div className="homepage-center-input-item">
                            <FaImages className='homepage-center-input-icon' size='30'/> Picture
                       </div>
                     <input id='postPicture' type='file' name='postPic' className='homepage-center-input2' 
                        onChange={selectPostPic}/>
                    </label>
                    <button className='post-btn' onClick={submit}>Post</button>
                </div>   
            </div>    
            <div className='homepage-center-middle'>
              {!timeline ? 
                <div style={{width: "100%",height : "100vh", 
                display: 'grid', placeItems: "center"}}>
                    <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
                </div> :
                timeline.length == 0 ? <>
                <h3>No posts yet. Follow other users and create posts</h3> 
                    <OtherUsers />
                <h4>People you may know</h4> 
                </>
                :
                <>
                <OtherUsers />
                {
                  timeline.map(item =>{
                    //   const {_id} = item
                      return <Posts key={item._id} {...item}/>
                  })
                }
                </>
              }   
            {
                lazyLoading && <div style={{width: "100%",height : "6rem", 
                display: 'grid', placeItems: "center"}}>
                    <LoadingIcons.Puff  stroke="#555" strokeOpacity={.9} />
                </div>
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
