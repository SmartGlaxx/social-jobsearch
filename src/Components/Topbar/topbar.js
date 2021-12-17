import React from 'react';
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

//for popover starts
const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));

  //for popover ends

const Topbar =()=>{
     const {setLoggedIn, loggedIn, setCurrentUser, currentUser, openSidebar} = UseAppContext()


     //popover function start
     const classes = useStyles();
     const [anchorEl, setAnchorEl] = React.useState(null);
   
     const handleClick = (event) => {
       setAnchorEl(event.currentTarget);
     };
   
     const handleClose = () => {
       setAnchorEl(null);
     };
   
     const open = Boolean(anchorEl);
     const id = open ? 'simple-popover' : undefined;
     //popover function end

     const setLoginValues =(value, loginData)=>{
        setCurrentUser(loginData)
        setLoggedIn(value)
    }
     
    return <Grid className='topbarContainer' container>
        <Grid className="topLeft" item xs ={9} sm={3}>
            <div className='mainlogo'>SC</div>
            <div className='topLeft-inner'>
                <FaSearch className='icons2' />
                <input type='search' className='search' placeholder='Search SmartConnect'/>
            </div>
        </Grid>
        <Grid className="topCenter" item xs ={false} sm={5}>
            <div className="topCenter-inner">
                <ul className="topCenter-ul">
                    <li className="topCenter-li">
                    <FaHome className="icons"  size='25'/>
                    </li>
                    <li className="topCenter-li">
                    <FaPeopleArrows className="icons"  size='25'/>
                    </li>
                    <li className="topCenter-li">
                    <FaUserFriends className="icons"  size='25'/>
                    </li>
                    <li className="topCenter-li">
                    <FaBriefcase className="icons"  size='25'/>
                    </li>
                </ul> 
            </div>
        </Grid>
        <Grid className="topCRight" item xs ={false} sm={4}>
            <div className="topRight-inner">
                <ul className="topRight-ul">
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
                        <FaBell  className="icons2"/>
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
                           
                        <Link to='/profile'><Button>{currentUser.username}Your Profile</Button></Link><br/>
                        <Link to='/settings'><FaTools />Settings</Link><br/>
                        <Divider />
                        {loggedIn && <Button onClick={()=>setLoginValues(false, {})}>Log out</Button>}
                           
                        </Popover>
                    </li>
                </ul>
            </div>
        </Grid>
        <div className='menu-btn-box'><ListIcon className='menu-btn' onClick = {openSidebar}/></div>
    </Grid>
}

export default Topbar
