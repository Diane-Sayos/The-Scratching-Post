try{
  require('../.env.js');
}
catch(ex){
  console.log('running locally? create .env file');
  console.log('deployed? set env variables');
}


const { db } = require('./db')
const PORT = process.env.PORT || 8080
const server = require('./socket');
const seed = require('../script/seed');


const init = async () => {
  try {
    if(process.env.SEED === 'true'){
      await seed();
    }
    else {
      await db.sync()
    }
    // start listening (and create a 'server' object representing our server)
    server.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))
  } catch (ex) {
    console.log(ex)
  }
}

init()
