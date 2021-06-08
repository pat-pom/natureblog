const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Dostep zabroniony');

    try{
        const verified = jwt.verify(token, '123#345');
        req.user = verified;
    }catch(err) {
        red.status(400).send('Zly token');
    }
}

