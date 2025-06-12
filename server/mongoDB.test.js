const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const Post = require('./models/posts');
const Comment = require('./models/comments');

describe('MongoDB: Delete Post and associated comments', ()=>{
    let mongoServer;

    beforeAll(async ()=>{
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    });

    afterAll(async()=>{
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('Deleting a post removes it and comments and replies associated with it', async ()=>{
        //creating a post
        const post  = await Post.create({
            title: 'test post',
            content: 'test post content is here',
            postedBy: 'catlady13',
            postedDate: new Date(),
            commentIDs: [],
            views: 10,
            upvotes: 5
        });

        //creating a comment
        const comment1 = await Comment.create({
            content: 'first comment on test post',
            commentIDs:[],
            commentedBy: 'catlady13',
            commentedDate: new Date(),
            upvotes: 2
        });

        const comment2 = await Comment.create({
            content: 'second comment on test post',
            commentIDs:[],
            commentedBy: 'catlady13',
            commentedDate: new Date(),
            upvotes: 6
        });

        //creating a reply 
        const reply1 = await Comment.create({
            content: 'first reply on first comment of test post',
            commentIDs:[],
            commentedBy: 'catlady13',
            commentedDate: new Date(),
            upvotes: 15
        });

        //adding the reply ID to the comment's commentIDs and
        //saving the reply
        comment1.commentIDs.push(reply1._id);
        await reply1.save();

        //adding the comment ID to the post's commentIDs and
        //saving the comments
        post.commentIDs.push(comment1._id);
        post.commentIDs.push(comment2._id);
        await comment1.save();
        await comment2.save();

        //save the post
        await post.save();


        //now simulating the delete part of the test
        await deletePostWithComments(post._id);

        //check the database
        const allCommentIDs = await collectAllCommentIDs(post.commentIDs);
        const remainingComments = await Comment.find({_id: {$in: allCommentIDs}});
        const remainingPost = await Post.findById(post._id);

        //assertions (the expectation)
        expect(remainingPost).toBeNull();
        expect(remainingComments.length).toBe(0);

    });
});


async function deletePostWithComments(postID) {
    // Find the post by ID
    const post = await Post.findById(postID);
  
    if (post) {
      // Recursively delete all comments associated with the post
      if (post.commentIDs && post.commentIDs.length > 0) {
        await deleteCommentsRecursively(post.commentIDs);
      }
  
      // Delete the post itself
      await Post.deleteOne({ _id: postID });
    }
}


async function deleteCommentsRecursively(commentIDs) {
    for (const commentID of commentIDs) {
      // Find the comment by ID
      const comment = await Comment.findById(commentID);
  
      if (comment) {
        // If the comment has replies (commentIDs), delete them recursively
        if (comment.commentIDs && comment.commentIDs.length > 0) {
          await deleteCommentsRecursively(comment.commentIDs);
        }
  
        // Delete the comment itself
        await Comment.deleteOne({ _id: commentID });
      }
    }
}

async function collectAllCommentIDs(commentIDs, collectedIDs = []) {
    for (const commentID of commentIDs) {
      collectedIDs.push(commentID); // Add the current comment ID
      const comment = await Comment.findById(commentID);
      if (comment && comment.commentIDs && comment.commentIDs.length > 0) {
        // Collect nested comment IDs recursively
        await collectAllCommentIDs(comment.commentIDs, collectedIDs);
      }
    }
    return collectedIDs;
} 