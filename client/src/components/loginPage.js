import '../stylesheets/App.css';
import redditLogo from '../stylesheets/reddit logo.png';
import React, {useState, useEffect} from 'react';
import axios from 'axios';


export default function LoginPageView({setActiveUser, setAdmin, setActiveView}){

    //states for input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //states for errors
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleLogIn = async () =>{
        let hasError = false;

        let emailExists = await checkEmailExists();
        if (!emailExists){
            setEmailError(true);
            hasError = true;
        }
        else{
            setEmailError(false);
        }

        let validLogin = await checkValidLogin();
        if (!validLogin){
            setPasswordError(true);
            hasError = true;
        }
        else{
            setPasswordError(false);
        }

        if (!hasError){
            //everything is okay so let's go to the home page
            setActiveView('home');
        }

    };

    const checkEmailExists = async () =>{
        try{
            const response = await axios.post('http://localhost:8000/api/check-email',{
                email: email,
            });
            return response.data.exists;
        } catch (error){
            console.error('Error finding matching email');
            return false;
        }

    };

    const checkValidLogin = async () =>{
        try{
            const response = await axios.post('http://localhost:8000/api/login',{
                email: email,
                password: password,
            });
            //getting user data from the response
            const {token, user} = response.data;

            //storing token in localstorage
            localStorage.setItem('token', JSON.stringify(user));
            setActiveUser(user);
            if (user.role === 'admin'){
                setAdmin(user);
            }
            console.log('Login successful');
            return true;
        } catch(error){
            if (error.response){
                alert(error.response.data.error);
            }
            else{
                alert ('error ocurred while attempting to log in');
            }
            return false;
        }
    };

    return(
        <div
            style={{backgroundColor:'orangered', height:'100vh',
                display: 'flex',
                justifyContent: 'center', alignItems: 'center'
            }}>

            <div 
                style={{width:'50%', 
                    border: 'thin solid black', borderRadius:'20px',
                    backgroundColor:'white', textAlign:'center'}}
                    >
                        {/* heading with img and text */}
                        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            
                            <img 
                                style={{height:'70px', width:'auto'}}
                                src={redditLogo}
                                alt='reddit logo'/>
                        <div style={{width:'5%'}}/>
                        <div
                            style={{textAlign: 'center', marginTop:'25px',
                                marginBottom:'20px', 
                                fontSize:'30px', fontWeight: 'bold'}}
                            >User Login</div>        
                        </div>

                      {/*text input boxes  */}
                    <div style={{textAlign:'center'}}>

                        <p style={{fontWeight:'bold', marginBottom:'5px'}}
                        >Enter Email</p>

                        <input type='text' 
                            style={{borderRadius:'10px', border: 'thin solid black', padding:'5px'}}
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            placeholder='(text input)'
                            />
                        {emailError && <p style={{color:'red', fontSize:'small'}}>*Error: Email not found!</p>}
                        
                        <br />

                        <p style={{fontWeight:'bold', marginBottom:'5px'}}
                        >Enter Password</p>

                        <input type='password' 
                            style={{borderRadius:'10px', border: 'thin solid black', padding:'5px'}}
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            placeholder='(text input)'
                            />
                        {passwordError && <p style={{color:'red', fontSize:'small'}}>*Error: Invalid login credentials!</p>}

                    {/* end of text input boxes */}
                    </div>

                    <button
                        style={{textAlign:'center', cursor:'pointer', marginBottom:'25px',
                            marginTop:'20px', fontSize:'17px', borderRadius:'15px',
                            width:'100px', backgroundColor:'lightgray'}}
                        onClick={(event)=>{
                            event.preventDefault();
                            handleLogIn();
                        }}
                        >Log in!</button>
                
            
            </div>
            
        </div>
    );
}