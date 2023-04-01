const express = require('express');
const app = express();
const cors= require('cors');
app.use(express.json())
app.use(cors())
require('./controllers/index')(app);


app.listen(8080,()=>{
    console.log('Server is up now');
})
