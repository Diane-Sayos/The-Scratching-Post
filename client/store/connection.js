import axios from 'axios';

const connections = (state = [], action) => {
    if(action.type === 'SET_CONNECTIONS'){
        return action.connections;
    }
    else if(action.type === 'ADD_CONNECTION'){
        return [action.connection, ...state];
    } else if(action.type === 'UPDATE_CONNECTION'){
        return state.map(connection => connection.id === action.connection.id ? action.connection : connection);
    }
    else if(action.type === 'DELETE_CONNECTION'){
        return state.filter(connection => connection.id !== action.connection.id);
    }
    return state;
};

export const setConnections = () => {
    return async(dispatch) => {
        const connections = (await axios.get('/api/connections', {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        dispatch({type: 'SET_CONNECTIONS', connections});
    }
};
export const addConnection = (following, follower) => {
    return async(dispatch) => {
        let connection = {};
        if(follower.isPrivate){
            connection = (await axios.post('/api/connections', {
                followingId: following.id,
                followerId: follower.id,
                isAccepted: false
            },
            {
                headers: {
                    authorization: window.localStorage.getItem('token')
                }
            })).data;

            dispatch({type: 'ADD_CONNECTION', connection});
        } else {
            connection = (await axios.post('/api/connections', {
                followingId: following.id,
                followerId: follower.id,
                isAccepted: true
            },
            {
                headers: {
                    authorization: window.localStorage.getItem('token')
                }
            })).data;
            dispatch({type: 'ADD_CONNECTION', connection});
        }
    }
};
export const updateConnection = (connection, following, follower) => {
    return async(dispatch) => {
        connection = (await axios.put(`/api/connections/${connection.id}`, {
            followingId: following.id,
            followerId: follower.id,
            isAccepted: true
        }, {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        })).data;
        dispatch({type: 'UPDATE_CONNECTION', connection})
    }
};
export const deleteConnection = (connection) => {
    return async(dispatch) => {
        await axios.delete(`/api/connections/${connection.id}`, {
            headers: {
                authorization: window.localStorage.getItem('token')
            }
        });
        dispatch({type: 'DELETE_CONNECTION', connection})
    }
};
export default connections;