var router = require('express').Router();

router.get('/sub/sports',(req, res)=>{
    res.send('스포츠게시판');
});

router.get('/sub/game',(req, res)=>{
    res.send('게임게시판');
});

module.exports = router;
