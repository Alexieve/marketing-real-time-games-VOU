import express from 'express';
import { currentUser } from '@vmquynh-vou/shared';
import { requireAuth } from '@vmquynh-vou/shared';

const route = express.Router();

route.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
    res.send({currentUser: req.currentUser || null});
});

export {route as currentUserRouter};