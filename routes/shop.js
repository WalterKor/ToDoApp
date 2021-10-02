var router = require('express').Router();

// router.use('/shitrs', loginConfirm);

function loginConfirm(req, res ,next) {
    if(req.user){
        next();
    }else{
        res.send('로그인하세요');
    }
};


router.get('/shirt', (req, res)=>{
    res.send('셔츠를 파는 페이지입니다.');
});

router.get('/pants', (req, res)=>{
    res.send('바지를 파는 페이지입니다.');
});

module.exports = router;


