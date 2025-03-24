import express from 'express';
import { addtocart, getcart, removecart} from '../controllers/cartcontroller.js';
import ROLES_LIST from '../config/roles.js';
import verifyRoles from '../middleware/verifyrole.js';

const cartrouter=express.Router();

cartrouter.post('/add',verifyRoles(ROLES_LIST.User), addtocart);
cartrouter.post('/remove',verifyRoles(ROLES_LIST.User),removecart);
cartrouter.get('/get',getcart);


export default cartrouter;