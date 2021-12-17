    import React from 'react';
    import { makeStyles } from '@material-ui/core/styles';
    import './comments.css'
    import { Button, Grid } from '@material-ui/core'
    import Profile from "../../assets/profile.jfif"
    import TimeAgo from 'timeago-react'
    import { useEffect, useState } from 'react'
    import {FaExclamationCircle, FaThumbsUp, FaComment, FaEllipsisH, FaShare, FaWindowClose, 
        FaPen, FaTrash, FaTelegramPlane} from 'react-icons/fa'
    import axios from 'axios'
    import { UseAppContext } from '../../Contexts/app-context'
    import { Backdrop } from '../'

    const Comments = ({ id, _id, userId, username, comment : userComment, createdAt})=>{
        
        const {timelineposts, currentUser, setPostCreated, setCommentSent, commentSent} = UseAppContext()
        const userFirstLetter = username.slice(0,1).toUpperCase()
        const userOtherLetters = username.slice(1)
        const newUsername = userFirstLetter + userOtherLetters
        const [error, setError] = useState({status : false, msg:''})
        const commentsurl = 'https://smart-job-search.herokuapp.com/api/v1/comments'
        const [comments , setComments] = useState([])
        const newComments = []
        const [commentForm, setCommentForm] = useState(false)
        const [commentValue, setCommentValue] = useState('')
        // const [commentSent, setCommentSent] = useState(false)
        // const [updateSent, setUpdateSent] = useState(false)
        // const [showOptions, setShowOptions] = useState(false)
        const [showCommentOptions, setShowCommentOptions] = useState(false)
        const [showUpdatePostForm, setShowUpdatePostForm] = useState(false)
        const [showDeletePostDialog, setShowDeletePostDialog] = useState(false)
        const [updateCommentValue, setUpdateCommentValue] = useState(userComment)


        // const setFormForComment =()=>{
        //     setCommentForm(!commentForm)
        //     setShowUpdatePostForm(false)
        // }

        const setFormForUpdate =()=>{
            setCommentForm(!commentForm)
            setShowUpdatePostForm(!showUpdatePostForm)
            setShowCommentOptions(!showCommentOptions)
        }
        
//Update comment
//show post update
const commentUpdate = async()=>{
    const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
            const options ={
            url : `https://smart-job-search.herokuapp.com/api/v1/comments/${id}/${_id}`,
            method : "PATCH",
            headers : {
               "Accept" : "Application/json",
               "Content-Type" : "Application/json;charset=utf-8"
            },
            data :{
                userId : currentUserId,
                username : currentUserName,
                comment : updateCommentValue
            }
        }
 
        const result = await axios(options)
        const {response} = result.data
        
        if(response == 'Success'){
            setCommentSent(commentSent)
        }else{
            setError({status : true, msg : "Failed to update post"})
        }
}


//Delete comment
        const deleteComment = async(id)=>{
            const {_id : currentUserId, username : currentUserName} = JSON.parse(currentUser)
            const options ={
                url : `https://smart-job-search.herokuapp.com/api/v1/comments/${id}/${_id}`,
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
                 setCommentSent(commentSent)
            }else{
                setError({status : true, msg : "Failed to delete comment"})
            }
        }
    
        const {_id : uId , username : userUsername} =  JSON.parse(currentUser)
    return <div className='comment-main' >
        {uId == userId && userUsername == username && <Button className='more-options'  onClick={()=>setShowCommentOptions(!showCommentOptions)}>
            <FaEllipsisH  />
        </Button>
        }
        {
            showCommentOptions && <div className='options-box'>
            <FaWindowClose onClick={()=>setShowCommentOptions(!showCommentOptions)} className='close-options'/><br />
            <Button onClick={setFormForUpdate}>Update Comment</Button><br />
            {/* <Button onClick={()=>setShowDeletePostDialog(!showDeletePostDialog)}>Delete Comment</Button> */}
            <button className='icon-btn' onClick={setFormForUpdate}><FaPen  className='update-icon'/></button>
            <button className='icon-btn' onClick={()=>setShowDeletePostDialog(!showDeletePostDialog)}><FaTrash  className='trash-icon'/></button>
            </div>
        }
        {
            showDeletePostDialog && <div className='backdrop' onClick={()=>setShowDeletePostDialog(false)}>
            <div className='delete-box' >
                <form>
                    <Button onClick={()=>setShowDeletePostDialog(false)}>Cancel</Button>
                    <Button onClick={()=>deleteComment(id)}>Delete Comment</Button>
                </form>
            </div>
            </div>
        }
        <div className='comment-username'>{newUsername}</div>
        <div className='comment'>{userComment}</div>
        <TimeAgo datetime={createdAt} locale='en_US' className='comment-timeago'/>
        {
            commentForm && <form>
                <input type='text' value={updateCommentValue} onChange={(e)=>setUpdateCommentValue(e.target.value)} className='comment-input' /><br />
                <Button style={{float:"right", marginTop:"-1.85rem"}} onClick={commentUpdate}><FaTelegramPlane className='submit-icon'/></Button>
            </form>
        }
    </div> 
}

export default Comments