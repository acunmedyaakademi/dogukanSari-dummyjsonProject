import { useEffect, useState } from "react";
import './Postandcomments.css';
import SearchBar from './SearchBar';

export default function Postandcomments() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); 
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false); 
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  async function getPosts() {
    const skip = (page - 1) * limit;
    const fetchUrl = `https://dummyjson.com/posts?delay=0&limit=${limit}&skip=${skip}`;

    const dataPost = await fetch(fetchUrl).then(res => res.json());
    setPosts([...dataPost.posts]);
    setFilteredPosts([...dataPost.posts]); 
    setTotal(dataPost.total);
  }

  async function fetchComments(postId) {
    const fetchUrl = `https://dummyjson.com/posts/${postId}/comments`;
    const dataComments = await fetch(fetchUrl).then(res => res.json());
    setComments([...dataComments.comments]); 
  }

  useEffect(() => {
    getPosts();
  }, [page]);

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredPosts(posts); 
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered); 
    }
  };

  function handleShowComments(post) {
    setSelectedPost(post); 
    fetchComments(post.id);
    setShowCommentsModal(true);
  }

  function closeModal() {
    setShowCommentsModal(false);
    setComments([]);
  }

  return (
    <>
      <div className="containerPostAndProducts">
        <h2>Post And Comments Page</h2>

        <SearchBar onSearch={handleSearch} />

        <div className="posts">
          {filteredPosts.map(x => (
            <div className="postItem" key={x.id}>
              <h4>{x.title}</h4>
              <hr />
              <p>{x.body}</p>
              <p><b>Tags:</b> {x.tags.join(', ')}</p>
              <ul>
                <li>Likes: {x.reactions.likes}</li>
                <li>Dislikes: {x.reactions.dislikes}</li>
                <li>Views: {x.views}</li>
              </ul>
              <button onClick={() => handleShowComments(x)}>Click to see comments</button>  
            </div>
          ))}
        </div>
        
        {showCommentsModal && selectedPost && (
          <div className="modal" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <h2>Comments for: {selectedPost.title}</h2>
              {comments.length > 0 ? (
                <ul>
                  {comments.map(comment => (
                    <li key={comment.id}>
                      <p><b>{comment.user.username}</b>: {comment.body}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments available.</p>
              )}
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
