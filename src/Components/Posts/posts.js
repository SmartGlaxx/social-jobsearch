import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './posts.css'
import { Comments } from '../';
import { Button, Grid } from '@material-ui/core'
import Profile from "../../assets/profile.jfif"
import TimeAgo from 'timeago-react'
import { useEffect, useState } from 'react'
import {FaExclamationCircle, FaThumbsUp, FaComment, FaEllipsisH, FaShare, FaWindowClose, 
    FaPen, FaTrash, FaTelegramPlane} from 'react-icons/fa'
import axios from 'axios'
import { UseAppContext } from '../../Contexts/app-context'
import { Backdrop } from '../'


const Posts =({_id : id, userId, username, description, likes, createdAt, sharedDescription, sharedId, sharedUsername})=>{
    const {timelineposts, currentUser, setPostCreated, commentSent, setCommentSent} = UseAppContext()
    const [readMoreValue, setReadMoreValue] = useState(false)
    const [error, setError] = useState({status : false, msg:''})
    const [alertMsg, setAlertMsg] = useState({status : false, msg : ''})
    const [liked, setLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(likes.length)
    const postsurl = 'https://smart-job-search.herokuapp.com/api/v1/posts'
    const commentsurl = 'https://smart-job-search.herokuapp.com/api/v1/comments'
    const [comments , setComments] = useState([])
    const newComments = []
    const [commentForm, setCommentForm] = useState(false)
    const [commentValue, setCommentValue] = useState('')
    const [updateValue, setUpdateValue] = useState(description)
    // const [commentSent, setCommentSent] = useState(false)
    const [updateSent, setUpdateSent] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [showCommentOptions, setShowCommentOptions] = useState(false)
    const [showUpdatePostForm, setShowUpdatePostForm] = useState(false)
    const [showDeletePostDialog, setShowDeletePostDialog] = useState(false)
    const [shareForm, setShareForm] = useState(false)
    const [sharePostValue, setSharePostValue] = useState('')

    const {_id : currentUserLikeId} = JSON.parse(currentUser)

    const setFormForComment =()=>{
        setCommentForm(!commentForm)
        setShowUpdatePostForm(false)
    }
    const setFormForUpdate =()=>{
        setCommentForm(false)
        setShowUpdatePostForm(!showUpdatePostForm)
    }

    const setPostData = (value1, value2, value3)=>{
        setSharePostValue(value1)
        setShareForm(false)
        setPostCreated(value2)
        setTimeout(()=>{
            setPostCreated(value3)
        }, 3000)
    }
  
    //popover starts
    // const useStyles = makeStyles((theme) => ({
    //     typography: {
    //       padding: theme.spacing(2),
    //     },
    //   }));

    //   const classes = useStyles();
    //   const [anchorEl, setAnchorEl] = React.useState(null);
    
    //   const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    //   };
    
    //   const handleClose = () => {
    //     setAnchorEl(null);
    //   };
    
    //   const open = Boolean(anchorEl);
    //   const popOverId = open ? 'simple-popover' : undefined;
    
      //popover ends

    useEffect(()=>{
        if(likes.includes(currentUserLikeId)){
            setLiked(true)
        }
    },[])
    
    //set values for liked post
    const setLikedValue=(value1, value2)=>{
        setLiked(value1)
        const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
        
        const setLikedId=async(value)=>{
            
            const options = {
                url : `${postsurl}/${value}/${currentUserId}/${currentUserName}`,
                method : 'PATCH',
                headers : {
                    "Accept" : "Application/json",
                    "Content-Type" : "Application/json;charset=UTF-8"    
                }
            }
            
            const result = await axios(options)
            
            //fetch liked/unliked post
            const options2 ={
                url : `https://smart-job-search.herokuapp.com/api/v1/posts/${id}/${userId}/${username}`,
                method : "GET",
                headers : {
                   "Accept" : "Application/json",
                   "Content-Type" : "Application/json;charset=utf-8"
                }
            }
            const result2 = await axios(options2)
            const {data} = result2.data
            const {likes} = data
            
            if(likes.includes(currentUserLikeId)){
                setLikesCount(likes.length)
               return setLiked(true)
            }else{
                setLikesCount(likes.length)
                return setLiked(false)
            }
      
            
        }
        setLikedId(value2)
    }

    
//    console.log('value', likes.includes(currentUserLikeId), likes,  currentUserLikeId)
    //fetchComments
    const fetchComments = async(url)=>{
        // const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
        const options ={
            url : `https://smart-job-search.herokuapp.com/api/v1/comments/${id}`,
            method : "GET",
            headers : {
               "Accept" : "Application/json",
               "Content-Type" : "Application/json;charset=utf-8"
            }
        }
        const result = await axios(options)
        
        const {postComments} = result.data
        
        postComments.forEach(item => {
            if(item.postId === id){
                newComments.push(item)
            }
        });
       
        setComments(newComments)
    }

    useEffect(()=>{
        fetchComments(`${commentsurl}/${id}/${userId}/${username}`)
    },[commentSent])

    // fetch userId and userName using context
    

    // //post a comment
    const postComments = async(url)=>{
        const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
        const options ={
            url : `https://smart-job-search.herokuapp.com/api/v1/comments/${id}/${currentUserId}/${currentUserName}`,
            method : "POST",
            headers : {
               "Accept" : "Application/json",
               "Content-Type" : "Application/json;charset=utf-8"
            },
            data :{
                    postId : id,
                    userId : currentUserId,
                    username : currentUserName,
                    comment : commentValue
            }
        }
        const result = await axios(options)
        const {response} = result.data
        if(response == 'Success'){
            setCommentValue('')
            setCommentSent(!commentSent)
        }else{
            setError({status : true, msg : "Failed to post comment"})
        }
    }

//Update post
const postUpdate = async()=>{
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
        const options ={
            url : `https://smart-job-search.herokuapp.com/api/v1/posts/${id}`,
            method : "PATCH",
            headers : {
               "Accept" : "Application/json",
               "Content-Type" : "Application/json;charset=utf-8"
            },
            data :{
                userId : currentUserId,
                username : currentUserName,
                description : updateValue
            }
        }
        const result = await axios(options)
        const {response} = result.data
        if(response == 'Success'){
            setUpdateValue(updateValue)
            setShareForm(false)
            setPostCreated(true)
            setTimeout(()=>{
                setPostCreated(false)
            }, 3000)
        }else{
            setError({status : true, msg : "Failed to update post"})
        }
}

//Delete Post
const deletePost = async(id)=>{
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
    const options ={
        url : `https://smart-job-search.herokuapp.com/api/v1/posts/${id}`,
        method : "DELETE",
        headers : {
           "Accept" : "Application/json",
           "Content-Type" : "Application/json;charset=utf-8"
        },
        data :{
            userId : currentUserId,
            username : currentUserName
        }
    }
    const result = await axios(options)
    const {response} = result.data
    if(response == 'Success'){
        // setUpdateValue(updateValue)
        setPostCreated(true)
        setTimeout(()=>{
            setPostCreated(false)
        }, 3000)
    }else{
        setError({status : true, msg : "Failed to delete post"})
    }
}

//share a post

const sharePost = async(url)=>{
    //sharedId = ID of origina poster
    //sharedUsername = Username of origina poster
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
    const options ={
        url : `https://smart-job-search.herokuapp.com/api/v1/posts/${id}/${userId}/${username}`,
        method : "POST",
        headers : {
           "Accept" : "Application/json",
           "Content-Type" : "Application/json;charset=utf-8"
        },
        data :{
                userId : currentUserId,
                username : currentUserName,
                description : sharePostValue,
                sharedId : userId,
                sharedUsername : username,
                sharedDescription : description
        }
    }
    const result = await axios(options)
    const {response} = result.data

    
    if(response == 'Success'){
       setPostData("",true, false)
    }else{
        setError({status : true, msg : "Failed to share post"})
    }
}

const {_id : uId , username : userUsername} =  JSON.parse(currentUser)
    return <div className='posts' container > 
                {
                    error.status && <div className='errorNotice'><FaExclamationCircle />{error.msg}</div>
                }  
                {
                    showOptions && <div className='options-box'>
                    <FaWindowClose onClick={()=>setShowOptions(!showOptions)} className='close-btn'/><br />
                    <Button onClick={setFormForUpdate}>Update Post</Button><br />
                    <Button onClick={()=>setShowDeletePostDialog(!showDeletePostDialog)}>Delete Post</Button>
                    </div>
                }
                {
                    showDeletePostDialog && <div className='backdrop' onClick={()=>setShowDeletePostDialog(false)}>
                    <div className='delete-box' >
                        <form>
                            <Button onClick={()=>setShowDeletePostDialog(false)}>Cancel</Button>
                            <Button onClick={()=>deletePost(id)}>Delete Post</Button>
                        </form>
                    </div>
                    </div>
                }
                <div  className='postContainer' >
                { uId == userId && userUsername == username && <Button className='more-options'  onClick={()=>setShowOptions(!showOptions)}>
                     <FaEllipsisH  />
                 </Button>
                   }
                    
                <div className='post-top'>
                    <img src={Profile} alt={username}  className='profile-pic'/>
                    <div className='name'>{username}</div>
                    <TimeAgo datetime={createdAt} locale='en_US'/>
                </div>
                <div className='description'>{description.length > 150  && !readMoreValue ? description.slice(0, 150) + "...  "  : description }
                    {description.length > 150 &&
                        <button className='more-btn' onClick={()=>setReadMoreValue(!readMoreValue)}>{readMoreValue ? `Show Less` : `Show More`}</button>}
                </div>
                {sharedDescription && sharedDescription.length > 0 &&<div>
                        <div className='shared-box-info'>{`${username} shared a post by ${sharedUsername}`}</div>
                        <div className='shared-box'>
                            <div className='shared-description'>{sharedDescription}</div>
                            <div className='sharedname'>{sharedUsername}</div>
                        </div>
                    </div>
                }
                <div className='icons-box'>
                    <div className='icons-box-item'><FaThumbsUp className='icon-thumbsup-liked-alt' /> {likesCount}</div>
                    <div className='icons-box-item2'>{comments.length} Comments</div>
                </div>
                
                <div className='icons-box'>
                    <Button className='icons-box-item' onClick={()=>setLikedValue(!liked, id)}><FaThumbsUp className={liked ? `icon-thumbsup-liked` : `icon-thumbsup`} /> </Button>
                    <Button className='icons-box-item' onClick={setFormForComment}><FaComment className='icon-comment' /></Button>
                    <Button className='icons-box-item' onClick={()=>setShareForm(!shareForm)}><FaShare className='icon-comment' /></Button>
                </div>
                <div className={commentForm || showUpdatePostForm ? `comment-box-open` : `comment-box-close`}>
                    {
                     commentForm && <form>
                        <input type ='text' placeholder='Write a comment...' className='comment-input'
                        value = {commentValue} onChange={(e)=>setCommentValue(e.target.value)}/>
                        <Button style={{float:"right", marginTop:"-1.85rem"}} onClick={postComments}><FaTelegramPlane className='submit-icon'/></Button>
                    </form>
                    }
                    {
                        showUpdatePostForm &&  <form>
                        <input type ='text' className='comment-input'
                        value = {updateValue} onChange={(e)=>setUpdateValue(e.target.value)}/>
                        <Button style={{float:"right", marginTop:"-1.85rem"}} onClick={postUpdate}><FaTelegramPlane className='submit-icon'/></Button>
                    </form>
                    }
                    
                    <div className='users-comments'>
                        {comments.length > 0 && <h4>Comments</h4>}
                            {comments.map(comment =>{
                                const {_id} = comment
                                // const userFirstLetter = username.slice(0,1).toUpperCase()
                                // const userOtherLetters = username.slice(1)
                                // const newUsername = userFirstLetter + userOtherLetters
                                return <Comments key={_id} { ...comment} id={id}/>
                                // return <div className='comment-main' key={_id}>
                                    {/* { uId == userId && userUsername == username && <div className='comment-icons'>
                                        <button className='icon-btn'><FaPen  className='update-icon'/></button>
                                        <button className='icon-btn'><FaTrash  className='trash-icon'/></button>
                                    </div>} */}
                                    {/* { uId == userId && userUsername == username && <Button className='more-options'  onClick={()=>setShowCommentOptions(!showCommentOptions)}>
                                            <FaEllipsisH  />
                                        </Button>
                                    }
                                     {
                                        showCommentOptions && <div className='options-box'>
                                        <FaWindowClose onClick={()=>setShowCommentOptions(!showCommentOptions)} className='close-options'/><br />
                                        <Button onClick={setFormForUpdate}>Update Comment</Button><br />
                                        <Button onClick={()=>setShowDeletePostDialog(!showDeletePostDialog)}>Delete Comment</Button>
                                        <button className='icon-btn'><FaPen  className='update-icon'/></button>
                                        <button className='icon-btn'><FaTrash  className='trash-icon'/></button>
                                        </div>
                                    }
                                    <div className='comment-username'>{newUsername}</div>
                                    <div className='comment'>{userComment}</div>
                                <TimeAgo datetime={createdAt} locale='en_US' className='comment-timeago'/>
                                </div> */}
                            })}
                    </div>
                </div>
            </div>
            {
                shareForm && <div className='share-box'>
                    <div className='share-box-inner'>
                        <form className='share-input'>
                            <h4 className='title2'>Share this post</h4>
                        <FaWindowClose className='close-btn' onClick={()=>setShareForm(false)} />
                            <div className='shared-content'>
                                <div className='shared-item'>{description}</div>
                                <textarea type ='text' value={sharePostValue} onChange={(e)=>setSharePostValue(e.target.value)} className='share-input-box'></textarea>
                                    <Button className='share-btn'  onClick={sharePost}><FaShare className='icons2'/></Button>
                            </div>
                        </form>
                    </div>
                </div>
            }
    </div>
}

export default Posts




