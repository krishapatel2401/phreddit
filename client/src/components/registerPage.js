import '../stylesheets/App.css';
import redditLogo from '../stylesheets/reddit logo.png';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function RegisterPageView({users, setUsers, setActiveView}){

    //states for input values
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState('');

    //states for errors
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [invalidEmailError, setInvalidEmailError] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [displayNameEmpty, setDisplayNameEmptyError] = useState(false);
    const [displayNameError, setDisplayNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    // console.log('users line 23:', users);

    const handleSignUp = async () =>{
        let hasError = false;

        if (firstName.trim() === ''){
            setFirstNameError(true);
            hasError = true;
        }
        else{
            setFirstNameError(false);
        }

        if (lastName.trim() === ''){
            setLastNameError(true);
            hasError = true;
        }
        else{
            setLastNameError(false);
        }

        let displayNameExists = await checkDisplayName();
        if (displayNameExists){
            setDisplayNameError(true);
            hasError = true;
        }
        else{
            setDisplayNameError(false);
        }

        if (displayName.trim() === ''){
            setDisplayNameEmptyError(true);
            hasError = true;
        }
        else{
            setDisplayNameEmptyError(false);
        }
        
        if (email.trim() === ''){
            setEmailError(true);
            hasError = true;
        }
        else{
            setEmailError(false);
        }

        
        let isValidEmail = (email)=>{
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        if (!isValidEmail){
            setInvalidEmailError(true);
            hasError = true;
        }
        else{
            setInvalidEmailError(false);
        }

        //added code to check for duplicate emails
        let emailExists = await checkEmailExists();
        if (emailExists){
            setEmailExistsError(true);
            hasError = true;
        }
        else{
            setEmailExistsError(false);
        }


        if ((password.trim() ==='') ||
            (password.trim().includes(firstName.trim())) ||
            (password.trim().includes(lastName.trim())) ||
            (password.trim().includes(email.trim())) ||
            (password.trim().includes(displayName.trim())) ){
            
            setPasswordError(true);
            hasError = true;
        }
        else{
            setPasswordError(false);
        }

        if (password !== passwordMatch){
            setPasswordMatchError(true);
            hasError = true;
        }
        else{
            setPasswordMatchError(false);
        }

        if (hasError){
            // alert('There is an error in one or more fields');
        }
        else{
            //since everything is okay, we can store this user in our users collection
            const newUser = {
                firstName,
                lastName,
                email,
                displayName,
                password
            };

            // console.log('New user:', newUser);

            try{
                const response = await axios.post('http://localhost:8000/api/users', newUser);
                console.log('added user:', response.data);
                setUsers((prev)=>[...prev, response.data]);
            } catch (error){
                console.error('Error in creating and inserting user');
            }

            console.log('Users after adding new user:', users);


            //clearing input fields
            setFirstName('');
            setLastName('');
            setEmail('');
            setDisplayName('');
            setPassword('');
            setPasswordMatch('');

            //go back to the welcome page view
            setActiveView('welcome');

        }


    };

    const checkDisplayName = async () =>{
        try{
            const response = await axios.post('http://localhost:8000/api/check-display-name',{
                displayName: displayName,
            });
            // setDisplayNameError(true);
            return response.data.exists;
        } catch(error){
            console.error('Error checking for the same display name');
            // setDisplayNameError(false);
            return false;
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

    return(
        <div style={{backgroundColor:'orange', height:'100vh',
                    display: 'flex',
                    justifyContent: 'center', alignItems: 'center'
        }}>
            
            <div 
                style={{width:'50%', 
                    border: 'thin solid black', borderRadius:'20px',
                    backgroundColor:'white'}}
                >
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <div>
                            <img 
                                style={{height:'70px', width:'auto'}}
                                src={redditLogo}
                                alt='reddit logo'/>
                        </div>
                        <div style={{width:'5%'}}/>
                        <div
                            style={{textAlign: 'center', marginTop:'25px',
                            marginBottom:'20px', 
                            fontSize:'30px', fontWeight: 'bold'}}
                        >Register User</div>

                    </div>

                

            {/* text input boxes */}
                <div style={{textAlign: 'center'}}>
                

                <div style={{display: 'flex', justifyContent:"space-evenly"}}>
                    <div>
                        <p style={{fontWeight:'bold', marginBottom:'5px'}}
                        > Enter First Name</p>
                        <input type='text' 
                            style={{borderRadius:'10px', border: 'thin solid black', padding:'5px'}} 
                            value={firstName}
                            onChange={(e)=> setFirstName(e.target.value)}
                            placeholder='(text input)'
                            />
                        {firstNameError && <p style={{color:'red', fontSize:'small'}}>*Error: First name cannot be empty!</p>}

                    </div>
                    
                    <br />

                    <div>
                        <p style={{fontWeight:'bold', marginBottom:'5px'}}
                        > Enter Last Name</p>
                        <input 
                            type='text' style={{borderRadius:'10px', border: 'thin solid black', padding:'5px'}} 
                            value={lastName}
                            onChange={(e)=> setLastName(e.target.value)}
                            placeholder='(text input)'
                            />
                        {lastNameError && <p style={{color:'red', fontSize:'small'}}>*Error: Last name cannot be empty!</p>}
                    </div>

                </div>


                <div style={{display: 'flex', justifyContent:"space-evenly"}}>
                    <div>
                        <p style={{fontWeight:'bold', marginBottom:'5px'}}
                        > Enter Display Name</p>
                        <input type='text' 
                            style={{borderRadius:'10px', border: 'thin solid black', padding:'5px'}}
                            value={displayName}
                            onChange={(e)=> setDisplayName(e.target.value)}
                            onBlur={checkDisplayName}
                            placeholder='(text input)'
                            />
                        {displayNameEmpty && <p style={{color:'red', fontSize:'small'}}>*Error: Display name cannot be empty!</p>}
                        {displayNameError && <p style={{color:'red', fontSize:'small'}}>*Error: This display name is already taken!</p>}

                    </div>
                    
                    <br />

                    <div>
                        <p style={{fontWeight:'bold', marginBottom:'5px'}}
                        > Enter Email</p>
                        <input type='text' 
                            style={{borderRadius:'10px', border: 'thin solid black', padding:'5px'}}
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            placeholder='(text input)'
                            />
                        {emailError && <p style={{color:'red', fontSize:'small'}}>*Error: Error in email!</p>}
                        {invalidEmailError && <p style={{color:'red', fontSize:'small'}}>*Error: Invalid email!</p>}
                        {emailExistsError && <p style={{color:'red', fontSize:'small'}}>*Error: A user with the email already exists!</p>}
                    </div>

                </div>


                <div style={{display: 'flex', justifyContent:"space-evenly", marginBottom:'25px'}}>
                    <div>
                        <p style={{fontWeight:'bold', marginBottom:'5px'}}
                        > Set Password</p>
                        <input type='password' 
                            style={{borderRadius:'10px', border: 'thin solid black', padding:'5px'}}
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            placeholder='(text input)'
                            />
                        {passwordError && <p style={{color:'red', fontSize:'small'}}>*Error: Error in password (Password cannot contain first name or last name or email, and cannot be empty)!</p>}

                    </div>
                    
                    <br />

                    <div>
                        <p style={{fontWeight:'bold', marginBottom:'5px'}}
                        > Retype Password</p>
                        <input type='text' 
                            style={{borderRadius:'10px', border: 'thin solid black', padding:'5px'}}
                            value={passwordMatch}
                            onChange={(e)=> setPasswordMatch(e.target.value)}
                            placeholder='(text input)'
                            />
                        {passwordMatchError && <p style={{color:'red', fontSize:'small'}}>*Error: Passwords do not match!</p>}
                        <br />
                    </div>

                </div>
                

                
                </div>
                {/* end of text input boxes */}

                <div style={{textAlign:'center'}}>
                    <button
                        style={{cursor:'pointer', marginBottom:'25px',
                            fontSize:'20px', borderRadius:'15px',
                            width:'100px', backgroundColor:'lightgray'
                        }}
                        onClick={(event)=>{
                            event.preventDefault();
                            handleSignUp();
                        }}
                        >
                        Sign up!
                    </button>
                </div>

            </div>
            
        </div>
    );
}