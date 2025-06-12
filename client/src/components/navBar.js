import React/*, {useEffect, useState}*/ from 'react';
import '../stylesheets/App.css';

export default function NavigationBar({activeUser, communities, activeView, setActiveView, activeCommunity, setActiveCommunity}){

    const handleHomeClick = ()=>{
        setActiveView('home');
        // setActiveCommunity(null);
    }

    const handleCommunityClick = (community)=>{
        setActiveView('community');
        setActiveCommunity(community);
    };

    const handleCreateCommunityClick = ()=>{
        setActiveView('new-community');
    };


    const sortedCommunities = React.useMemo(()=>{
        if (!activeUser){
            return communities;
        }

        const joinedOrder = communities.filter((community)=>
            community.members.includes(activeUser.displayName)
        );
        console.log('joined order:', joinedOrder);

        const otherOrder = communities.filter((community)=>
            !community.members.includes(activeUser.displayName)
        );
        console.log('other order:', otherOrder);

        return [...joinedOrder, ...otherOrder];

    },[activeUser, communities]);
    

    return(

        <div>
            <div className='navigation-bar'
            style={{display:'block', top:'60px'}}>

                <button
                id='home-button-id' 
                className={`home-button ${activeView === 'home'? 'active-button' : ''}`}
                style={{marginTop:'10px', fontSize:'20px', borderRadius:'12px'}}
                onClick={(event)=>{
                    event.preventDefault();
                    handleHomeClick();
                }}
                >
                    Home
                </button>

                <hr style={{width:'170px'}} /> {/*this is the vertical separating line */}

                <div style={{textAlign:'left', paddingLeft:'7px', paddingBottom:'3px', fontSize:'18px'}}>Communities</div>

                <button
                    className={activeUser ?
                        (`create-community-button ${activeView === 'new-community'? 'active-button' : ''}`
                            ) : 'button-inactive'}
                    style={{margin:'5px', borderRadius:'12px'}}
                    onClick={(event)=>{
                        event.preventDefault();
                        handleCreateCommunityClick();
                    }}
                    disabled={!activeUser}
                    >Create Community
                </button>

                <ul id='community-list-nav'>
                    {sortedCommunities.map((community)=>(
                        <li key={community._id} style={{textAlign:'left', marginRight:'5px'}}
                            >
                            < p
                                href='#'
                                style={{textDecoration:'none', color:'black', cursor:'pointer',borderRadius:'9px'}}
                                className={`${(activeCommunity ===community) && (activeView ==='community') ? 'active-link':''}`}
                                onClick={(event)=>{
                                    event.preventDefault();
                                    handleCommunityClick(community);
                                }}
                                >
                                    {community.name}
                            </p>
                        </li>
                    ))}

                </ul>

            </div>
        </div>

    );
}