import '../stylesheets/App.css';
import redditLogo from '../stylesheets/reddit logo.png';
import axios from 'axios';


export default function WelcomePage({setActiveView}){

    return(
        <div style={{textAlign: 'center', height: '100%'}}>
            <div className='welcome-text'>Welcome to Phreddit</div>
            <br />
            <br />
            <div 
                className='welcome-box'
                >
                <div >
                    <img 
                    style={{height: '120px', width: 'auto'}}
                    src={redditLogo}
                    alt='reddit-logo' />
                </div>
                <br />
                <div 
                    style={{border: 'thin black solid', borderRadius: '10px', padding: '20px', width: '40%', backgroundColor:'lightgray'}}
                    >
                    <button className='welcome-buttons'
                        onClick={ (event)=>{
                            event.preventDefault();
                            setActiveView('register');
                        }}
                        >Register as a New User</button>
                    <br />
                    <br />
                    <button className='welcome-buttons'
                        onClick={ (event)=>{
                            event.preventDefault();
                            setActiveView('login');
                        }}
                        >Log In as Existing User</button>
                    <br />
                    <br />
                    <button className='welcome-buttons'
                        onClick={(event)=>{
                            event.preventDefault();
                            setActiveView('home');
                        }}
                        >Continue as Guest User</button>
                </div>
            </div>
        </div>

    );
}