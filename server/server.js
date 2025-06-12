// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'ourPhredditSecretKey';

const app = express();
const port = 8000;

//importing MongoDB models
const Community = require('./models/communities');
const Post = require('./models/posts');
const LinkFlair = require('./models/linkflairs');
const Comment = require('./models/comments');
const User = require('./models/users');

//allow requests from the client
app.use(cors());
//parsing json data
app.use(express.json());

//MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/phreddit',{
    // useNewUrlParser: true, useUnifiedTopology: true
});

try{
    mongoose.connect('mongodb://127.0.0.1:27017/phreddit');
    console.log("MongoDB connection successful!");
}catch(error){
    console.error("Failed to connect to MongoDB:", error);
}

app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});

//fetching communities
app.get('/api/communities', async (req, res)=>{
    try{
        const communities = await Community.find();
        //sending them as json to frontend
        res.json(communities); 
    }catch(error){
        res.status(500).send('Error rerieving communities');
    }
});

//this will be used for the creae community part
app.post('/api/communities', async (req, res)=>{ //sets up an endpoint that listens for POST requests 
    try{
        //creating a new community object using our mongoose model
        const newCommunity = new Community(req.body);
        //saving the new community to our database
        const savedCommunity = await newCommunity.save();
        res.status(201).json(savedCommunity);
    } catch(error){
        res.status(500).json({error: 'Failed to create commmunity'});
    }
});

//updating the community
app.put('/api/communities/:id', async (req, res)=>{
    try{
        const updatedCommunity = await Community.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(updatedCommunity);
    } catch(error){
        res.status(500).json({error: 'Failed to add the post to the community ka postIDs array'});
    }
});

//fetching posts
app.get('/api/posts', async (req, res)=>{
    try{
        const posts = await Post.find();
        //sending them as json to frontend
        res.json(posts); 
    }catch(error){
        res.status(500).send('Error rerieving posts');
    }
});

