
const router = require('express').Router()
const { models: { User }} = require('../db')

module.exports = router;

router.post('/', async(req,res,next) => {
  try{
    const resetPasswordService = await User.resetPassword(
      req.body.userId,
      req.body.token,
      req.body.password
    );
    return res.json(resetPasswordService);
  }
    catch(ex){
      next(ex);
  }
});