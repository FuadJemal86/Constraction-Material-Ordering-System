
const jwt = require('jsonwebtoken')


const validation = async (req, res) => {

    const token = req.cookies['supper-token'];

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        jwt.verify(token, process.env.SUPPER_ADMIN_KEY);
        return res.json({ valid: true });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = { validation }
