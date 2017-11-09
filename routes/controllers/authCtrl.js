import users from '../json/users.json';

const authorize = (req, res) => {
    let user = users.find(({ login }) => req.body.login === login);
    let resMsg = {
        code: '',
        message: '',
        data: null
    };
    if (!user || req.body.password !== user.password) {
        resMsg.code = 404;
        resMsg.message = 'Not found';
        resMsg.data = 'Invalid login/password';
        res.status(404).json(resMsg);
    } else {
        let payload = { "sub": user.id, "isActive": user.isActive };
        let token = jwt.sign(payload, 'qwertyuzxcvbn', { expiresIn: 100 });
        resMsg.code = 200;
        resMsg.message = 'OK';
        resMsg.data = {
            user: {
                email: user.email,
                username: user.login,
            },
        };
        resMsg.token = token;
        res.status(200).json(resMsg);
    }
};

export default authorize;