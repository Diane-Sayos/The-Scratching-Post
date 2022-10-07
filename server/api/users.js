const router = require('express').Router()
const { models: { User }} = require('../db')
module.exports = router
const { isLoggedIn } = require('../middleware')

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: {exclude: ['password']}
    })
    res.send(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.send(user)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', isLoggedIn, async(req,res,next) => {
  try{
    const user = await User.findByPk(req.params.id);
    await user.update(req.body);
    res.status(200).send(user);
  }
  catch(err){
    next(err);
  }
});