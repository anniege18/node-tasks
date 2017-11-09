import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';
import FacebookStrategy from 'passport-facebook';
import tokens from './json/tokens.json';

const router = express.Router();

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

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
router.use(passport.initialize());

router.use((req, res, next) => {
    console.info('Cookies:', JSON.stringify(req.parsedCookies, null, 4));
    console.info('Query params:', JSON.stringify(req.parsedQuery, null, 4));
    next();
});

router.get('/products', passport.authenticate('local', { session: false }), getProducts);
router.post('/products', passport.authenticate('local', { session: false }), addProduct);
router.get('/products/:id([0-9]+)', passport.authenticate('local', { session: false }), getProduct);
router.get('/products/:id([0-9]+)/reviews', passport.authenticate('local', { session: false }), getReviews);
router.get('/users', passport.authenticate('local', { session: false }), getUsers);
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;

