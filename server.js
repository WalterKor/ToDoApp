const express = require('express');
const app = express();
//Json형태로 받아오기위해서
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
//MongoDB
const MongoClient = require('mongodb').MongoClient;
var db; //변수 설정


//set EJS
app.set('view engine', 'ejs');

MongoClient.connect('mongodb+srv://root:koreait@cluster0.swgzj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',(err,client)=>{
    if(err){console.log(err);}

    db = client.db('Todoapp');
    
    app.listen(8080, function () {
        console.log('start server');
    });
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

app.get('/list', (req, res)=>{
    res.render('list.ejs');
});

app.post('/add', (req,res)=>{    

    db.collection('post').insertOne({제목 : req.body.title, 날짜: req.body.date },function (err, result) {
        console.log('Post 저장완료');
    });    
    console.log(req.body.title);
    console.log(req.body.date);
    res.send('전송완료');
});

