var express = require('express');
var router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_TOKEN;
const withAuth = require('../middlewares/auth');



// Endpoints

  // /register
  router.post('/register', async (req, res) => {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password });

      try {
        await user.save();
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: "Error registering new user. Please, try again." });
      }
    });


  // /login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      console.log(user)
      if (!user) 
        res.status(401).json({error: 'User not found'});
      else {
        user.isCorrectPassword(password, function(err, same){
          if (!same)
            res.status(401).json({error: 'Incorrect email or password'});
          
            // jsonwebtoken
            // Generate token - Set Authentication
            // User will stay authenticated for 10 days. Afterwards, it will perform another authentication.
          else {  
            console.log('Successfully')
            const token = jwt.sign({email}, secret, { expiresIn: '10d' });
            res.json({user: user, token: token});       
          }
        })
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Internal error. Please, try again'});
    }
  });



  // Name and Email update.
  router.put('/', withAuth, async function(req, res) {
  const { name, email } = req.body;
  
    try {
      var user = await User.findOneAndUpdate(
        {_id: req.user._id},
        { $set: { name: name, email: email}},
        { upsert: true, 'new': true }
      )
        res.json(user);
    }catch(error){
      res.status(401).json({error: error});
    }
  });



  // Password update.
  router.put('/password', withAuth, async function(req, res) {
    const { password } = req.body;
  
      try {
        var user = await User.findOne({_id: req.user._id})
          user.password = password
          user.save()
        res.json(user);
      }catch(error){
        res.status(401).json({error: error});
      }
  });


  // Delete user.
  router.delete('/', withAuth, async function(req, res) {
    try {
      let user = await User.findOne({_id: req.user._id });
    await user.delete();
      res.json({message: 'User deleted successfully.'}).status(201);
    }catch(error){
      res.status(500).json({error: error});
    }
  });

module.exports = router;
