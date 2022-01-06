import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import {Button, Divider} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './topbar.css'
import { Grid } from '@material-ui/core'
import {FaSearch, FaHome, FaPeopleArrows, FaRegClock, FaUserFriends, FaBriefcase, FaUserAlt, FaTh, FaBell, FaRocketchat, 
    FaChevronCircleDown, FaTools} from 'react-icons/fa' 
import { UseAppContext } from '../../Contexts/app-context'
import ListIcon from '@material-ui/icons/List';
import { Search } from '..';

//for popover starts
const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));

  //for popover ends

const Topbar =()=>{
     const {setLoggedIn, loggedIn, allUsers, setCurrentUser, currentUser, currentUserParsed, openSidebar} = UseAppContext()
     const {_id, username, receivedConnectionRequests} = currentUserParsed
     const [receivedRequests, setReceivedRequests] = useState([])
     const [searchTerm, setSearchTerm] = useState()
     let usernameCapitalized = ''

     if(username){
         usernameCapitalized = username.slice(0,1).toUpperCase().concat(username.slice(1).toLowerCase())
     }
     
     // get request users 
     
     const requestUsers = allUsers.filter(user => user.receivedConnectionRequests.includes(user._id))
    //  setReceivedRequests(requestUsers)

    //  console.log('receivedRequests', receivedRequests)

     //popover function start
     const classes = useStyles();
     const [anchorEl, setAnchorEl] = React.useState(null);
     const [anchorEl2, setAnchorEl2] = React.useState(null);
     const [anchorEl3, setAnchorEl3] = React.useState(null);
   
     const handleClick = (event) => {
       setAnchorEl(event.currentTarget);
     };

     const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
      };
      
    const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
    };
   
     const handleClose = () => {
       setAnchorEl(null);
     };
     const handleClose2 = () => {
        setAnchorEl2(null);
      };

    const handleClose3 = () => {
        setAnchorEl3(null);
    };
   
     const open = Boolean(anchorEl);
     const open2 = Boolean(anchorEl2);
     const open3 = Boolean(anchorEl3);
     const id = open ? 'simple-popover' : undefined;
     const id2 = open2 ? 'simple-popover2' : undefined;
     const id3 = open3 ? 'simple-popover3' : undefined;
     //popover function end

     const setLoginValues =(value, loginData)=>{
        setCurrentUser(loginData)
        setLoggedIn(value)
    }

  
     
    return <Grid className='topbarContainer' container>
        <Grid className="topLeft" item xs ={9} sm={3} >
            <div className='mainlogo'>SC</div>
            <div style={{display:"block"}}>
            <div className='topLeft-inner'>
                <FaSearch className='icons2' />
                <input type='search' className='search' onChange={(e)=>setSearchTerm(e.target.value)}
                placeholder='Search SmartConnect'/>
            </div>
            {
            searchTerm  && <div
                style={{background : "red", width:"13rem", height: "auto", maxHeight:"20rem",
                padding:"3rem 1rem", overflowY:"auto", overflowX:"hidden",
                position: "absolute"}}>
                    Search results</div>
            }
            </div>
        </Grid>
        <Grid className="topCenter" item xs ={false} sm={5}>
            <div className="topCenter-inner">
                <ul className="topCenter-ul">
                    <Link to='/' className="topCenter-li">
                        <li >
                            <FaHome className="icons"  size='25'/>
                        </li>
                    </Link>
                    <Link to={`/connections/${_id}/${username}`} className="topCenter-li">
                        <li >
                            <FaPeopleArrows className="icons"  size='25'/>
                        </li>
                    </Link>
                    <Link to={`/follows/${_id}/${username}`} className="topCenter-li">
                        <li className="topCenter-li">
                            <FaUserFriends className="icons"  size='25'/>
                        </li>
                    </Link>
                    <li className="topCenter-li">
                    <FaBriefcase className="icons"  size='25'/>
                    </li>
                </ul> 
            </div>
        </Grid>
        <Grid className="topCRight" item xs ={false} sm={4}>
            <div className="topRight-inner" >
                <ul className="topRight-ul" >
                    <li className='topRight-li'>
                        <FaUserAlt className="icons2" />
                    </li>
                    <li className='topRight-li'>
                        <FaTh  className="icons2"/>
                    </li>
                    <li className='topRight-li'>
                        <FaRocketchat  className="icons2"/>
                    </li>
                    <li className='topRight-li'>
                        <div className='icon2-text'>
                            <FaBell  className="icons2"
                            aria-describedby={id} variant="contained" onClick={handleClick3}/>{ receivedConnectionRequests && receivedConnectionRequests.length}

                        <Popover
                            id={id}
                            open={open3}
                            anchorEl={anchorEl3}
                            onClose={handleClose3}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                            <Button className=''>
                           {
                               requestUsers.length > 0 ? 
                               <>
                               <h4>Received Requests</h4>
                               {requestUsers.map(user =>{
                                   const {_id, username} = user
                                   return <Button className='link-btn'>
                                            <Link key={_id} to={`/userprofile/${_id}/${username}`} className='link'>
                                                {username}
                                            </Link>
                                       </Button>
                               })} 
                               </> :
                               <Typography>No Notifications </Typography>
                           }
                           </Button>
                        </Popover>

                        </div>
                    </li>
                    <li className='topRight-li'>
                        <FaChevronCircleDown  className="icons2" aria-describedby={id} variant="contained" color="primary" onClick={handleClick}/>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                           
                        <Button className='link-btn'>
                            <Link to={`/userprofile/${_id}/${username}`} className='link'>
                                <FaUserAlt className='nav-icon' /> <span  className='link'>{usernameCapitalized}</span>
                            </Link>
                        </Button><br/>
                        <Button aria-describedby={id2} onClick={handleClick2} className='link-btn'>
                            <FaTools className='nav-icon link' /><span className='link'>Messages</span>
                        </Button><br/>
                        <Button className='link-btn'>
                            <Link to='/settings' className='link'><FaTools className='nav-icon' />
                            <span  className='link'>Settings</span></Link>
                        </Button><br/>
                        <Divider />
                        {loggedIn && <Button onClick={()=>setLoginValues(false, {})} className='link-btn'>
                            <span  className='log-out' >Log out</span></Button>}
                        </Popover>
                        <Popover
                            id={id2}
                            open={open2}
                            anchorEl={anchorEl2}
                            onClose={handleClose2}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                        >
                            <Button className='link-btn'>
                                <Link to='/composemessage' className='link'>New Message</Link>
                            </Button><br />
                            <Button className='link-btn'>
                                <Link to='/inbox' className='link'>Inbox</Link>
                            </Button>
                        </Popover>
                    </li>
                </ul>
            </div>
        </Grid>
        <div className='menu-btn-box'><ListIcon className='menu-btn' onClick = {openSidebar}/></div>
    </Grid>
}

export default Topbar
