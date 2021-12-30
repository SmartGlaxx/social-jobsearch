import './signup.css'
import { Button, Grid} from '@material-ui/core'
import { useState, useEffect } from 'react'
import {FaExclamationCircle} from 'react-icons/fa'
import Axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { UseAppContext } from '../../../Contexts/app-context'
// import LoadingIcons from 'react-loading-icons'

const Signup =()=>{
    const {setLoading, loading, setCurrentUser, currentUser} = UseAppContext()
    const [error, setError] = useState({status: false, msg :''})
    const [formValues, setFormValues] = useState({
        username : '',
        email : '',
        password1 : "",
        password2 : "",
    })
    const navigate = useNavigate()

    const setValues =(e)=>{
        let name = e.target.name
        let value = e.target.value
        if(name=='username'){
            value = value.replace(/\s+/g, '')
        }
        setFormValues(prev => {
            return{...prev, [name] : value}
        })
    }
    const submit = async(e)=>{
        //setLoading(true)
        e.preventDefault()
        const {username, email, password1, password2} = formValues
        if(password2 !== password1){
            setError({status : true, msg : "Password Mismatch"})
            setTimeout(()=>{
                setError({status : false, msg :''})
            }, 4000)
        }else{
            const options = {
                url: "http://smart-job-search.herokuapp.com/api/v1/auth/register",
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json;cjarset=UTF-8"
                },
                data:{
                    username : username,
                    email : email,
                    password : password1
                }
            }

            const result = await Axios(options)
            const {response, singupdData} = result.data
            if(response === 'Success'){
                setCurrentUser(singupdData)
                return window.location.href = '/'
                
            }else if(response === 'Fail'){
                const {message} = result.data
                setError({status : true, msg : message})
                setTimeout(()=>{
                    setError({status : false, msg :''})
                }, 4000)
            }
        }
    }

    
    // if(loading){
    //     return <div style={{width: "100%",height : "100vh", 
    //     display: 'grid', placeItems: "center"}}>
    //        <LoadingIcons.Puff       stroke="#555" strokeOpacity={.9} />
    //    </div>
    // }

    return (
    <Grid className='signup' container>
        <Grid className='signup-left' item xs={12} sm={6}>
            <div className='title'>Smart Job Search</div>
        </Grid>
        <Grid className='signup-right' item xs={12} sm={6} >
            
            {
                error.status && <div className='errorNotice'><FaExclamationCircle />{error.msg}</div>
            }
            <div>
            <form>
                 <h3 className='page-title'>Register</h3>
                <input className='input' value ={formValues.username} onChange={setValues} type='text' name='username' placeholder='Username'/>
                <input className='input' value ={formValues.email} onChange={setValues} type='email' name='email' placeholder='E-Mail'/>
                <input className='input' value ={formValues.password1} onChange={setValues} type='password' name='password1' placeholder='Password'/>
                <input className='input' value ={formValues.password2} onChange={setValues} type='password' name='password2' placeholder='Comfirm Password'/>
                <Button className='btn'  onClick={submit}>Sign up</Button>
            </form>
            <Link to ='/reset-password' className='forgot-password'>Forgot Password?</Link>
            <Link to ='/login' className='forgot-password'>Login</Link>
            </div>
        </Grid>
    </Grid>
)}

export default Signup