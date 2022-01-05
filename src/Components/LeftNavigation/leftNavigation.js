import './left-navigation.css'
import Grid from "react-loading-icons/dist/components/grid"
import { UseAppContext } from "../../Contexts/app-context"
import { Link } from "react-router-dom"
import { FaUserAlt, FaImages, FaExclamationCircle, FaPeopleArrows, FaUserFriends,
    FaBriefcase} from 'react-icons/fa'

const LeftNavigation = ()=>{
    const {loggedIn, loading, setLazyLoading, lazyLoading, currentUser,timelineposts, allUsers, postcreated, 
        setPostCreated, currentUserParsed, fetchedUser} = UseAppContext()
    const {_id : userId, username : userUsername, followings, followers, 
        profilePicture : userProfilePicture, coverPicture : userCoverPicture} = fetchedUser
    const {_id , username} = currentUserParsed

    let usernameCapitalized = ''
    if(username){
        usernameCapitalized = username.slice(0,1).toUpperCase().concat(username.slice(1).toLowerCase())
    }

    return   <div className='page-left-inner' >
        <div className='homepage-left-top'>
        <Link to={`/userprofile/${_id}/${username}`}>
            <FaUserAlt /> {usernameCapitalized}
        </Link>
        </div>
        <ul className='homepage-left-ul'>
            <li className='homepage-left-li'>
              <FaPeopleArrows /> <Link to={`/connections/${_id}/${username}`}>Connections</Link>
            </li>
            <li className='homepage-left-li'>
               <FaUserFriends /><Link to={`/follows/${_id}/${username}`}>Follows</Link>
            </li>
            <li className='homepage-left-li'>
               <FaBriefcase /> Jobs
            </li>
        </ul>
    </div>
}

export default LeftNavigation