const express = require('express');
const app = express();
//Json형태로 받아오기위해서
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
//MongoDB
const MongoClient = require('mongodb').MongoClient;
var db; //변수 설정
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


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
    
    res.redirect('/list');
});

app.delete('/delete', function (req, res) {
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function (err, result) {
        console.log('삭제완료');
        res.status(200).send({ message : '성공했습니다.'}); //응답코드 성공했습니다.
    })
});

app.get('/detail', function (req, res) {
    res.render('detail.ejs');
})

app.get('/detail/:id', function (req, res) {
    db.collection('post').findOne({_id: parseInt(req.params.id)}, function (err, result) {
        console.log(result);
        res.render('detail.ejs', {data : result});
    })
})

app.get('/edit/:id', function (req, res) {
    db.collection('post').findOne({_id: parseInt(req.params.id)}, function (err, result) {
        console.log(result);
        res.render('edit.ejs', {data : result});
    })
})

app.put('/edit', function (req, res) {
    //폼에 담긴 제목 데이터, 날짜데터를 가지고 
    //db.collection에다가 업데이트함
    db.collection('post').updateOne({_id : parseInt(req.params.id) },{$set : {제목: req.body.title, 날짜: req.body.date }}, function (err, result) {
        console.log(err);
        console.log('수정완료')
    })
    res.redirect('/list')
});

const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const passport = require('passport');

app.use(session({
    secret: '비밀코드',
    resave: true,
    saveUninitialized: false
}));

 app.use(passport.initialize());
 app.use(passport.session());
 
 app.get('/login', function (req, res) {
     res.render('login.ejs')
 })
 app.post('/login', passport.authenticate('local', {
    failureRedirect: '/fail'
 }), function (req, res){
    res.redirect('/')
 });
 
passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true, /*세션에 정보를 저장할것인지*/
    passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
    console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (err, result) {
        if (err) return done(err)

        if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
        if (입력한비번 == result.pw) {  
            return done(null, result)
        } else {
            return done(null, false, { message: '비번틀렸어요' })
        }
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user.id)
});
passport.deserializeUser(function (아이디, done) {
    done(null,{})
});

app.get('/mypage', loginConfirm , function (req, res) {
    res.render('mypage.ejs')
});

/*미들웨어민들기*/
function loginConfirm(req, res ,next) {
    if(res.user){
        next();
    }else{
        res.send('로그인하세요');
    }
}