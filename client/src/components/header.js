import '../stylesheets/App.css';
import React /*, {useState}*/ from 'react';
import SearchFunction from './searchFunction';

export default function Header({activeUser,
                                setActiveUser,
                                activeView, 
                                setActiveView, 
                                setActiveCommunity, 
                                searchQuery, 
                                setSearchQuery, 
                                setSearchResults,
                                posts, 
                                comments}){

  const handlePhredditClick = ()=>{
    setActiveView('welcome');
    // setActiveView('home');
    // setActiveCommunity(null);
  };

  const handleCreatePostClick = ()=>{
    setActiveView('new-post');
  };

  // Function to handle search from Header
  const onSearch = (query) => {
    const results = SearchFunction(posts, comments, query); // Call searchFunction to filter posts
    setSearchResults(results);
    setSearchQuery(query); // Save the user's search query
    setActiveView('search'); // Set view to 'search' to show results
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchQuery.toLowerCase().trim()); // Call onSearch passed from App.js
    }
  };

    const handleProfile = () =>{
      // if (activeUser.role === 'user'){
      //   setActiveView('user-profile');
      // }
      // else if (activeUser.role === 'admin'){
      //   setActiveView('admin-profile');
      // }
      setActiveView('user-profile');
    };

    const handleLogout = () =>{
        setActiveUser(false);
        setActiveView('welcome');
    };

    return(
        <header className="banner">
      <div>
        <button
          id="phreddit-button-id"
          className="phreddit-button"
          onClick={(event) => {
            event.preventDefault();
            handlePhredditClick();
          }}
        >
          phreddit
        </button>
      </div>

      <div>
        <input
          type="search"
          id="user-input"
          placeholder="Search Phreddit..."
          style={{fontSize:'17px', color:'black'}}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      

      <div style={{display:'flex', justifyContent:'space-evenly'}}>

        <button style={{borderRadius:'15px', padding:'0 8px', cursor:'pointer'}}
            onClick={(event)=>{
              event.preventDefault();
              handleProfile();
            }}
            disabled={!activeUser}
            >{ (activeUser) ? `${activeUser.displayName}` : 'Guest'}
        </button>

        <div style={{width:'5px'}}/>

        { activeUser && 
            <button
                style={{borderRadius:'15px', padding:'0 8px', cursor:'pointer'}}
                onClick={(event)=>{
                    event.preventDefault();
                    handleLogout();
                }}
            >Logout
            </button>}
        <div style={{width:'5px'}}/>

        <button
          id="create-post-id"
          className={ activeUser ? 
            (`create-post-button ${(activeView === 'new-post') ? 'active-button' : ''}`
                ): 'button-inactive'}
          onClick={(event) => {
            event.preventDefault();
            handleCreatePostClick();
          }}
          disabled={!activeUser}
        >
          Create Post...
        </button>
      </div>
    </header>

    );
}