const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * 
 * Check Login
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;


if (!token) {
    return res.status(401).json( { message: 'Unauthorized' } );
}

try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
} catch (error) {
    res.status(401).json( { message: 'Unauthorized' } )
}
}


/**
 * GET /
 * ADMIN - Login Page
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title:"Admin",
            body:"Simple Blog with Node.js, Express & MongoDB"
        }
        
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
    console.log(error);
    }
});

/**
 * POST /
 * ADMIN - Check Login
 */
router.post('/admin', async (req, res) => {
    try {

        const { username, password } = req.body;
        
        const user = await User.findOne( { username } );
        
        if (!user) {
            return res.status(401).json( { message:'Invalid credentials'} );
        }
        
        const isPasswordvalid = await bcrypt.compare(password, user.password);

        if (!isPasswordvalid) {
            return res.status(401).json( { message: 'Credentials are wrong' } );
        }
        
        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true});
        res.redirect('/dashboard');
        
    } catch (error) {
    console.log(error);
    }
});

/**
 * GET
 * Admin Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog with Node.js, Express & MongoDB',
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET
 * Admin - Create new Post
 */
router.get('/add-post', authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog with Node.js, Express & MongoDB',
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST
 * Admin - Create new Post
 */
router.post('/add-post', authMiddleware, async (req, res) => {

    try {
        console.log(req.body);

        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/dashboard');

        } catch (error) {
            console.log(error);
        }
        
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET
 * Admin - Create new Post
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
        title: "Edit Post",
        description: "Free NodeJS User Management System"
    };
                
        const data = await Post.findOne({ _id: req.params.id });
        
        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }
});


/**
 * PUT
 * Admin - Create new Post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {

    try {
        
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }
});

/**
 * GET
 * Admin - Logout
 */
router.get('/logout', (req,res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout Successfully.'})
    res.redirect('/');
});

/**
 * DELETE
 * Admin - Delete a Post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    
    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

// /**
//  * POST /
//  * ADMIN - Check Login
//  */
// router.post('/admin', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (req.body.username === 'admin' && req.body.password === 'password') {
//             res.send('You are logged in')
//         } else {
//             res.send('Wrong username or password');
//         }        
//     } catch (error) {
//     console.log(error);
//     }
// });


/**
 * POST /
 * ADMIN - Register
 */
router.post('/register', async (req, res) => {
    try {

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password:hashedPassword });
            res.status(201).json({ message: 'User created', user })
        } catch (error) {
            if (errorcode === 11000) {
                res.status(409).json({ message: 'User already in use'});
            }
            res.status(500).json({ message: 'Internal server error'})
        }        
        
    } catch (error) {
    console.log(error);
    }
});

module.exports = router;