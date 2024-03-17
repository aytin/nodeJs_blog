const express = require('express');
const router = express.Router();
const Post = require('../models/post');

/**
 * GET /
 * HOME 
 */
router.get('', async (req, res) => {
    try {
      const locals = {
        title:"NodeJS Blog",
        body:"Simple Blog with Node.js, Express & MongoDB"
    }

      let perPage = 10;
      let page = req.query.page || 1;

      const data = await Post.aggregate([ { $sort: { createdAt: -1} } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasnextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
          locals,
          data,
          current: page,
          nextPage: hasnextPage ? nextPage : null,
          currentRoute: '/'
        });
        
    } catch (error) {
      console.log(error);
    }

});

/**
 * GET /
 * Posts 
 */

router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      body:"Simple Blog with Node.js, Express & MongoDB",
      
  }
    res.render('post', {
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});

/**
 * POST /
 * Post - search term 
 */

router.post('/search', async (req, res) => {
  try {
  const locals = {
      title:"Search",
      body:"Simple Blog with Node.js, Express & MongoDB"
  }
  
    let searchTerm = req.body.searchTerm;

    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render('search', {
      data,
      locals,
      currentRoute: '/'
    });
  } catch (error) {
    console.log(error);    
  }
});

router.get('/about', (req, res) => {
    res.render('about', {
      currentRoute: '/about'
    });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});

/*
function instertPostData () {
    Post.insertMany([
        {
            title: "Haskell is a standardized, general-purpose purely functional programming language, with non-strict semantics and strong static typing. He looked inquisitively at his keyboard and wrote another sentence. Erlang is a general-purpose, concurrent, functional programming language. She spent her earliest years reading classic literature, and writing poetry. It is also a garbage-collected runtime system.",
            body: "Tuples are containers for a fixed number of Erlang data types."
          },
          {
            title: "I don't even care. Any element of a tuple can be accessed in constant time. Its main implementation is the Glasgow Haskell Compiler. Make me a sandwich. She spent her earliest years reading classic literature, and writing poetry.",
            body: "Initially composing light-hearted and irreverent works, he also wrote serious, sombre and religious pieces beginning in the 1930s."
          },
          {
            title: "They are written as strings of consecutive alphanumeric characters, the first character being lowercase. Atoms are used within a program to denote distinguished values. Where are my pants? Atoms can contain any character if they are enclosed within single quotes and an escape convention exists which allows any character to be used within an atom. She spent her earliest years reading classic literature, and writing poetry.",
            body: "Do you come here often?"
          },
          {
            title: "Ports are created with the built-in function open_port. The Galactic Empire is nearing completion of the Death Star, a space station with the power to destroy entire planets. The arguments can be primitive data types or compound data types. She spent her earliest years reading classic literature, and writing poetry. Atoms can contain any character if they are enclosed within single quotes and an escape convention exists which allows any character to be used within an atom.",
            body: "It is also a garbage-collected runtime system."
          },
          {
            title: "Haskell features a type system with type inference and lazy evaluation. Do you have any idea why this is not working? Its main implementation is the Glasgow Haskell Compiler. They are written as strings of consecutive alphanumeric characters, the first character being lowercase. Messages can be sent to and received from ports, but these messages must obey the so-called \"port protocol.\"",
            body: "She spent her earliest years reading classic literature, and writing poetry."
          },
          {
            title: "The syntax {D1,D2,...,Dn} denotes a tuple whose arguments are D1, D2, ... Dn. Where are my pants? In 1989 the building was heavily damaged by fire, but it has since been restored. Do you have any idea why this is not working? I don't even care.",
            body: "Its main implementation is the Glasgow Haskell Compiler."
          },
          {
            title: "Type classes first appeared in the Haskell programming language. It is also a garbage-collected runtime system. Tuples are containers for a fixed number of Erlang data types. She spent her earliest years reading classic literature, and writing poetry. Haskell features a type system with type inference and lazy evaluation.",
            body: "Haskell is a standardized, general-purpose purely functional programming language, with non-strict semantics and strong static typing."
          },
          {
            title: "The syntax {D1,D2,...,Dn} denotes a tuple whose arguments are D1, D2, ... Dn. Do you come here often? In 1989 the building was heavily damaged by fire, but it has since been restored. Its main implementation is the Glasgow Haskell Compiler. Atoms can contain any character if they are enclosed within single quotes and an escape convention exists which allows any character to be used within an atom.",
            body: "Haskell is a standardized, general-purpose purely functional programming language, with non-strict semantics and strong static typing."
          },
          {
            title: "Haskell features a type system with type inference and lazy evaluation. Do you have any idea why this is not working? Make me a sandwich. It is also a garbage-collected runtime system. Do you come here often?",
            body: "She spent her earliest years reading classic literature, and writing poetry."
          },
          {
            title: "Initially composing light-hearted and irreverent works, he also wrote serious, sombre and religious pieces beginning in the 1930s. Initially composing light-hearted and irreverent works, he also wrote serious, sombre and religious pieces beginning in the 1930s. Do you have any idea why this is not working? It is also a garbage-collected runtime system. She spent her earliest years reading classic literature, and writing poetry.",
            body: "Do you come here often?"
          },
    ])
    
}
*/
//instertPostData();

module.exports = router;