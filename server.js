const express = require('express');
const app = express();

app.listen(8080, function (params) {
    console.log('hello world');
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/pet', (req, res)=>{
    res.send('섹스.');
});

app.get('/beauty', (req, res)=>{
    res.send('뷰티뷰티.');
});

