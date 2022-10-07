const router = require('express').Router()
module.exports = router
const  Photo  = require('../db/models/Photo');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getPhotos());
  } catch (err) {
    next(err)
  }
});

router.post('/', isLoggedIn, async(req, res, next) => {
  try{
    res.send(await req.user.addPhoto(req.body));
  } catch(err){
    next(err)
  }
});

router.delete('/:id', async(req,res,next) => {
  try{
    const photo = await Photo.findByPk(req.params.id);
    await photo.destroy();
    res.sendStatus(204)
  }
  catch(err){
    next(err)
  }
});