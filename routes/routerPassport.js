import express from 'express';
import { readFile, writeFile } from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { promisify } from 'util';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';
import FacebookStrategy from 'passport-facebook';
import { awaitTo } from '../helpers';
import users from './json/users.json';
import products from './json/products.json';
import tokens from './json/tokens.json';

const currentUsers = [{
        id: 0,
        login: 'ivan',
        password: 'abc',
        email: 'ivan@gmail.com',
        isActive: true,
    },
    {
        id: 1,
        login: 'helen',
        password: '222',
        email: 'helen@xyz.com',
        isActive: true,
    }];

// setup local strategy
passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'password',
      session: false
  }, (username, password, done) => {
    let user = currentUsers.find(({ login }) => username === login);
    if (!user || password !== user.password) {
        done(null, false, 'Invalid login/password');
    } else {
        console.log(user);
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


const writeFileAsync = promisify(writeFile);

const resolveUrl = url => path.resolve(__dirname, url);
const productsFilename = resolveUrl('./json/products.json');

const router = express.Router();

const setProducts = (products) => awaitTo(writeFileAsync(productsFilename, JSON.stringify(products, null, 2)));

router.use(passport.initialize());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.use((req, res, next) => {
    console.info('Cookies:', JSON.stringify(req.parsedCookies, null, 4));
    console.info('Query params:', JSON.stringify(req.parsedQuery, null, 4));
    next();
});

router.get('/products', passport.authenticate('bearer', { session: false }), (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    res.type('json');
    res.status(200).json({ products });
});

router.post('/products', passport.authenticate('bearer', { session: false }), async (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    req.body.id = products.length;
    products.push(req.body);
    const [error] = await setProducts(products);
    if (error) {
        res.sendStatus(500);
        return;
    }

    res.status(200).json(req.body);
});

router.get('/products/:id([0-9]+)', passport.authenticate('bearer', { session: false }), (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    const filteredProduct = products.find(product => product.id === Number(req.params.id));
    if (!filteredProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }
    res.type('json');
    res.status(200).json(filteredProduct);
});

router.get('/products/:id([0-9]+)/reviews', passport.authenticate('bearer', { session: false }), (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    const filteredProduct = products.find(product => product.id === Number(req.params.id));

    if (!filteredProduct) {
        res.status(404).json({ error: 'Product not found' });
    } else if (!filteredProduct['reviews']) {
        res.status(404).json({ error: 'Product reviews not found' });
    } else {
        res.status(200).send(filteredProduct['reviews']);
    }
});

router.get('/users', passport.authenticate('bearer', { session: false }), (req, res) => {
    if (!users) {
        res.status(404).json({ error: 'Users not found' });
    }

    res.type('json');
    res.status(200).json({ users });
});

router.post('/auth',  passport.authenticate('local', { session: false }), (req, res) => {
    console.log(req.user.id);
    const token = tokens.find(({ id }) => req.user.id === id);
    console.log('token', token);
    res.status(200).json(token);
});

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;