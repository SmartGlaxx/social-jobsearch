import './login.css'
import { Button, Grid} from '@material-ui/core'
import { useState, useEffect } from 'react'
import {FaExclamationCircle} from 'react-icons/fa'
import Axios from 'axios'
import {Link} from 'react-router-dom'
import { UseAppContext } from '../../../Contexts/app-context'
import LoadingIcons from 'react-loading-icons'

const Login =()=>{
    const {setLoading, loading, setCurrentUser, currentUser, setLoggedIn} = UseAppContext()
    const [error, setError] = useState({status: false, msg :''})
    const [formValues, setFormValues] = useState({
        emailOrUsername : '',
        password : ""
    })

    const setLoginValues =(value, loginData)=>{
        setCurrentUser(loginData)
        setLoggedIn(value)
        // setLoading(false)
    
    }
    const setValues =(e)=>{
        const name = e.target.name
        const value = e.target.value
        setFormValues(prev => {
            return{...prev, [name] : value}
        })
    }
    // const submitCall = ()=>{
    //     setLoading(true)
    //     //submit()
    // }
    const submit = async(e)=>{
        setLoading(true)
         e.preventDefault()
       
        
        const {emailOrUsername, password} = formValues
        if(!emailOrUsername || !password){
            setError({status : true, msg : "Pleae enter E-mail or Username and Password"})
            setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }
            const options = {
                url: "http://smart-job-search.herokuapp.com/api/v1/auth/login",
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;cjarset=UTF-8"
                },
                data:{
                    emailOrUsername : emailOrUsername,
                    password : password
                }
            }
           
            const result = await Axios(options)
           
            const requestResponse = result.data.response
            if(requestResponse === 'Success'){
                const {loginData} = result.data
                setLoginValues(true, loginData)
                return window.location.href = '/'
            }else if(requestResponse === 'Fail'){
                const {message} = result.data
                setError({status : true, msg : message})
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
    }

    if(loading){
        return <div style={{width: "100%",height : "100vh", 
        display: 'grid', placeItems: "center"}}>
           <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
       </div>
    }
    

    return (
    <Grid className='login' container>
        <Grid className='login-left' item xs={12} sm={6} >
            <div className='title'>Smart Job Search</div>
        </Grid>
        <Grid className='login-right' item xs={12} sm={6} >
            
            {
                error.status && <div className='errorNotice'><FaExclamationCircle />{error.msg}</div>
            }
            <div>
            <form>
                 <h3 className='page-title'>Welcome Back</h3>
                <input className='input' value ={formValues.emailOrUsername} onChange={setValues} type='text' name='emailOrUsername' placeholder='E-mail/Username' required/>
                <input className='input' value ={formValues.password} onChange={setValues} type='password' name='password' placeholder='Password' required/>
                <Button className='btn'  onClick={submit}>Login</Button>
            </form>
              <Link to ='/' className='forgot-password'>Forgot Password?</Link>
              <Link to ='/signup' className='forgot-password'>Sign-up</Link>
            </div>
        </Grid>
    </Grid>
)}

export default Login