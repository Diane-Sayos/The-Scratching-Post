import axios from 'axios';

const messages = (state= { messages: [], friendMessages: [], friend: null }, action) => {
	if(action.type === 'SET_MESSAGES'){
		return {
			...state,
			messages: action.messages
		};
	} else if(action.type === 'SET_FRIEND_MESSAGES'){
		return {
			...state,
			friendMessages: action.messages
		};
	} else if(action.type === 'CREATE_MESSAGE'){
		return {
			...state,
			friendMessages: [...state.friendMessages, action.message]
		};
	} else if (action.type === 'SET_FRIEND') {
		return {
			...state,
			friend: action.friend
		}
	}
	return state;
};

//add message
export const addMessage = (text, senderId, receiverId) => {
	return async(dispatch) => {
		const message = (await axios.post('/api/messages', {
				text,
				senderId,
				receiverId,
				date: new Date()
			},
			{
				headers: {
					authorization: window.localStorage.getItem('token')
				}
			})).data;
		dispatch({type: 'CREATE_MESSAGE', message});
	}
};

//get friend messages
export const getFriendMessages = (messageId) => {
	return async(dispatch) => {
		const messages = (await axios.get('/api/messages/friend?messageId=' + messageId,
			{
				headers: {
					authorization: window.localStorage.getItem('token')
				}
			})).data;
		dispatch({type: 'SET_FRIEND_MESSAGES', messages});
	}
};

//get all messages
export const getMessages = () => {
	return async(dispatch) => {
		const messages = (await axios.get('/api/messages',
			{
				headers: {
					authorization: window.localStorage.getItem('token')
				}
			})).data;
		dispatch({type: 'SET_MESSAGES', messages});
	}
};

// get friend information
export const getFriend = (friendId) => {
	return async(dispatch) => {
		const friend = (await axios.get('/api/users/' + friendId,
			{
				headers: {
					authorization: window.localStorage.getItem('token')
				}
			})).data;
		dispatch({type: 'SET_FRIEND', friend});
	}
}

export default messages;