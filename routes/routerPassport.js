import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';
import FacebookStrategy from 'passport-facebook';
import TwitterStrategy from 'passport-twitter';
import {
    getProducts,
    addProduct,
    getProduct,
    getReviews
} from './controllers/productsCtrl';
import getUsers from './controllers/usersCtrl';
import { authorizePassport } from './controllers/authCtrl';
import users from './json/users.json';
import tokens from './json/tokens.json';

const router = express.Router();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
router.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'password',
      session: false
  }, (username, password, done) => {
    let user = users.find(({ login }) => username === login);
    if (!user || password !== user.password) {
        done(null, false, 'Invalid login/password');
    } else {
        done(null, user);
    }
  }
));

passport.use(new BearerStrategy(
  (token, done) => {
      let currentToken = token;
      let result = tokens.find(({ token }) => currentToken === token );

      if (result === undefined) {
          done(null, false);
      } else {
          done(null, result, { scope: 'all' })
      }
  }
));

passport.use(new FacebookStrategy({
      clientID: 810393999162470,
      clientSecret: '66aeec00e368e8607b0c2fdd2ded400a',
      callbackURL: "http://localhost:8080/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile.id);
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //     return cb(err, user);
      // });
  }
));

passport.use(new TwitterStrategy({
      consumerKey: '5WGZI6m1smLt9cpbgAZfUbcjn',
      consumerSecret: '1ed78vDzGZAfsOnl1QHmNb4oY887fZQ6s4nOhHmtIpGFOPYbxt',
      callbackURL: 'http://127.0.0.1:8080/api-pass/twitter'
  },
  function(token, tokenSecret, profile, cb) {
      return cb(null, profile);
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

router.use((req, res, next) => {
    console.info('Cookies:', JSON.stringify(req.parsedCookies, null, 4));
    console.info('Query params:', JSON.stringify(req.parsedQuery, null, 4));
    next();
});

router.get('/products', passport.authenticate('bearer', { session: false }), getProducts);
router.post('/products', passport.authenticate('bearer', { session: false }), addProduct);
router.get('/products/:id([0-9]+)', passport.authenticate('bearer', { session: false }), getProduct);
router.get('/products/:id([0-9]+)/reviews', passport.authenticate('bearer', { session: false }), getReviews);
router.get('/users', passport.authenticate('bearer', { session: false }), getUsers);
router.post('/auth',  passport.authenticate('local', { session: false }), authorizePassport);
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/twitter',
  passport.authenticate('twitter', { failureRedirect: '/return' }),
  (req, res) => {
    console.log('!!!!!!!!!!!!!');
      res.send('Hello! You logged in with twitter account');
  });

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;

