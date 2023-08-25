import express from 'express';
import { createAuthor, deleteAuthor, getAuthor, updateAuthor } from '../controllers/author';
import { authorise, login } from '../middlewares/auth';

const  router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', createAuthor)
router.post('/login', login, getAuthor)

router.use('/d', authorise)
router.get('/d/dashboard', getAuthor)
router.post('/d/update', updateAuthor)
router.post('/d/delete', deleteAuthor)


export default router;
