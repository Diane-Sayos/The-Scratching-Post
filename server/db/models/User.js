const Sequelize = require('sequelize')
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const axios = require('axios');
const crypto = require('crypto');
const Token = require('./Token');
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { Dvr } = require('@mui/icons-material');
const {Op} = require('sequelize')

const SALT_ROUNDS = 5;

const User = db.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
  },
  avatar: {
    type: Sequelize.TEXT
  },
  bio: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  githubId: {
    type: Sequelize.INTEGER
  },
  isPrivate: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = User
// ****************************************************************************************************************************************
//----------------------hooks--------------------------------
const hashPassword = async(user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword)
User.beforeUpdate(hashPassword)
User.beforeBulkCreate(users => Promise.all(users.map(hashPassword)))
// **************************************************************** PHOTOS *****************************************************************
//get all photos
User.prototype.getPhotos = async function(){
  return (await db.models.photo.findAll());
};
//add photo
User.prototype.addPhoto = async function(photo){
  return (await db.models.photo.create(photo));
};
// ***************************************************************** POSTS *******************************************************************
//get specific post
User.prototype.getSinglePost = async function(postId){
  const post = await db.models.post.findOne({
    where: {
      id: postId
    },
    include: [
      {model: User},
      {model: db.models.photo},
      {
        model: db.models.like,
        include: [
          {model: User}
        ]
      },
      {
        model: db.models.comment,
        include: [{model: User}]
      }
    ]
  });
  return post;
};
//add post
User.prototype.addPost = async function(body){
  const post = await db.models.post.create(body);
  return this.getSinglePost(post.id);
};
//***************************************************************** COMMENTS ******************************************************************
//get all comments
User.prototype.getComments = async function(){
  return (await db.models.comment.findAll());
};
//add a comment
User.prototype.addComment = async function(body){
  const comment = await db.models.comment.create(body);
  return this.getSinglePost(comment.postId);
};
//***************************************************************** LIKES *********************************************************************
//get all likes
User.prototype.getLikes = async function(){
  return (await db.models.like.findAll());
};
//add a like
User.prototype.addLike = async function(body){
  const like = await db.models.like.create(body);
  return this.getSinglePost(like.postId);
};
User.prototype.deleteLike = async function(id, body){
  const like = await db.models.like.findByPk(id);
  await like.destroy();
  return this.getSinglePost(body.postId);
};
//***************************************************************** CONNECTIONS ******************************************************************
//get all connections
User.prototype.getConnections = async function(){
  return (await db.models.connection.findAll({
    include: [
      {
        model: User,
        as: 'follower'
      },
      {
        model: User,
        as: 'following'
      }
    ]
  }));
};
User.prototype.getSingleConnection = async function(connectionId){
  const connection = await db.models.connection.findOne({
    where: {
      id: connectionId
    },
    include: [
      {
        model: User,
        as: 'follower'
      },
      {
        model: User,
        as: 'following'
      }
    ]
  });
  return connection;
}
//add connection
User.prototype.addConnection = async function(body){
  const connection = await db.models.connection.create(body);
  return this.getSingleConnection(connection.id);
};
User.prototype.updateConnection = async function(body, id){
  let connection = await db.models.connection.findByPk(id);
  connection = await connection.update(body);
  return this.getSingleConnection(connection.id);
}
User.prototype.deleteConnection = async function(id){
  const connection = await db.models.connection.findByPk(id);
  await connection.destroy();
};
//***************************************************************** MESSAGES ******************************************************************
User.prototype.getFriendMessages = async function(messageId) {
  return await db.models.message.findAll({
    where: {
      [Op.or]: [
        {
          senderId: this.id,
          receiverId: messageId
        },
        {
          senderId: messageId,
          receiverId: this.id
        }
      ]
    }
  });
}
User.prototype.getMessages = async function() {
  return await db.models.message.findAll({
    where: { receiverId: this.id },
    include: [
      {model: User, as: "sender"}
    ],
    order: [['createdAt', 'DESC'],]
  });
}
User.prototype.addMessage = async function(body) {
  return await db.models.message.create(body)
}
//******************************************************* PASSWORD / AUTH RELATED *************************************************************

User.prototype.correctPassword = function(candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function() {
  return jwt.sign({id: this.id}, process.env.JWT)
};

User.authenticate = async function({ username, password }){
  const user = await this.findOne({where: { username }})
  if (!user || !(await user.correctPassword(password))) {
    const error = Error('Incorrect username/password');
    error.status = 401;
    throw error;
  }
  return user.generateToken();
};

User.findByToken = async function(token) {
  try {
    const {id} = await jwt.verify(token, process.env.JWT)
    const user = User.findByPk(id)
    if (!user) {
      throw 'nooo'
    }
    return user
  } catch (ex) {
    const error = Error('bad token')
    error.status = 401
    throw error
  }
};
//***************************************************************** EMAIL RELATED / PASSWORD RESET *********************************************************************
const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: "retrosgamesnyc@gmail.com",
        pass: "smkgzqutvsggeuar" // naturally, replace both with your real credentials or an application-specific password
      },
      tls:{
        rejectUnauthorized: false
    }
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: "retrosgamesnyc@gmail.com",
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error);
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};

User.requestPasswordReset = async (user_email) => {
  const user = await User.findOne({
    where: {
      email: user_email
    }
  });
  if(!user) throw new Error("User does not exist");
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 5);

  await new Token({
    userId: user.id,
    token: hash,
    createdAt: Date.now(),
  }).save();
  const clientURL = "https://capstone-social-media.herokuapp.com"
  const link = `${clientURL}/passwordreset/${resetToken}/${user.username}/${user.id}`;
  sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"./template/requestResetPassword.handlebars");
  return link;
};

User.resetPassword = async (userId, token, password) => {
  console.log('here')
  let passwordResetToken = await Token.findOne({
    where: {
      userId: userId
    }
  });
  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }
  console.log(passwordResetToken);
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const user = await User.findByPk(userId);
  await user.update(
    { password: password }
  );
  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
    "./template/resetPassword.handlebars"
  );
  await passwordResetToken.destroy();
  return true;
};