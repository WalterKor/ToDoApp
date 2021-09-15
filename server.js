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
    res.render('index.ejs')
});

app.get('/write', function (req, res) {
    res.render('write.ejs')
});

app.get('/list', (req, res)=>{
    
    db.collection('post').find().toArray(function (err, result) {
        console.log(result);
        res.render('list.ejs', { posts : result});
    }); //모든데이터 가져오기
    
});

app.post('/add', (req,res)=>{    
    db.collection('counter').findOne({name: '게시물갯수'}, function (err, result) {
        console.log(result.totalPost);
        var 총게시물갯수 = result.totalPost;

        db.collection('post').insertOne({_id: 총게시물갯수 +1 ,제목 : req.body.title, 날짜: req.body.date },function (err, result) {
            console.log('Post 저장완료');
            db.collection('counter').updateOne({name: '게시물갯수'},{ $inc :  { totalPost:1} }, function (err, result) {
                if(err) return console.log(err);
            });    
        });    
    });
    
    res.send('전송완료');
});

app.delete('/delete', function (req, res) {

    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function (err, result) {
        console.log('삭제완료');
    });
    res.send('삭제완료');
});
