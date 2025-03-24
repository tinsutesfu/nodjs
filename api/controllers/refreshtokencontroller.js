import User from'../models/user.js';
import jwt from'jsonwebtoken';

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundUser.roles).filter(Boolean);

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "id": foundUser._id,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60m' }
            );

            res.json({
                accessToken,
                id: foundUser._id,
                username: foundUser.username,
                profilePicture: foundUser.profilePicture || '/images/profile.png',
                roles
            });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export { handleRefreshToken }