const router = require('express').Router();
const { User, Post, Vote } = require('../../public/models');
const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    User.findAll({attributes: { exclude: ['password'] }})
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// GET /api/users/:id
router.get('/:id', (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at'],
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts',
      },
    ],
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users/
router.post('/', withAuth, (req, res) => {
  // expects {username: 'lernantino', email: 'learnantino@gmail.com' password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/users/:id
router.put('/:id', withAuth, (req, res) => {
  //expects {username: 'lernantino', email: 'lernantino@gmail.com', passowrd: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /

// DELETE /api/users/:id
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
        id: req.params.id,
        },
    })
        .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
        });
    });

// POST /api/users/login
router.post('/login', withAuth, (req, res) => {
    User.findOne({
        where: {
        email: req.body.email,
        },
    }).then((dbUserData) => {
        if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
        }
    
        const validPassword = dbUserData.checkPassword(req.body.password);
    
        if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
        }
    
        req.session.save(() => {
        // declare session variables
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
    
        res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
    });

// POST /api/users/logout
router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
        res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
    });

module.exports = router;
