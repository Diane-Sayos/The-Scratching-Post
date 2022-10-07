const router = require('express').Router()
module.exports = router
const { isLoggedIn } = require('../middleware')

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getLikes());
  } catch (err) {
    next(err)
  }
});

router.post('/', isLoggedIn, async(req, res, next) => {
  try{
    res.send(await req.user.addLike(req.body));
  } catch(err){
    next(err)
  }
});

router.put('/:id', isLoggedIn, async(req, res, next) => {
  try{
    res.send(await req.user.deleteLike(req.params.id*1, req.body));
  } catch(err){
    next(err)
  }
});