import axios from 'axios';

const posts = (state=[], action) => {
    if(action.type === 'SET_POSTS'){
        return action.posts;
    }
    else if(action.type === 'CREATE_POST'){
        return [action.post, ...state];
    }
    else if(action.type === 'UPDATE_POST'){
        return state.map(post => post.id === action.post.id ? action.post : post);
    }
    else if(action.type === 'DELETE_POST'){
        return state.filter(post => post.id !== action.post.id);
    }
    return state;
};

export const setPosts = () => {
    return async(dispatch) => {
        const posts = (await axios.get('/api/posts')).data;
        dispatch({type: 'SET_POSTS', posts});
    };
    
};

export const deletePost = (post) => {
    return async(dispatch) => {
        await axios.delete(`/api/posts/${post.id}`);
        dispatch({ type: 'DELETE_POST', post})
    }
}

export const createPost = (body, auth) => {
    return async(dispatch) => {
        const post = (await axios.post('/api/posts', {
            body: body,
            userId: auth.id,
            date: new Date()
        },
        {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        return post;
    }
};

export const updatePost = (postId, body) => {
    return async(dispatch) => {
        const post = (await axios.put('/api/posts/' + postId, {
            body: body
          },
          {
              headers: {
                  authorization: window.localStorage.getItem('token')
              }
          })).data;
        return post;
    }
};

export const getSinglePost = (post) => {
    return async(dispatch) => {
        post = (await axios.get(`/api/posts/${post.id}`, {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        dispatch({type: 'CREATE_POST', post});
    }
};
//add like
export const addLike = (authId, postId) => {
    return async(dispatch) => {
        const post = (await axios.post('/api/likes', {
            userId: authId,
            postId: postId
        },
        {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        dispatch({type: 'UPDATE_POST', post});
    }
};
//delete like
export const deleteLike = (likeId, postId) => {
    return async(dispatch) => {
        const post = (await axios.put(`/api/likes/${likeId}`, { postId }, {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        dispatch({type: 'UPDATE_POST', post})
    }
};
//add comment
export const addComment = (comment, postId, authId) => {
    return async(dispatch) => {
        const post = (await axios.post('/api/comments', {
            body : comment,
            userId: authId,
            postId: postId,
            date: new Date()
        },
        {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        dispatch({type: 'UPDATE_POST', post});
    }
};

export const deleteComment = (comment) => {
    return async(dispatch) => {
        await axios.delete(`/api/comments/${comment.id}`);
        const post = (await axios.get(`/api/posts/${comment.postId}`,
        {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;

        dispatch({type: 'UPDATE_POST', post})
    }
};

export default posts;