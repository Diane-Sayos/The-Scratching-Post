const router = require('express').Router()
module.exports = router
const Post = require('../db/models/Post');
const User = require('../db/models/User');
const Photo = require('../db/models/Photo')
const Like = require('../db/models/Like')
const Comment = require('../db/models/Comment')
const { isLoggedIn } = require('../middleware')

router.get('/', async(req, res, next) => {
  try{
    const posts = await Post.findAll({
      include: [
        {model: User},
        {model: Photo},
        {
          model: Like,
          include: [
            {model: User}
          ]
        },
        {
          model: Comment,
          include: [{model: User}]
        }
      ],
      order: [['id', 'DESC']]
    });
    res.send(posts)
  } catch(err){
    next(err)
  }
});

router.get('/:id', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getSinglePost(req.params.id*1));
  } catch (err) {
    next(err)
  }
});

router.post('/', isLoggedIn, async(req, res, next) => {
  try{
    res.send(await req.user.addPost(req.body));
  } catch(err){
    next(err)
  }
});

router.put('/:id',  async(req,res,next) => {
  try{
    const post = await Post.findByPk(req.params.id);
    res.send(await post.update({ ...req.body }));
  }
  catch(err){
    next(err);
  }
})

router.delete('/:id',  async(req,res,next) => {
  try{
    const post = await Post.findByPk(req.params.id)
    await post.destroy();
    res.sendStatus(204);
  }
  catch(err){
    next(err);
  }
})
