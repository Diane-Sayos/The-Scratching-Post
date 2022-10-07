const router = require('express').Router()
module.exports = router
const { isLoggedIn } = require('../middleware')

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getMessages());
  } catch (err) {
    next(err)
  }
});

router.get('/friend', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getFriendMessages(req.query.messageId));
  } catch (err) {
    next(err)
  }
});

router.post('/', isLoggedIn, async(req, res, next) => {
  try{
    res.send(await req.user.addMessage(req.body));
  } catch(err){
    next(err)
  }
});
