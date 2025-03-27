import allowedoption from './allowedoption.js';

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedoption.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Allow request
        } else {
            callback(new Error('Not allowed by CORS')); // Reject
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

export default corsOptions;