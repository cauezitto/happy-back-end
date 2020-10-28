import {Router} from 'express'
const routes = Router()
import OrphanagesController from './controllers/OrphanagesController'
import UsersControllers from './controllers/UsersControllers'
import multer from 'multer'
import uploadConfig from './config/upload'
import bcrypt from 'bcryptjs'
import authMiddleware from './middlewares/auth'

import {Request, Response, NextFunction} from 'express'

const upload = multer(uploadConfig)

routes.post('/orphanages', 
    authMiddleware.auth,
    upload.array('images'),
    OrphanagesController.create
    );

routes.get('/orphanages', 
    OrphanagesController.index
    );

routes.get('/orphanages/:id', 
    OrphanagesController.show
    );

routes.post('/register', 
    authMiddleware.register, 
    UsersControllers.create
    );

routes.post('/auth', 
    UsersControllers.authenticate
    );

routes.get('/me', 
    authMiddleware.auth, 
    UsersControllers.show
    );

routes.delete('/orphanages/:id', 
    authMiddleware.auth,
    OrphanagesController.destroy
    );

routes.put('/orphanages/:id', 
    authMiddleware.auth, 
    upload.array('images'), 
    OrphanagesController.update
    );

// ---! Rotas de administrador !--//

routes.put('/orphanages', 
    authMiddleware.admin,  
    OrphanagesController.approve
    );


export default routes