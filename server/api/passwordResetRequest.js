const router = require('express').Router()
const { models: { User }} = require('../db')

module.exports = router;

router.post('/', async(req,res,next) => {
  try{
    const requestPasswordResetService = await User.requestPasswordReset(req.body.email);
    return res.json(requestPasswordResetService);
  }
  catch(ex){
    next(ex);
  }
});