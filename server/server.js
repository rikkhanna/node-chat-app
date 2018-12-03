const express = require('express');
const app = express();
const path = require('path');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));

// app.get('/me',(req,res)=>{
//     res.send(publicPath+'index.html');
// });

app.listen(port,()=>{
    console.log(`starting at ${port}`);
});

// console.log(publicPath);