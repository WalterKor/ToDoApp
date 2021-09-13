const express = require('express');
const app = express();
//Json형태로 받아오기위해서
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


app.listen(8080, function (params) {
    console.log('start server');
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/write', function (req, res) {
    res.sendFile(__dirname + '/write.html')
});

app.get('/pet', (req, res)=>{
    res.send('섹스.');
});

app.get('/beauty', (req, res)=>{
    res.send('뷰티뷰티.');
});

app.post('/add', (req,res)=>{
    console.log(req.body.title);
    console.log(req.body.date);
    res.send('전송완료');
});

