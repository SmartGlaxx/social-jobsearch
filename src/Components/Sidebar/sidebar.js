import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import {Button, Divider} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './sidebar.css'
import { FaHome, FaPeopleArrows, FaRegClock, FaUserFriends, FaBriefcase, FaUserAlt, FaTh, FaBell, FaRocketchat, FaChevronCircleDown,
     FaWindowClose, FaTools, FaSignInAlt} from 'react-icons/fa' 
import { UseAppContext } from '../../Contexts/app-context'
import ListIcon from '@material-ui/icons/List';

//for popover starts
const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));

  //for popover ends

const Sidebar =()=>{
     const {setLoggedIn, loggedIn, currentUser, sidebarOpen, openSidebar} = UseAppContext()


     //popover function start
     const classes = useStyles();
     const [anchorEl, setAnchorEl] = React.useState(null);
   
     
    return <div className={ sidebarOpen ? `sidebarContainer2` : `sidebarContainer1`}  >
        <div className="sidebarTop " item xs ={9} sm={3}>
             <div className='sidebarlogo'>SC</div>
            {/* <div className='top-inner'>
                <input type='search' className='search' placeholder='Search SmartConnect'/>
            </div>  */}
            <FaWindowClose className='close-icon' size='25' onClick = {openSidebar}/>
        </div>
        <div className="sideTop" >
            <div className="sideTop-inner">
                <ul className="sideTop-ul">
                    <li className="sideTop-li">
                    <FaHome className="icons"  size='15'/>
                    Home
                    </li>
                    <li className="sideTop-li">
                    <FaPeopleArrows className="icons"  size='15'/>
                    Connections
                    </li>
                    <li className="sideTop-li">
                    <FaUserFriends className="icons"  size='15'/>
                    Follows
                    </li>
                    <li className="sideTop-li">
                    <FaBriefcase className="icons"  size='15'/>
                    Jobs
                    </li>
                </ul> 
            </div>
        </div>
        <div className="sideTop" >
            <div className="sideTop-inner">
                <ul className="sideTop-ul">
                    <li className='sideTop-li'>
                        <FaUserAlt className="icons"  size='15'/>
                        Profile
                    </li>
                    <li className='sideTop-li'>
                        <FaTh  className="icons" size='15' />

                    </li>
                    <li className='sideTop-li'>
                        <FaRocketchat  className="icons" size='15'/>
                        Chat
                    </li>
                    <li className='sideTop-li'>
                        <FaBell  className="icons" size='15'/>
                        Notifications
                    </li>
                    <li className='sideTop-li'>
                        <FaTools  className="icons" size='15'/>
                        Settings
                    </li>
                    {loggedIn && <><Button className='logout' style={{color: "rgb(236, 39, 39)"}}><FaSignInAlt onClick={()=>setLoggedIn(false)} className='logout-icon' size='15'/>Log out</Button></>}
                </ul>
            </div>
        </div> 
        
    </div>
}

export default Sidebar
