import axios from 'axios';

const photos = (state = [], action) => {
    if(action.type === 'SET_PHOTOS'){
        return action.photos;
    }
    else if(action.type === 'ADD_PHOTO'){
        return [action.photo, ...state];
    }
    else if(action.type === 'DELETE_PHOTO'){
        return state.filter(photo => photo.id !== action.photo.id);
    }
    return state;
};

export const setPhotos = () => {
    return async(dispatch) => {
        const photos = (await axios.get('/api/photos', {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        dispatch({type: 'SET_PHOTOS', photos});
    }
};
export const addPhoto = (photo, post, auth) => {
    return async(dispatch) => {
        photo = (await axios.post('/api/photos', {
            photoUrl : photo,
            userId: auth.id,
            postId: post.id,
            date: new Date()
        },
        {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        dispatch({type: 'ADD_PHOTO', photo});
    }
}
export const deletePhoto = (photo) => {
    return async(dispatch) => {
        await axios.delete(`/api/photos/${photo.id}`);
        dispatch({ type: 'DELETE_PHOTO', photo})
    }
}

export default photos;