const router = require('express').Router();
const commentRoutes = require('../routes/api/comment-routes');
const router = require('../routes');
const userRoutes = require('../routes/api/user-routes');


const userRoutes = require('./user-routes');

router.use('/users', userRoutes);

router.use('/comments', commentRoutes);

module.exports = router;