const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Get /api/users
    router.get('/', (req, res) => {
        // Access our User model and run .findAll() method
        User.findAll({attributes: { exclude: ['password'] } 
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    });
});
    // GET /api/users/1
    router.get('/:id', (req, res) => {
        Post.findOne({
          where: {
            id: req.params.id
          },
          attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
          include: [
            {
              model: Post,
              attributes: ['id', 'post_url', 'title', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
                }
          ]
        })
          .then(dbPostData => {
            if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
            }
            res.json(dbPostData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });

// POST /api/users/
router.post('/', (req, res) => {
    router.post('/', (req, res) => {
        // expects {username: 'lernantino', email: 'learnantino@gmail.com' password: 'password1234'}
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    //expects {username: 'lernantino', email: 'lernantino@gmail.com', passowrd: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
    individualHooks: true,
    where: {
        id: req.params.id
    }
})
.then(dbUserData => {
    if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
    }
    res.json(dbUserData);
})
.catch(err => {
    console.log(err);
    res.status(500).json(err);
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
});

router.post('/login', (req, res) => {
  // expects {email: 'email', password: 'password'}
    User.findOne({
        where: {
            email: req.body.email
        }
}).then(dbUserData => {
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
        res.status(400).json({ message: 'Incorrect email or password' });
        return;
    }
    res.json({ user: dbUserData, message: 'You are now logged in!' });
    if(!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
    }
    res.json({ user: dbUserData });
})
});

module.exports = router;

