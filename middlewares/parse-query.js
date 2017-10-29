const queryParser = (req, res, next) => {
    const url = req.url;
    if (url.indexOf('?') === -1) return next();
    req.parsedQuery = {};
    url.slice(url.indexOf('?') + 1).split('&').forEach(param => {
        const [key, value] = param.split('=');
        req.parsedQuery[key] = value;
    });
    next();
};

export default queryParser;