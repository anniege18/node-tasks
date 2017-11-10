import jwt from 'jsonwebtoken';
import users from '../json/users.json';
import tokens from '../json/tokens.json';

export const authorizeJWT = (req, res) => {
    let user = users.find(({ login }) => req.body.login === login);
    if (!user || req.body.password !== user.password) {
        const code = 404;
        const message = 'Not found';
        const data = 'Invalid login/password';
        res.status(404).json({ code, message, data });
    } else {
        const payload = { "sub": user.id, "isActive": user.isActive };
        const token = jwt.sign(payload, 'qwertyuzxcvbn', { expiresIn: 100 });
        const code = 200;
        const message = 'OK';
        const data = {
            user: {
                email: user.email,
                username: user.login,
            },
        };
        res.status(200).json({ code, message, data, token });
    }
};

export const authorizePassport = (req, res) => {
    const token = tokens.find(({ id }) => req.user.id === id);
    if (!token) {
        res.sendStatus(500);
        return;
    }
    res.status(200).json(token);
};

