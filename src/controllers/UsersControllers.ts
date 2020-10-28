import Users from '../models/User'
import {NextFunction, Request, Response} from 'express'
import * as Yup from 'yup'
import {getRepository} from 'typeorm'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default {
    async create(request: Request, response: Response){
        const {
            username,
            email,
            password
        } = request.body

        //const decoded = await bcrypt.compare('4171800c',request.body.password)
        const userRepository = getRepository(Users)

        const user = userRepository.create({
            username,
            email,
            password,
            admin: false
        })

        await userRepository.save(user)

        return response.json(user)
    },

    async authenticate(request: Request, response: Response){
        const userRepository = getRepository(Users)

        await userRepository.findOneOrFail({
            email: request.body.email
        })
        .then(async(user)=>{
            const password = String(user.password)

            const authorized = await bcrypt.compare(request.body.password, password)
            
            if(!authorized){
                return response.status(401).json({message: 'não autorizado'})
            }
            const token = jwt.sign( {
                id: user.id,
                admin: user.admin
            }, "secret", {
                expiresIn: 86400,
            });
            
            return response.json({
                token,
                message: 'autorized'
            })
        })
        .catch(()=>{
            return response.status(404).json({message: 'not found'})
        })

        
    },

    async show(request: Request, response: Response){
        const userRepository = getRepository(Users)
        const {user} = response.locals

        const User = await userRepository.findOneOrFail({id: user.id}, {
            relations: ['orphanages']
        })
        if(User.id !== user.id){
            return response.status(401).json({message: 'not authorized'})
        }

        return response.json(User.orphanages)
    }
}