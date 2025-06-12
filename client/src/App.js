// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Phreddit from './components/phreddit.js'
import WelcomePage from './components/welcomePage.js';
import RegisterPageView from './components/registerPage.js';
import LoginPageView from './components/loginPage.js';
import Header from './components/header.js';
import NavigationBar from './components/navBar.js';
import MainView from './components/mainView.js';

function App() {

  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [linkflairs, setLinkFlairs] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentType, setCommentType] = useState('c');
  const [activeView, setActiveView] = useState('welcome');
  const [activeUser, setActiveUser] = useState(()=>{
    const savedUser = localStorage.getItem('token');
    return savedUser ? savedUser : '';
  });
  const [admin, setAdmin] = useState(null);
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [activePostComment, setActivePostComment] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State to store user search query

  //fetch users from MongoDB when App loads
  useEffect(()=>{
    axios.get('http://localhost:8000/api/users')
    .then(response=>{
      setUsers(response.data);
    })
    .catch(error =>{
      console.error('There was an error fetching users', error);
    });
  },[refreshData]);

  //fetch communities from MongoDB when App loads
  useEffect(()=>{
    axios.get('http://localhost:8000/api/communities')
    .then(response=>{
      setCommunities(response.data);
    })
    .catch(error =>{
      console.error('There was an error fetching communities', error);
    });
  },[refreshData]);

 //fetch posts from MongoDB when App loads
  useEffect(()=>{
    axios.get('http://localhost:8000/api/posts')
    .then(response=>{
      setPosts(response.data);
    })
    .catch(error =>{
      console.error('There was an error fetching posts', error);
    });
  },[refreshData]);

  // fetch linkflairs when the app loads
  useEffect(()=>{
    axios.get('http://localhost:8000/api/linkflairs')
    .then(response=>{
      setLinkFlairs(response.data);
    })
    .catch(error=>{
      console.error('There was an error in fetching linkflairs', error);
    });
  },[refreshData]);

  // fetch comments when the app loads
  useEffect(()=>{
    axios.get('http://localhost:8000/api/comments')
    .then(response=>{
      setComments(response.data);
    })
    .catch(error=>{
      console.error('There was an error in fetching comments', error);
    });
  },[refreshData]);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (token){
      axios.post('http://localhost:8000/api/verify-token',{token})
      .then(response=>{
        setActiveUser(response.data.user);
      })
      .catch(()=>{
        localStorage.removeItem('token');
        setActiveView('welcome');
      });
    }
  }, []);


  const triggerDataRefresh = ()=>{
    setRefreshData(!refreshData);
  }


  return (
    <div>
      {(activeView === 'welcome') && <WelcomePage setActiveView={setActiveView}/>}

      {(activeView === 'register') && <RegisterPageView users={users} setUsers={setUsers} setActiveView={setActiveView} />}

      {(activeView === 'login') && <LoginPageView setActiveUser={setActiveUser} setAdmin={setAdmin} setActiveView={setActiveView} />}

      {((activeView !== 'welcome') && (activeView!== 'register') &&(activeView !== 'login'))
       && <Header 
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        activeView={activeView}
        setActiveView={setActiveView}
        setActiveCommunity={setActiveCommunity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSearchResults={setSearchResults}
        posts={posts}
        comments={comments}
        />}

      {((activeView !== 'welcome') && (activeView!== 'register') &&(activeView !== 'login'))
       && <NavigationBar 
        activeUser={activeUser}
        communities={communities}
        activeView={activeView}
        setActiveView={setActiveView}
        activeCommunity={activeCommunity}
        setActiveCommunity={setActiveCommunity}
        />}

      {((activeView !== 'welcome') && (activeView!== 'register') &&(activeView !== 'login'))
       && <MainView 
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        admin={admin}
        setAdmin={setAdmin}
        activeView={activeView} 
        setActiveView={setActiveView}
        activeCommunity={activeCommunity}
        setActiveCommunity={setActiveCommunity}
        activePost={activePost}
        setActivePost={setActivePost}
        activePostComment={activePostComment}
        setActivePostComment={setActivePostComment}
        activeComment={activeComment}
        setActiveComment={setActiveComment}
        commentType={commentType}
        setCommentType={setCommentType}
        users={users}
        posts={posts} 
        setPosts={setPosts}
        communities={communities}
        setCommunities={setCommunities}
        linkflairs={linkflairs}
        setLinkFlairs={setLinkFlairs}
        comments={comments}
        setComments={setComments}
        triggerDataRefresh={triggerDataRefresh}
        searchQuery={searchQuery}
        searchResults={searchResults}
        />}

    </div>

    // <section className="phreddit">
    //   <Phreddit />
    // </section>
  );
}

export default App;