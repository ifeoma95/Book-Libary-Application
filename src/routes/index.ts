import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Book Lib' });
});

router.get('/login', function(req,res,next){
  res.render('login', {title: "Lib | Login"})
})

router.get('/signup', function(req,res,next){
  res.render('register', {title: "Lib | Signup"})
})

router.post("/", function(req, res, next){
  req.headers.authorization = undefined
  res.clearCookie("token")
  res.redirect("/")

})

export default router;