//this will be used for the creae post part
app.post('/api/posts', async (req, res)=>{ //sets up an endpoint that listens for POST requests 
    try{
        //creating a new post object using our mongoose model
        const newPost = new Post(req.body);
        //saving the new post to our database
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch(error){
        res.status(500).json({error: 'Failed to create post 111'});
    }
});

//for updating the post view count, put is for updation
app.put('/api/posts/:id/views', async (req, res)=>{
    try{
        const postID = req.params.id;

        //incrementing the view count by 1
        const updatedPost = await Post.findByIdAndUpdate(
            postID,
            {$inc:{views: 1}}, //incrementing
            {new: true} //because we want the value after updation
        );
        if (!updatedPost){
            return res.status(404).json({error: 'Post not found'});
        }
        //complete the response to client
        res.status(200).json(updatedPost);
    } catch(error){
        console.error('Error updating view count:', error);
        res.status(500).json({error: 'Failed to update view count'});
    }
});

//for updating the post upvote count, put is for updation
app.put('/api/posts/:id/upvotes', async (req, res)=>{
    try{
        const postID = req.params.id;

        //incrementing the view count by 1
        const updatedPost = await Post.findByIdAndUpdate(
            postID,
            {$inc:{upvotes: 1}}, //incrementing
            {new: true} //because we want the value after updation
        );

        const target_post = await Post.findById(postID);
        const creator = target_post.postedBy;

        const updatedUser = await User.findOneAndUpdate(
            { displayName: creator }, // Find the user by displayName
            { $inc: { reputationValue: 5 } }, // Increment reputationValue
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Creator not found' });
        }

        if (!updatedPost){
            return res.status(404).json({error: 'Post not found'});
        }
        //complete the response to client
        res.status(200).json(updatedPost);
    } catch(error){
        console.error('Error updating view count:', error);
        res.status(500).json({error: 'Failed to update view count'});
    }
});

//for updating the comment upvote count, put is for updation
app.put('/api/comments/:id/commentUpvotes', async (req, res)=>{
    try{
        const commentID = req.params.id;

        //incrementing the view count by 1
        const updatedComment = await Comment.findByIdAndUpdate(
            commentID,
            {$inc:{upvotes: 1}}, //incrementing
            {new: true} //because we want the value after updation
        );

        const target_comment = await Comment.findById(commentID);
        const creator = target_comment.commentedBy;

        const updatedUser = await User.findOneAndUpdate(
            { displayName: creator }, // Find the user by displayName
            { $inc: { reputationValue: 5 } }, // Increment reputationValue
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Creator not found' });
        }

        if (!updatedComment){
            return res.status(404).json({error: 'Comment not found'});
        }
        //complete the response to client
        res.status(200).json(updatedComment);
    } catch(error){
        console.error('Error updating view count:', error);
        res.status(500).json({error: 'Failed to update view count'});
    }
});

//for updating the post downvote count, put is for updation
app.put('/api/posts/:id/downvotes', async (req, res)=>{
    try{
        const postID = req.params.id;

        //incrementing the view count by 1
        const updatedPost = await Post.findByIdAndUpdate(
            postID,
            {$inc:{upvotes: -1}}, //incrementing
            {new: true} //because we want the value after updation
        );

        const target_post = await Post.findById(postID);
        const creator = target_post.postedBy;

        const updatedUser = await User.findOneAndUpdate(
            { displayName: creator }, // Find the user by displayName
            { $inc: { reputationValue: -10} }, // Increment reputationValue
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Creator not found' });
        }

        if (!updatedPost){
            return res.status(404).json({error: 'Post not found'});
        }
        //complete the response to client
        res.status(200).json(updatedPost);
    } catch(error){
        console.error('Error updating view count:', error);
        res.status(500).json({error: 'Failed to update view count'});
    }
});

//for updating the comment downvote count, put is for updation
app.put('/api/comments/:id/commentDownvotes', async (req, res)=>{
    try{
        const commentID = req.params.id;

        //incrementing the view count by 1
        const updatedComment = await Comment.findByIdAndUpdate(
            commentID,
            {$inc:{upvotes: -1}}, //incrementing
            {new: true} //because we want the value after updation
        );

         const target_comment = await Comment.findById(commentID);
         const creator = target_comment.commentedBy;

         const updatedUser = await User.findOneAndUpdate(
             { displayName: creator }, // Find the user by displayName
             { $inc: { reputationValue: -10} }, // Increment reputationValue
             { new: true } // Return the updated user document
         );

         if (!updatedUser) {
             return res.status(404).json({ error: 'Creator not found' });
         }

        if (!updatedComment){
            return res.status(404).json({error: 'Comment not found'});
        }
        //complete the response to client
        res.status(200).json(updatedComment);
    } catch(error){
        console.error('Error updating view count:', error);
        res.status(500).json({error: 'Failed to update view count'});
    }
});

// //for updating the reputation of a member, put is for updation
// app.put('/api/users/:id/reputationValue', async (req, res)=>{
//     try{
//         const postID = req.params.id;

//         //incrementing the view count by 1
//         const updatedPost = await Post.findByIdAndUpdate(
//             postID,
//             {$inc:{upvotes: 5}}, //incrementing
//             {new: true} //because we want the value after updation
//         );
//         if (!updatedPost){
//             return res.status(404).json({error: 'Post not found'});
//         }
//         //complete the response to client
//         res.status(200).json(updatedPost);
//     } catch(error){
//         console.error('Error updating view count:', error);
//         res.status(500).json({error: 'Failed to update view count'});
//     }
// });

//for updating post's commentIDs array, (when a comment is made on the post)
app.put('/api/posts/:id', async (req, res)=>{
    try{
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(updatedPost);
    } catch(error){
        res.status(500).json({error:'Failed to update the post ka commentIDs'});
    }
});

//fetching linkflairs
app.get('/api/linkflairs', async (req, res)=>{
    try{
        const linkflairs = await LinkFlair.find();
        //sending them as json to frontend
        res.json(linkflairs); 
    }catch(error){
        res.status(500).send('Error rerieving posts');
    }
});

//this part will be used for creating a new linkflair
app.post('/api/linkflairs', async (req, res)=>{
    try{
        //create a new linkflair object from the model
        const newLinkFlair = new LinkFlair(req.body);
        //save the post in the database
        const savedLinkFlair = await newLinkFlair.save();
        //send message to the client side
        res.status(201).json(savedLinkFlair);
    } catch(error){
        res.status(500).json({error: 'Failed to create linkflair'});
    }
});

//fetching comments
app.get('/api/comments', async (req, res)=>{
    try{
        const comments = await Comment.find();
        //sending them as json to frontend
        res.json(comments); 
    }catch(error){
        res.status(500).send('Error rerieving comments');
    }
});

//this will be used for creating the comments, or like basically we're updating the comments into the databse here
app.post('/api/comments', async (req, res)=>{
    try{
        //creating a new comment using our mongoose model
        const newComment = new Comment(req.body);
        //saving the new comment to our databse
        const savedComment = await newComment.save();
        //send the repsosne to the client side
        res.status(201).json(savedComment);
    } catch(error){
        res.status(500).json({error: 'Failed to save the comment'});
    }
});

//using this to update the comment's commenIDs array (when a reply is added to the comment)
app.put('/api/comments/:id', async (req, res)=>{
    try{
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(updatedComment);
    } catch(error){
        res.status(500).json({error: 'Failed to add comment to comments IDs'});
    }
});

//this will be used to check if a user with the same display name already exists
app.post('/api/check-display-name', async (req, res)=>{
    const {displayName} = req.body;
    try{
        //querying the collection
        const user = await User.findOne({displayName: displayName});
        if (user){
            res.status(200).json({exists: true});
        }
        else{
            res.status(200).json({exists: false});
        }
    } catch(error){
        res.status(500).json({error: 'Error in finding display name'});
    }
});

//fetching users
app.get('/api/users', async (req, res)=>{
    try{
        const users = await User.find();
        //sending them as json to frontend
        res.json(users); 
    }catch(error){
        res.status(500).send('Error rerieving users');
    }
});

//this will be used for creating the user, or like basically we're updating the user into the databse here
app.post('/api/users', async (req, res)=>{
    const {firstName, lastName, email, displayName, password} = req.body;

    try{
        //hashing the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //creating a new user using our mongoose model
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            displayName: displayName,
            passwordHash: hashedPassword,
            role: 'user',
            joinedDate: new Date()
        });
        //saving the new user to our databse
        const savedUser = await newUser.save();
        //send the repsosne to the client side
        res.status(201).json(savedUser);
    } catch(error){
        console.error('Error saving user:', error);
        res.status(500).json({error: 'Failed to save the user'});
    }
});

