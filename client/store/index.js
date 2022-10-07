import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import auth from './auth';
import messages from './message';
import posts from './post';
import photos from './photo';
import users from './user';
import connections from './connection';

const reducer = combineReducers({ auth, messages, posts, photos, users, connections })
const middleware = applyMiddleware(thunkMiddleware, createLogger({collapsed: true}));
const store = createStore(reducer, middleware);

export * from './auth';
export * from './message';
export * from './photo';
export * from './post';
export * from './user';
export * from './connection';
export default store;