import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';
import FacebookStrategy from 'passport-facebook';
import TwitterStrategy from 'passport-twitter';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import config from './config';
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
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());


// Strategies
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
      console.log(token);
      let result = tokens.find(({ token }) => currentToken === token );

      if (result === undefined) {
          done(null, false);
      } else {
          done(null, result, { scope: 'all' })
      }
  }
));

passport.use(new GoogleStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
));

passport.use(new TwitterStrategy({
      consumerKey: config.twitterAuth.consumerKey,
      consumerSecret: config.twitterAuth.consumerSecret,
      callbackURL: config.twitterAuth.callbackURL
  },
  (token, tokenSecret, profile, done) => done(null, profile)
));

passport.use(new FacebookStrategy({
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL
  },
  (accessToken, refreshToken, profile, done) => done(null, profile)
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// log cookies and query
router.use((req, res, next) => {
    console.info('Cookies:', JSON.stringify(req.parsedCookies, null, 4));
    console.info('Query params:', JSON.stringify(req.parsedQuery, null, 4));
    next();
});

// main route with all strategies
router.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
});

// routes for local strategy
router.get('/products', passport.authenticate('bearer', { session: false }), getProducts);
router.post('/products', passport.authenticate('bearer', { session: false }), addProduct);
router.get('/products/:id([0-9]+)', passport.authenticate('bearer', { session: false }), getProduct);
router.get('/products/:id([0-9]+)/reviews', passport.authenticate('bearer', { session: false }), getReviews);
router.get('/users', passport.authenticate('bearer', { session: false }), getUsers);
router.post('/auth',  passport.authenticate('local', { session: false }), authorizePassport);


// to auth with facebook go http://localhost:8080/api-pass/auth/facebook
router.get('/auth/facebook', passport.authenticate('facebook'));

// to auth with twitter go http://127.0.0.1:8080/api-pass/auth/twitter
router.get('/auth/twitter', passport.authenticate('twitter'));

// to auth with google go http://localhost:8080/api-pass/auth/google
router.get('/auth/google', passport.authenticate('google', { scope:
  [ 'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read' ]}));

// redirect in case of success for social strategies auth
router.get('/auth/success', (req, res) => {
    res.send(`${req.user.displayName}, you are successfully logged in with ${req.parsedQuery.q.toUpperCase()}!`);
});

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/api-pass/auth/success?q=google');
    });

router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/api-pass/auth/success?q=twitter');
  });

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
      res.redirect('/api-pass/auth/success?q=facebook');
  });

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;

