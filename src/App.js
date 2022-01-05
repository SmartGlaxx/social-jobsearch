import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Signup, Login, HomePage, Connections, Follows, 
  UserProfile, ComposeMessages, Inbox, Chat, ErrorPage} from "./Pages/index";
import './App.css'
// import { Chat } from './Pages/Messages';

function App() {

  return (<>
      <Router>
       <Routes>
          <Route path='/signup' element={<Signup/>} exact/>
          <Route path='/login' element={<Login/>} exact/>
         <Route path='/' element={<HomePage/>} exact/>
         <Route path='/userprofile/:id/:username' element={<UserProfile/>} exact/>
         <Route path='/connections/:id/:username' element={<Connections/>} exact/>
         <Route path='/follows/:id/:username' element={<Follows/>} exact/>
         <Route path='/composemessage' element={<ComposeMessages/>} exact/>
         <Route path='/chat/:userId/:userUsername/:id/:otherUsername' element={<Chat/>} exact/>
         <Route path='/inbox' element={<Inbox/>} exact/>
         <Route path='*' element={<ErrorPage/>} exact/>
       </Routes>
    </Router>
    </>
  );
}

export default App;
