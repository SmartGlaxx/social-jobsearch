const CURRENTUSER = "CURRENTUSER"; const LOGGEDIN = 'LOGGEDIN' ; 
const LOADING = 'LOADING'; const MENUOPEN = 'MENUOPEN', TIMELINEPOSTS ='TIMELINEPOSTS', 
ALERT='ALERT'; const ALLUSERS = "ALLUSERS"; const TEMPALLUSERS = 'TEMPALLUSERS';
const SETCUSERFOLLOWINGS = "SETCUSERFOLLOWINGS"; const SETNEWTEMPUSER = 'SETNEWTEMPUSER'
const POSTCREATED = 'POSTCREATED'; const SETSIDEBAR = 'SETSIDEBAR' ; const USERCLICKED = 'USERCLICKED';
const SETFETCHEDUSER = 'SETFETCHEDUSER'; const COMMENTSENT = 'COMMENTSENT';
const CURRENTUSERPARSED = 'CURRENTUSERPARSED'; const TESTVALUE = 'TESTVALUE'; const LAZYLOADING = 'LAZYLOADING';
const SETCHATUSERNAME = 'SETCHATUSERNAME'; const SETREPLYSENT = 'SETREPLYSENT';
const SCROLLINTOVIEW = "SCROLLINTOVIEW" 

const reducer = (state, action)=>{
    switch(action.type){
        case LOADING: 
            return {...state, loading: action.payload }
        case CURRENTUSER:
            return{...state, currentUser : action.payload}
        case LOGGEDIN:
            return{...state, loggedIn : action.payload}
        case ALLUSERS:
            return {...state, allUsers : action.payload}
        case TEMPALLUSERS:
            return {...state, tempAllUsers : action.payload}
        case ALERT:
            return {...state, alert : action.payload}
        case TIMELINEPOSTS:
            return {...state, timelineposts : action.payload}
        case SETNEWTEMPUSER:
            return {...state, tempCurrentUser : action.payload}
        case POSTCREATED: 
            return {...state, postcreated : action.payload}
        case SETSIDEBAR:
            return {...state, sidebarOpen : !state.sidebarOpen}
        case USERCLICKED:
            return {...state, userClicked : !state.userClicked}
        case SETFETCHEDUSER:
            return {...state, fetchedUser : action.payload}

        case COMMENTSENT :
            return {...state, commentSent : !state.commentSent}
        case CURRENTUSERPARSED :
            return {...state, currentUserParsed : action.payload}
            
        case TESTVALUE :
            return {...state, testValue : action.payload}
        case LAZYLOADING :
            return {...state, lazyLoading : action.payload}
        case SETCHATUSERNAME :
            return {...state, chatUser : action.payload}
            
        case SETREPLYSENT : 
            return {...state, replySent : action.payload}
        case SCROLLINTOVIEW :
            return {...state, scrollIntoViewValue : action.payload}

        
        default:
            return {...state}
    }
    return state
}

export default reducer
