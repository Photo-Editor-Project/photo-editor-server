const mongoose = require('mongoose')
const User = require('../models/user')
const axios = require('axios')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class UserController {

  static signUp(req, res) {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
      .then(function(dataCreated) {
        res.status(200)
          .json(dataCreated)
      }).catch(function(err) {
        // console.log('error on signup')
        res.status(400)
          .json(err)
      })
  }

  static signIn(req, res) {
    User.findOne({ email: req.body.email })
      .then(function(dataUser) {
        if (dataUser) {
          bcrypt.compare(req.body.password, dataUser.password, function(err, result) {
            if (result) {
              User.update({ isLogin: true }, function(err, raw) {
                let token = jwt.sign({ id: dataUser._id, email: dataUser.email }, process.env.JWT_KEY)
                res.status(200)
                res.json({ message: "login successfully", result: token })
              })
            } else {
              res.status(400)
                .json({ msg: 'wrong password' })
            }
          })
        } else {

          res.status(400)
            .json({ msg: 'wrong email or password' })
        }
      })
      .catch(function(err) {
        // console.log('error on sign in')
        res.json(err)
      })
  }

  static signOut(req, res) {
    User.findOne({ email: req.body.email })
      .then(function(dataUser) {
        // console.log(dataUser)
        if (dataUser) {
          User.update({ isLogin: false }, function(err, raw) {
            res.status(200)
              .json({ msg: `${dataUser.name} succeed to logout` })
          })
        } else {
          res.status(400)
            .json({ msg: 'wrong email or password' })
        }
      })
      .catch(function(err) {
        // console.log('error on sign out', err)
        res.json(err)
      })
  }

  static findAll(req, res) {
    User.find()
      .then(function(allUser) {
        res.status(200)
          .json(allUser)
      })
      .catch(function(err) {
        res.status(400)
          .json(err)
      })
  }

  static getSearch(req, res) {
    // console.log('something', req.body.search)
    var url = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
    axios.get(url, {
        headers: {
          'api-key': "cf9b4f4cd0454fd3b15ac584bcc5dd35",
          'query': req.body.search
        }
      })
      .then(function(response) {
        console.log('THIS IS RESPONSE', response.data)
        res.json(response.data)
      })
  }
}

module.exports = UserController