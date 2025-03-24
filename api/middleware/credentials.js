import allowedoption from '../config/allowedoption.js';

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedoption.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

export default credentials;