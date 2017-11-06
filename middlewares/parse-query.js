import { parse } from 'url';

const queryParser = (req, res, next) => {
    const urlParsed = parse(req.url);
    if (!urlParsed.query) return next();
    req.parsedQuery = {};
    urlParsed.query.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) req.parsedQuery[key] = value && value || '';
    });
    next();
};

export default queryParser;