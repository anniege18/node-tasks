const cookieParser = (req, res, next) => {
    if (!req.headers['cookie']) return next();

    req.parsedCookies = {};
    req.headers['cookie'].split('; ').forEach(cookie => {
        const [key, value] = cookie.split('=');
        req.parsedCookies[key] = value;
    });
    next();
};

export default cookieParser;