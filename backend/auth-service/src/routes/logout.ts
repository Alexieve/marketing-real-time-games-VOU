import express from 'express';

const route = express.Router();

route.post('/api/auth/logout', (req, res) => {
    req.session = null;

    res.send({});
});

export {route as logoutRouter};