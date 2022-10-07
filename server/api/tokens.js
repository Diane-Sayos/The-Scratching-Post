const { models: { Token }} = require('../db');
const router = require('express').Router()
module.exports = router
const { isLoggedIn } = require('../middleware')

router.get('/', isLoggedIn, async(req,res,next) => {
  try{
    const token = await Token.findOne({where: {userId: req.body.userId}})
    res.send(token);
  }
  catch(error){
    console.log(error);
  }
});