//this will be used to check if a user with the entered email address exists
app.post('/api/check-email',async (req, res)=>{
    const {email} = req.body;
    try{
        //querying the user collection
        const user = await User.findOne({email: email});
        if (user){
            res.status(200).json({exists: true});
        }
        else{
            res.status(200).json({exists: false});
        }
    } catch(error){
        res.status(500).json({error: 'Error in finding matching email'});
    }
});

//this will be used to check the password
app.post('/api/login', async (req, res)=>{
    const {email, password}  =req.body;

    try{
        //finding the user by email
        const user = await User.findOne({email: email});
        if (!user){
            return res.status(404).json({error: 'User not found'});
        }
        //next compare the passwords
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid){
            return res.status(401).json({error: 'Invalid password'});
        }

        const token = jwt.sign({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                displayName: user.displayName,
                role: user.role,
                joinedDate: user.joinedDate,
                reputationValue: user.reputationValue
            },
         },
        SECRET_KEY,
        {expiresIn:'1h'});

        //since we've receievd the correct password, we'll return the user details
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                displayName:user.displayName,
                role: user.role,
                joinedDate: user.joinedDate,
                reputationValue: user.reputationValue
            }
        });
    } catch(error){
        console.error('Login error');
        res.status(500).json({error: 'Error logging in'});
    }
});

//adding token verification route
app.post('/api/verify-token', (req, res)=>{
    const {token } = req.body;

    jwt.verify(token, SECRET_KEY, (err, decoded) =>{
        if (err){
            return res.status(401).json({message: 'Invalid token'});
        }

        User.findById(decoded.id, (err, user)=>{
            if (err || !user){
                return res.status(404).json({message: 'User not found'});
            }
            res.json({user});
        });
    });
});

