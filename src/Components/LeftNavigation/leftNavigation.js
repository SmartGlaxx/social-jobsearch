import './left-navigation.css'
import Grid from "react-loading-icons/dist/components/grid"
import { UseAppContext } from "../../Contexts/app-context"
import { Link } from "react-router-dom"
import { FaUserAlt, FaImages, FaExclamationCircle } from 'react-icons/fa'

const LeftNavigation = ()=>{
    const {loggedIn, loading, setLazyLoading, lazyLoading, currentUser,timelineposts, allUsers, postcreated, 
        setPostCreated, currentUserParsed, fetchedUser} = UseAppContext()
    const {_id : userId, username : userUsername, followings, followers, 
        profilePicture : userProfilePicture, coverPicture : userCoverPicture} = fetchedUser
    const {_id , username} = JSON.parse(currentUser)

    return   <div className='homepage-left-inner' >
        <div className='homepage-left-top'>
        <Link to={`/userprofile/${_id}/${username}`}>
            <FaUserAlt /> {username}
        </Link>
        </div>
        <ul className='homepage-left-ul'>
            <li className='homepage-left-li'>
               <Link to={`/connections/${_id}/${username}`}>Connections</Link>
            </li>
            <li className='homepage-left-li'>
                My Connections
            </li>
            <li className='homepage-left-li'>
                Jobs
            </li>
        </ul>
    </div>
}

export default LeftNavigation