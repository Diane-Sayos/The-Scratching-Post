'use strict'
const { faker } = require('@faker-js/faker');
const {db, models: {User, Photo, Post, Message, Comment, Like, Connection} } = require('../server/db')
const crypto = require('crypto');
/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({ id: crypto.randomUUID() ,username: 'cody', password: '123', avatar: faker.image.avatar(), email: 'cody@hotmail.com', bio: faker.random.words(10), isPrivate: false}),
    User.create({ id: crypto.randomUUID() ,username: 'murphy', password: '123', avatar: faker.image.avatar(), email: 'murphy@hotmail.com', bio: faker.random.words(10), isPrivate: false}),
    User.create({id: crypto.randomUUID() ,username: 'didi', password: 'didi', avatar: faker.image.avatar(), email: 'didi@hotmail.com', bio: faker.random.words(10), isPrivate: true}),
    User.create({id: crypto.randomUUID() ,username: 'chris', password: 'chris', avatar: faker.image.avatar(), email: 'chris@hotmail.com', bio: faker.random.words(10), isPrivate: false}),
    User.create({id: crypto.randomUUID() ,username: 'baidi', password: 'baidi', avatar: faker.image.avatar(), email: 'baidi@hotmail.com', bio: faker.random.words(10), isPrivate: false}),
    User.create({id: crypto.randomUUID() ,username: 'eric', password: 'eric', avatar: faker.image.avatar(), email: 'ericblaney@gmail.com', bio: faker.random.words(10), isPrivate:true})
  ]);
  //creating posts
  const posts = await Promise.all([
    Post.create({body: faker.random.words(20), userId: users[0].id}),
    Post.create({body: faker.random.words(20), userId: users[0].id}),
    Post.create({body: faker.random.words(20), userId: users[1].id}),
    Post.create({body: faker.random.words(20), userId: users[1].id}),
    Post.create({body: faker.random.words(20), userId: users[2].id}),
    Post.create({body: faker.random.words(20), userId: users[2].id}),
    Post.create({body: faker.random.words(20), userId: users[3].id}),
    Post.create({body: faker.random.words(20), userId: users[3].id}),
    Post.create({body: faker.random.words(20), userId: users[4].id}),
    Post.create({body: faker.random.words(20), userId: users[4].id}),
    Post.create({body: faker.random.words(20), userId: users[5].id}),
    Post.create({body: faker.random.words(20), userId: users[5].id}),
    Post.create({body: faker.random.words(20), userId: users[5].id}),
    Post.create({body: faker.random.words(20), userId: users[5].id})
  ]);
  //creating photos
  const photos = await Promise.all([
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[0].id, postId: posts[0].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[0].id, postId: posts[1].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[1].id, postId: posts[2].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[1].id, postId: posts[3].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[2].id, postId: posts[4].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[2].id, postId: posts[5].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[3].id, postId: posts[6].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[3].id, postId: posts[7].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[4].id, postId: posts[8].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[4].id, postId: posts[9].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[5].id, postId: posts[10].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[5].id, postId: posts[11].id}),
    Photo.create({photoUrl: faker.image.cats(240, 240, true), userId:  users[5].id, postId: posts[12].id}),
  ]);
  //creating likes
  const likes = await Promise.all([
    Like.create({userId: users[0].id, postId: posts[2].id}),
    Like.create({userId: users[0].id, postId: posts[3].id}),
    Like.create({userId: users[0].id, postId: posts[4].id}),
    Like.create({userId: users[0].id, postId: posts[5].id}),
    Like.create({userId: users[1].id, postId: posts[6].id}),
    Like.create({userId: users[1].id, postId: posts[7].id}),
    Like.create({userId: users[2].id, postId: posts[8].id}),
    Like.create({userId: users[2].id, postId: posts[9].id}),
    Like.create({userId: users[1].id, postId: posts[10].id}),
    Like.create({userId: users[1].id, postId: posts[11].id}),
    Like.create({userId: users[1].id, postId: posts[12].id}),
    Like.create({userId: users[1].id, postId: posts[13].id}),
    Like.create({userId: users[4].id, postId: posts[0].id}),
    Like.create({userId: users[4].id, postId: posts[1].id}),
    Like.create({userId: users[4].id, postId: posts[2].id}),
    Like.create({userId: users[5].id, postId: posts[1].id}),
    Like.create({userId: users[5].id, postId: posts[2].id}),
    Like.create({userId: users[5].id, postId: posts[3].id}),
  ]);
  //creating comments
  const comments = await Promise.all([
    Comment.create({body: faker.random.words(20), userId: users[2].id, postId: posts[2].id}),
    Comment.create({body: faker.random.words(20), userId: users[2].id, postId: posts[3].id}),
    Comment.create({body: faker.random.words(20), userId: users[0].id, postId: posts[4].id}),
    Comment.create({body: faker.random.words(20), userId: users[0].id, postId: posts[5].id}),
    Comment.create({body: faker.random.words(20), userId: users[1].id, postId: posts[6].id}),
    Comment.create({body: faker.random.words(20), userId: users[1].id, postId: posts[7].id}),
    Comment.create({body: faker.random.words(20), userId: users[3].id, postId: posts[8].id}),
    Comment.create({body: faker.random.words(20), userId: users[3].id, postId: posts[9].id}),
    Comment.create({body: faker.random.words(20), userId: users[1].id, postId: posts[10].id}),
    Comment.create({body: faker.random.words(20), userId: users[1].id, postId: posts[11].id}),
    Comment.create({body: faker.random.words(20), userId: users[5].id, postId: posts[0].id}),
  ]);
  const messages = await Promise.all([
    Message.create({text: faker.random.words(10), receiverId:  users[0].id, senderId:  users[1].id}),
    Message.create({text: faker.random.words(10), receiverId:  users[1].id, senderId:  users[0].id}),
    Message.create({text: faker.random.words(10), receiverId:  users[0].id, senderId:  users[1].id}),
    Message.create({text: faker.random.words(10), receiverId:  users[1].id, senderId:  users[0].id}),
    Message.create({text: faker.random.words(10), receiverId:  users[0].id, senderId:  users[1].id}),
    Message.create({text: faker.random.words(10), receiverId: users[3].id, senderId: users[2].id}),
    Message.create({text: faker.random.words(10), receiverId:  users[2].id, senderId: users[3].id}),
    Message.create({text: faker.random.words(10), receiverId: users[3].id, senderId: users[2].id}),
    Message.create({text: faker.random.words(10), receiverId: users[2].id, senderId: users[3].id}),
    Message.create({text: faker.random.words(10), receiverId: users[5].id, senderId: users[4].id}),
    Message.create({text: faker.random.words(10), receiverId: users[4].id, senderId: users[5].id}),
    Message.create({text: faker.random.words(10), receiverId: users[5].id, senderId: users[4].id}),
    Message.create({text: faker.random.words(10), receiverId: users[4].id, senderId: users[5].id}),
  ]);
  const connections = await Promise.all([
    Connection.create({followingId: users[0].id, followerId: users[1].id, isAccepted: true,}),
    Connection.create({followingId: users[0].id, followerId: users[2].id, isAccepted: true,}),
    Connection.create({followingId: users[0].id, followerId: users[3].id, isAccepted: true,}),
    Connection.create({followingId: users[0].id, followerId: users[4].id, isAccepted: true,}),
    Connection.create({followingId: users[1].id, followerId: users[0].id, isAccepted: true,}),
    Connection.create({followingId: users[1].id, followerId: users[3].id, isAccepted: true,}),
    Connection.create({followingId: users[1].id, followerId: users[4].id, isAccepted: true,}),
    Connection.create({followingId: users[1].id, followerId: users[5].id, isAccepted: true,}),
    Connection.create({followingId: users[2].id, followerId: users[0].id, isAccepted: true,}),
    Connection.create({followingId: users[2].id, followerId: users[3].id, isAccepted: true,}),
    Connection.create({followingId: users[2].id, followerId: users[4].id, isAccepted: true,}),
    Connection.create({followingId: users[2].id, followerId: users[5].id, isAccepted: false,}),
    Connection.create({followingId: users[3].id, followerId: users[0].id, isAccepted: true,}),
    Connection.create({followingId: users[3].id, followerId: users[1].id, isAccepted: true,}),
    Connection.create({followingId: users[3].id, followerId: users[2].id, isAccepted: false,}),
    Connection.create({followingId: users[3].id, followerId: users[4].id, isAccepted: true,}),
    Connection.create({followingId: users[4].id, followerId: users[1].id, isAccepted: true,}),
    Connection.create({followingId: users[4].id, followerId: users[2].id, isAccepted: false,}),
    Connection.create({followingId: users[4].id, followerId: users[3].id, isAccepted: true,}),
    Connection.create({followingId: users[4].id, followerId: users[5].id, isAccepted: false,}),
    Connection.create({followingId: users[5].id, followerId: users[0].id, isAccepted: true,}),
    Connection.create({followingId: users[5].id, followerId: users[1].id, isAccepted: true,}),
    Connection.create({followingId: users[5].id, followerId: users[2].id, isAccepted: false,}),
    Connection.create({followingId: users[5].id, followerId: users[4].id, isAccepted: true,})
  ]);
  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
      didi: users[2],
      chris: users[3],
      erik: users[5],
      baidi: users[4]
    },
    messages,
    photos,
    comments,
    likes,
    posts,
    connections
  }
};
/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
};
/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
};
// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false
// , isAccepted: true, isBlocked: false