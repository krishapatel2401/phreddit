export default function SearchFunction(posts, comments, search_query) {
    const inputArray = [];
    const searchQueryArray = search_query.toLowerCase().split(' ');
  
    posts.forEach((post) => {
      searchQueryArray.forEach((value) => {
        if (post.title.toLowerCase().includes(value) || post.content.toLowerCase().includes(value)) {
          inputArray.push(post);
        }
      });
    });
  
    // console.log('posts:', posts);
    comments.forEach((comment) => {
      
      searchQueryArray.forEach((value) => {
        if (comment.content.toLowerCase().includes(value)) {
          // console.log('comment:',comment);
          let parentPost = FindParentPost(posts, comments, comment);
          // console.log('found post:', parentPost);
          if (parentPost) inputArray.push(parentPost);

          // console.log('input array:',inputArray);

          // const post = posts.find((p) => p.commentIDs.includes(comment._id));
          // if (post) inputArray.push(post);
        }
      });
    });
  
    // Removing duplicates by converting to a Set and back to an array
    return [...new Set(inputArray)];
  }

  function FindParentPost(posts, comments, requiredComment){

    // console.log('posts:',posts);
    // console.log('requred comment:', requiredComment);

    const post = posts.find((p) => p.commentIDs.includes(requiredComment._id));
    // console.log('found post:', post);
    if (post){
      // console.log('found post:', post);
      return post;
    }
    else{
      for (const comment of comments){
        if (comment.commentIDs.includes(requiredComment._id)){
          // console.log('parent comment:', comment);
          return FindParentPost(posts, comments, comment);
        }
      }

    }

    return null;

  }