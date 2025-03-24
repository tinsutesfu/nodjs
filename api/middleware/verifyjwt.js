import jwt from'jsonwebtoken';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            console.log(decoded.UserInfo.id);
            req.username = decoded.UserInfo.username;
            req.user = decoded.UserInfo.id;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

export default verifyJWT