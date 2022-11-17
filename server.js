const app = require('./src/routers/app');
const port = 3001
const Client = require('./src/modules/RedisConnection');
const {v4} = require('uuid');


app.listen(port, async() => {


    await Client.connect(
        console.log('Redis Server Connected')
    )
    console.log(`app runing on port ${port}`)
    console.log(`Access to http://localhost:${port}/`);
})