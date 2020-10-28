import {Request, Response, NextFunction} from 'express'
import bcrypt from 'bcryptjs'
import Users from '../models/User'
import {getRepository} from 'typeorm'
import jwt from 'jsonwebtoken'

interface UserInterface{
    id: number,
    email: string
}

export default {
    async register(request: Request, response: Response, next: NextFunction){
        //console.log('to no meio')
        if(!request.body.password){
            return response.status(400).json({message: 'Password expected'})
        }
        request.body.password = await bcrypt.hash(request.body.password, 8);
        next()
    },

    async auth(request: Request, response: Response, next: NextFunction){
        const userRepository = getRepository(Users)

        const bearer = String(request.headers.authorization?.split(' ')[1])

        await jwt.verify(
            bearer, 
            'secret', 
            (err, decoded) => { 
                if (err) {
                    //console.log(err)
                    return response.status(401).send({ auth: false, message: 'Token inválido.' })
                }

                response.locals.user = decoded
            })

        next()
    },

    async admin(request: Request, response: Response, next: NextFunction){
        const userRepository = getRepository(Users)

        const bearer = String(request.headers.authorization?.split(' ')[1])

        //console.log()

        await jwt.verify(
            bearer, 
            'secret', 
            async (err, decoded: any) => { 
                if (err) {
                    //console.log(err)
                    return response.status(401).send({ auth: false, message: 'Token inválido.' })
                }
                
                response.locals.user = decoded

                //console.log(decoded)

                const user = await userRepository.findOneOrFail({
                    id: decoded?.id
                })

                //console.log(user)

                if(!user.admin){
                    return response.status(401).send({ auth: false, message: 'não autorizado' })
                }
            })

        next()
    }
}