import { useQuery } from "react-query";
import {Link, useParams } from "react-router-dom"
import './posts.css'

import React, { useState, useEffect } from "react";
import moment from 'moment';
import {FiSend} from "react-icons/fi"
import { FaArrowLeft } from "react-icons/fa6";

import NavBar from "./navbar"
import DecorHeader from "./decorheader";



const useViewport = () => {
    const [width, setWidth] = React.useState(window.innerWidth);
  
    React.useEffect(() => {
      const handleWindowResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleWindowResize);
      return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
  
    // Return the width so we can use it in our components
    return { width };
  }

function PostListItem({post}){
    return(
        <Link key={post.id} to={ `/posts/${post.id}`} className="post-list-item">
            <div className='post-list-item-header'>
                <h1 className="post-list-item-title">{post.title}</h1>
                <span>#{String(post.id).padStart(3,0)}</span>
            </div>
            <div className = 'post-list-item-content'>
                <span>{post.content.substring(0,50)}</span>
            </div>
            <div className='post-list-item-footer'>
                <span>{post.num_comments} {(post.num_comments == 1) ? 'reply':'replies'}</span>
            </div>
        </Link>
    )
}
function PostList({posts, refetch}){
    const [latest, setLatest] = useState(true)
    const [makingPost, setMakingPost] = useState(false)
    const postMade = () =>{
        setMakingPost(false);
        refetch();
    }
    return (
        <div className="post-list">
            <div className="post-list-header">
            <span className = {!latest ? "post-list-header-selected": 'post-list-header-not-selected'} onClick={() =>setLatest(true)}>latest</span>
            <span className = {latest ? 'post-list-header-selected': 'post-list-header-not-selected'} onClick={() =>setLatest(false)}>hot</span>
            </div>
            <div className="make-post-button" onClick={() => setMakingPost(!makingPost)}> make a post</div>
            {makingPost && <PostForm handleSuccess={postMade}/>}
            {latest ? posts.sort((a,b) => b.id - a.id).map((post) => (
                <PostListItem key={post.id} post={post} />
            )): posts.sort((a,b) => b.num_comments - a.num_comments).map((post) => (
                <PostListItem key={post.id} post={post} />
            ))}
        </div>
    )

}

function PostListContainer(){
    const {data , refetch} = useQuery({
        queryKey: ["posts"],
        queryFn: () => (
            fetch("http://parkinglotchronicles.com/api/posts")
            .then((response) => response.json())
        ),
    });
    if(data?.posts) {
        return (
            <div className="post-list-container">
                <PostList posts={data.posts} refetch={refetch}/>
            </div>
        )
    }

}
const PostForm = ({handleSuccess}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://parkinglotchronicles.com/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Failed to post data');
      }

      console.log('Post successful');
      if(file != null){
       const responseJson = await response.json();

        // Then, upload the file using the obtained post ID
        const formData = new FormData();
        formData.append('post_id', responseJson.post.id);
        formData.append('file', file);
        console.log(formData);

        const uploadResponse = await fetch('http://parkinglotchronicles.com/api/posts/uploads', {
        method: 'POST',
        body: formData
        });

        if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
        }
    }
      handleSuccess();
    } catch (error) {
      console.error('Error posting:', error);
      // Handle error, display error message, etc.
    }
  };

  return (
    <div className="form-background" onClick={()=>handleSuccess(false)}>
        <form onSubmit={handleSubmit} className="form-container" onClick={(e) => e.stopPropagation()}>
            <div className="form-title">
                <label htmlFor="title">Title:</label>
                <input
                type="text"
                id="title"
                placeholder="Add title..."
                maxLength="40"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-content">
                <label htmlFor="post-form-content">Content:</label>
                <textarea
                id="post-form-content"
                placeholder="Add some tea..."
                value={content}
                require={true}
                onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="file">Upload File:</label>
                <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*, video/*"
                />
            </div>
            
            <button type="submit" className="form-submit"><FiSend size="30"/></button>
        </form>
    </div>
  );
};

const CommentForm = ({handleSuccess, postId}) => {
    const [content, setContent] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("something")
      
      try {
        const response = await fetch(`http://parkinglotchronicles.com/api/posts/${postId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content })
        });
  
        if (!response.ok) {
          throw new Error('Failed to post data');
        }
  
        console.log('Comment successful');
        handleSuccess();
      } catch (error) {
        console.error('Error Commenting:', error);
        // Handle error, display error message, etc.
      }
    };
  
    return (
      <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            id="comment-input"
            placeholder="Add a comment..."
            value={content}
            required={true}
            onChange={(e) => setContent(e.target.value)}
          />
        <button type="submit"><FiSend size="30px"/></button>
      </form>
    );
  };

function CommentListItem({comment}){
    console.log(comment)
    return(
        <div className='comment-list-item'>
            <div className = 'comment-list-item-content'>
                <p>{comment.content}</p>
                <span>{moment(comment.created_at).fromNow()}</span>
            </div>
        </div>
    )
}
function CommentList({comments}){
    return(
        <div className="comment-list">
            <span style={{fontWeight:"bold", fontSize:"18px"}}>Comments</span>
            {comments.map((comment) => (
            <CommentListItem key={comment.id} comment={comment} />
        ))}
        </div>
    )
}

async function getPostMedia(postId, setIsImage) {
    const res = await fetch(`http://parkinglotchronicles.com/api/posts/uploads/${postId}`);
    const mediaBlob = await res.blob();
    const isImage = isBlobImage(mediaBlob);
    const isVideo = isBlobVideo(mediaBlob);

    if (isImage) {
        setIsImage(true);
        return URL.createObjectURL(mediaBlob);
    } else if (isVideo) {
        setIsImage(false);
        return URL.createObjectURL(mediaBlob);
    } else {
        console.error('Unsupported media type');
        return null;
    }
}

function isBlobImage(blob) {
    // Check if the blob's type starts with 'image/'
    return blob.type.startsWith('image/');
}

function isBlobVideo(blob) {
    // Check if the blob's type starts with 'video/'
    return blob.type.startsWith('video/');
}
function FullPostItem({ postId, mobile }) {
    const [makingComment, setMakingComment] = useState(false);
    const [media, setMedia] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const { data, refetch } = useQuery({
        queryKey: ["posts", postId],
        queryFn: () => (
            fetch(`http://parkinglotchronicles.com/api/posts/${postId}`)
            .then((response) => response.json())
        ),
        enabled: postId !== undefined,
    });
    const handleCommentSuccess = () => {
        setMakingComment(false);
        refetch();
    }

    useEffect(() => {
        // Reset media state to null when postId changes
        setMedia(null);
    }, [postId]);
    
    useEffect(() => {
        if (data && data.post && data.post.has_file) {
            getPostMedia(postId, setIsImage)
                .then(mediaUrl => setMedia(mediaUrl))
                .catch(error => console.error('Error fetching media:', error));
        }
    }, [data, postId]);

    if (data && data.post) {
        return (
            <div className='full-post'>
                {mobile && <Link to={`/posts`} className="mobile_back_button"> <FaArrowLeft /> BACK</Link>}
                <div className='full-post-title'>
                    <span>{data.post.title}</span>
                    <div className='full-post-details'>
                        <span style={{ fontWeight: "bold" }}>#{String(data.post.id).padStart(3, 0)}</span>
                        <span style={{textAlign: "right"}}> {moment(data.post.created_at).fromNow()}</span>
                    </div>
                </div>
                {media && isImage && <img src={media} alt="post-media" style={{width:"80%", alignSelf:"center",justifySelf:"center"}}/>}
                {media && !isImage && <video controls src={media} alt="post-media" style={{width:"80%", alignSelf:"center",justifySelf:"center"}}/>}
                <p className="full-post-content">{data.post.content}</p>
                <div className="comment-list-header" onClick={() => setMakingComment(!makingComment)}> make comment</div>
                {makingComment && <CommentForm handleSuccess={handleCommentSuccess} postId={postId} />}
                <CommentList comments={data.comments.comments} />
            </div>
        );
    }
    return (<h1>idk</h1>);
}

function FullPostItemContainer({postId, mobile}){
    return(
        <div className="full-post-item-container">
            {postId?<FullPostItem postId={postId} mobile={mobile}/>: <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin: 50, marginTop:80}}>
                <img src="../public/assets/hunter.png" alt="no post" width="300"/>
                <span style={{color:"black", fontWeight:"bold", fontSize:24}}>Welcome To PLC's EvenNewerSchoolers</span>
                <span style={{color:"black", fontWeight:"bold", fontSize:24}}>PLAY NICE.</span>
                <span style={{color:"black", fontWeight:"bold", fontSize:24}}>(=^ω^=)</span>
                </div>}
        </div>
    )
}
function MainPage() {
    const {postId} = useParams();
    const {width} = useViewport();
    const breakpoint = 750;

return(
    <div className="main-page">
        <DecorHeader/>
        <NavBar/>
        {width > breakpoint ?
        <div className="main-content">
            {/* <PostForm/> */}
            <PostListContainer/>
            <FullPostItemContainer postId={postId} mobile={false}/>
        </div>: (postId ? <FullPostItemContainer postId={postId} mobile={true}/>: <PostListContainer/>)}
    </div>
)
}

export default MainPage;