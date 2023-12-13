const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.JWT_SECRET;

module.exports = {
    authuser: async (req, res, next)=>{

        try {
            const headerToken = await req.header('Authorization');

        if (!headerToken) {
            return res.status(401).json({msg: 'you are not authorized'})
        }

        const verifycurrentLoggedInUserToken = await jwt.verify(headerToken, secretKey)

        req.user = verifycurrentLoggedInUserToken.user;

        next()

        } catch (error) {
            console.log(error)
            return res.status(401).json({msg: 'you are not authorized'})
        }

    }
}
