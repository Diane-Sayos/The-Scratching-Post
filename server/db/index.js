//this is the access point for all things database related!
const db = require('./db');

const User = require('./models/User');
const Post = require('./models/Post');
const Message = require('./models/Message');
const Like = require('./models/Like');
const Comment = require('./models/Comment');
const Photo = require('./models/Photo');
const Connection = require('./models/Connection');
//associations could go here!

User.hasMany(Post);
User.hasMany(Like);
User.hasMany(Comment);
User.hasMany(Photo);
Post.belongsTo(User); //can change if we allow tagging throughout the app
Post.hasMany(Like);
Post.hasMany(Comment);
Post.hasMany(Photo);
Like.belongsTo(Post);
Like.belongsTo(User);
Comment.belongsTo(User);
Comment.belongsTo(Post);
Photo.belongsTo(User);
Photo.belongsTo(Post);
Message.belongsTo(User, { as: 'sender'});
Message.belongsTo(User, { as: 'receiver'});
Connection.belongsTo(User, { as: 'follower'});
Connection.belongsTo(User, { as: 'following'});

//Post = userId
//Like = userId, postId
//Comment = userId, postId
//Photo = userId, postId
//Message = senderId, receiverId
//Connection = followingId (the one who send the request / follow), followerId (the one who was requested / followed)

module.exports = {
  db,
  models: {
    User,
    Post,
    Photo,
    Message,
    Like,
    Comment,
    Connection
  },
};