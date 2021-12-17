import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Signup, Login, HomePage, Connections, UserProfile, ErrorPage} from "./Pages";
import './App.css'

const authCheck1 = window.location.href.indexOf('/signup')
const authCheck2 = window.location.href.indexOf('/login')

function App() {

  return (<>
      <Router>
       <Routes>
          <Route path='/signup' element={<Signup/>} exact/>
          <Route path='/login' element={<Login/>} exact/>
         <Route path='/' element={<HomePage/>} exact/>
         <Route path='/userprofile/:id/:username' element={<UserProfile/>} exact/>
         <Route path='/connections/:id/:username' element={<Connections/>} exact/>
         <Route path='*' element={<ErrorPage/>} exact/>
       </Routes>
    </Router>
    </>
  );
}

export default App;
