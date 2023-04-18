const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');
const withAuth = require('../../utils/auth.js');

router.use('/users', withAuth, userRoutes);
router.use('/posts', withAuth, postRoutes);
router.use('/comments', withAuth, commentRoutes);
module.exports = router;