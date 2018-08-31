const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // console.log(req.headers['token']);
        const token = req.headers['token'];
        console.log(token);
        console.log(process.env.JWT_KEY);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            message : "Auth Failed",
            error: error,
        });
    }
}