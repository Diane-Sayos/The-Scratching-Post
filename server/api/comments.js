const router = require('express').Router()
module.exports = router
const { isLoggedIn } = require('../middleware')
const Comment = require('../db/models/Comment');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getComments());
  } catch (err) {
    next(err)
  }
});

router.post('/', isLoggedIn, async(req, res, next) => {
  try{
    res.send(await req.user.addComment(req.body));
  } catch(err){
    next(err)
  }
});

router.delete('/:id', async(req,res,next) => {
  try{
    const comment = await Comment.findByPk(req.params.id);
    await comment.destroy();
    res.sendStatus(204)
  }
  catch(err){
    next(err)
  }
})