import '../stylesheets/App.css';
import React /*, {useState}*/ from 'react';
import HomePageView from './homePageView';
import CommunityPageView from './communityPageView';
import PostPageView from './postPageView';
import NewCommunityPageView from './newCommunity';
import NewCommentPageView from './newComment';
import NewPostPageView from './newPost';
import SearchPageView from './searchPageView';
import UserProfilePageView from './userProfilePageView';
import ModifyCommunityPage from './modifyCommunityPage';
import ModifyPostPage from './modifyPostPage';
import ModifyCommentPage from './modifyCommentPage';

export default function MainView({activeUser,
                                setActiveUser,
                                admin,
                                setAdmin,
                                activeView, 
                                setActiveView, 
                                activeCommunity,
                                setActiveCommunity,
                                activePost,
                                setActivePost,
                                activePostComment,
                                setActivePostComment,
                                activeComment,
                                setActiveComment,
                                commentType,
                                setCommentType,
                                users,
                                posts, 
                                setPosts,
                                communities,
                                setCommunities,
                                linkflairs,
                                setLinkFlairs,
                                comments,
                                setComments,
                                triggerDataRefresh,
                                searchQuery,
                                searchResults}){

    

    return(
        <div className='view-main'>
            {(activeView === 'home') && <HomePageView 
                                            posts={posts} 
                                            comments={comments}
                                            communities={communities} 
                                            linkflairs={linkflairs}
                                            activeUser={activeUser}
                                            setActiveView={setActiveView}
                                            setActivePost={setActivePost}
                                            />}

            {(activeView === 'community') && <CommunityPageView 
                                                community={activeCommunity} 
                                                posts={posts} 
                                                comments={comments}
                                                linkflairs={linkflairs}
                                                setActiveView={setActiveView}
                                                setActivePost={setActivePost}
                                                activeUser={activeUser}
                                                triggerDataRefresh={triggerDataRefresh}
                                                />}
            
            {(activeView === 'post') && <PostPageView 
                                            post={activePost}
                                            communities={communities}
                                            linkflairs={linkflairs}
                                            comments={comments}
                                            setActivePost={setActivePost}
                                            setActiveView={setActiveView}
                                            setCommentType={setCommentType}
                                            setActivePostComment={setActivePostComment}
                                            activeUser={activeUser}
                                            triggerDataRefresh={triggerDataRefresh}
                                            />}

            {(activeView === 'new-community') && <NewCommunityPageView 
                                                    activeUser={activeUser}
                                                    communities={communities}
                                                    setCommunities={setCommunities}
                                                    setActiveView={setActiveView}
                                                    setActiveCommunity={setActiveCommunity}
                                                    />}

            
            {(activeView === 'new-comment') && <NewCommentPageView 
                                                    activeUser={activeUser}
                                                    posts={posts}
                                                    comments={comments}
                                                    setComments={setComments}
                                                    commentType={commentType}
                                                    setActiveView={setActiveView}
                                                    activePostComment={activePostComment}
                                                    triggerDataRefresh={triggerDataRefresh}
                                                    />} 

            {(activeView === 'new-post') && <NewPostPageView 
                                                activeUser={activeUser}
                                                posts={posts}
                                                setPosts={setPosts}
                                                communities={communities}
                                                linkflairs={linkflairs}
                                                setLinkFlairs={setLinkFlairs}
                                                setActiveView={setActiveView}
                                                triggerDataRefresh={triggerDataRefresh}
                                                />}

            
            {(activeView === 'search') && <SearchPageView
                                            comments={comments}
                                            communities={communities}
                                            linkflairs={linkflairs}
                                            setActivePost={setActivePost}
                                            setActiveView={setActiveView}
                                            searchQuery={searchQuery}
                                            searchResults={searchResults}
                                            triggerDataRefresh={triggerDataRefresh}
                                            activeUser={activeUser}
                                            />} 

            {(activeView === 'user-profile') && <UserProfilePageView 
                                                    activeUser={activeUser}
                                                    setActiveUser={setActiveUser}
                                                    admin={admin}
                                                    users={users}
                                                    posts={posts}
                                                    communities={communities}
                                                    comments={comments}
                                                    setActiveCommunity={setActiveCommunity}
                                                    setActivePost={setActivePost}
                                                    setActiveComment={setActiveComment}
                                                    setActiveView={setActiveView}
                                                    triggerDataRefresh={triggerDataRefresh}
                                                    />}

            {(activeView === 'modify-community') && <ModifyCommunityPage
                                                        activeUser={activeUser}
                                                        community={activeCommunity}
                                                        setActiveCommunity={setActiveCommunity}
                                                        setActiveView={setActiveView}
                                                        triggerDataRefresh={triggerDataRefresh}
                                                        />}

            {(activeView === 'modify-post') && <ModifyPostPage 
                                                activeUser={activeUser}
                                                post={activePost}
                                                communities={communities}
                                                linkflairs={linkflairs}
                                                setLinkFlairs={setLinkFlairs}
                                                setActiveView={setActiveView}
                                                triggerDataRefresh={triggerDataRefresh}
                                                />}

            {(activeView === 'modify-comment') && <ModifyCommentPage 
                                                    posts={posts}
                                                    comment={activeComment}
                                                    comments={comments}
                                                    setActiveView={setActiveView}
                                                    triggerDataRefresh={triggerDataRefresh} />}

        </div>

    );

    
}