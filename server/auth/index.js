const router = require('express').Router()
const { models: {User }} = require('../db')
module.exports = router
const axios = require('axios');

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body)}); 
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.send({token: await user.generateToken()})
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.get('/me', async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization))
  } catch (ex) {
    next(ex)
  }
})

router.get('/github', (req, res, next)=> {
  console.log(process.env.GITHUB_CLIENT_ID);
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`);
  
});

router.get('/github/callback', async(req, res, next)=> {
  try {
    let response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_SECRET_KEY,
      code: req.query.code
    }, {
      headers: {
        accept: 'application/json'
      }
    });
    const { error, access_token } = response.data;
    if(error){
      console.log(error);
      const ex = new Error(error);
      ex.status = 401;
      next(ex);
    }
    else {
      response = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${access_token}`
        }
      });
      const { login, id} = response.data;
      console.log(response);
      const where = {
        username: login,
        githubId: id
      };
      let email_response = await axios.get(`https://api.github.com/user/emails`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `token ${access_token}`
        }
      });
      const emails = email_response.data
      if (emails?.length > 0 ) {
        where.email = emails.sort((a, b) => b.primary - a.primary)[0].email
      }
      let user = await User.findOne({ where });
      if(!user){
        user = await User.create({...where, password: Math.random().toString()});
      }
      const token = require('jsonwebtoken').sign({ id: user.id}, process.env.JWT);
      res.send(`
        <html>
          <head>
            <script>
              window.localStorage.setItem('token', '${ token }');
              window.location = '/';
            </script>
          </head>
          <body>
          ...Signing In
          </body>
        </html>
      `);
    }
  }
  catch(ex){
    next(ex);
  }
});