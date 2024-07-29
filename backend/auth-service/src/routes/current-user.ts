import express from 'express';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const route = express.Router();

route.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
    res.send({currentUser: req.currentUser || null});
});

export {route as currentUserRouter};