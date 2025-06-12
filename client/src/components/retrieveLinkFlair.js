export default function RetrieveLinkFlair({post, linkflairs}){

    // console.log('post object',post); //seeing the entire post object
    // console.log('post linkflair id', post.linkFlairID);
    // linkflairs.map((linkflair)=>console.log('linkflair array mein', linkflair._id));

    //if statement in order to check if the post has the linkflair
    //if yes, then use find in order to search through the LinkFlairID else Null
    const linkflair = post.linkFlairID ? linkflairs.find((linkflair) => linkflair._id === post.linkFlairID) : null;

    return (
        <div style={{ fontStyle: 'italic' }}>
            {linkflair ? linkflair.content : ''}
        </div>
    )
}