//this will be used to check if the same community name exists
app.post('/api/check-community', async (req, res)=>{
    const {communityName} = req.body;
    try{
        //querying the user collection
        const community = await Community.findOne({name: communityName});
        if (community){
            res.status(200).json({exists: true});
        }
        else{
            res.status(200).json({exists: false});
        }
    } catch(error){
        res.status(500).json({error: 'Error in finding a community with same name'});
    }
});

//this will be used to delete a user
app.delete('/api/users/:id', async (req, res)=>{

    try{
        const {id: userID} = req.params;
        //getting the user
        await User.findByIdAndDelete(userID);
        res.json({message: 'User deleted'});
    } catch(error){
        console.error('Error deleting user');
        res.status(500).json({error: 'Server error while deleting user'});
    }
});

//this will be used to delete a community,
//this step requires recursive deletion of all posts in a community
//as well as all comments and replies to comments under a post
app.delete('/api/communities/:id', async (req, res)=>{
    
    try{
        const {id:communityId} = req.params;

        //getting the community
        const community = await Community.findById(communityId);
        if (!community){
            return res.status(404).json({error: 'Error finding community to delete'});
        }

        //since the community was found, delete all posts of the community
        //(and their comments and replies)
        for (const postID of community.postIDs){
            await deletePost(postID);
        }

        //now delete the community
        const deletedCommunity = await Community.findByIdAndDelete(communityId);
        if (!deletedCommunity){
            return res.status(404).json({error: 'Error deeting community'});
        }
        res.json({message: 'Community deleted'});
    } catch(error){
        console.error('Error deleting community');
        res.status(500).json({error: 'Server error while deleting community'});
    }
});

//this function will be sued to delete the post (and will call the function to delete comments)
const deletePost = async (postID) =>{
    try{
        //fetch the post
        const post = await Post.findById(postID);

        if (!post){
            return res.status(404).json({error: 'Error finding post to delete'});
        }

        //since the post was found, recursively delete all comments
        if (post.commentIDs && (post.commentIDs.length > 0)){
            await deleteComments(post.commentIDs);
        }

        //now delete the post
        await Post.findByIdAndDelete(postID);

    } catch(error){
        console.error(`error dleeting post post`);
    }
    
};

//recursive function to delet comments, and replies to comments
const deleteComments = async (commentIDs)=>{

    try{
        //do this for all comments
        for (const commentID of commentIDs){
            //get the comment
            const comment = await Comment.findById(commentID);

            if (!comment){
                return res.status(404).json({error: 'Error finding comment to delete'});
            }
            //since the comment was found, lt's deleete any replies it might have
            if (comment.commentIDs && (comment.commentIDs.length >0)){
                //recurson comes in here
                await deleteComments(comment.commentIDs);
            }

            //now deleting the comment
            await Comment.findByIdAndDelete(commentID);
        }
        
    } catch(error){
        console.error('Error deleting comments');
    }

    
};

//this will be used to delete the post, this is different from 
//the delete post function above since that one calls the function
//from the delete community part
app.delete('/api/posts/:id', async (req, res)=>{
    
    try{
        const {id:postID} = req.params;

        //call the functon we wrote above, to delete the posts
        //(and their comments and replies)
        await deletePost(postID);
        
        res.json({message: 'Post deleted'});
    } catch(error){
        console.error('Error deleting post');
        res.status(500).json({error: 'Server error while deleting post'});
    }
});

//this function will be called to delete the comment and replies to
//a comment, we'll just make use of the function written earlier to
//delete comments recursively
app.delete('/api/comments/:id', async (req, res)=>{
    
    try{
        const {id:commentID} = req.params;

        //call the functon we wrote above, to delete the comment
        //and it's replies
        await deleteComments([commentID,]);
        
        res.json({message: 'Comment deleted'});
    } catch(error){
        console.error('Error deleting comment');
        res.status(500).json({error: 'Server error while deleting comment'});
    }
});

let server;
server = app.listen(port, () => {console.log("Server listening on port 8000...");});

module.exports = {app, server};