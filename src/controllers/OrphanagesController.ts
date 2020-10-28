import {getRepository} from 'typeorm'
import Orphanage from '../models/Orphanage'
import {Request, Response} from 'express'
import orphanagesView from '../views/orphanagesView'
import * as Yup from 'yup'

export default {

    async index(request: Request, response:Response){
        const orphanagesRepository = getRepository(Orphanage)
        const {pendencies} = request.query

        const orphanages = await orphanagesRepository.find({
            relations: ['images'],
            where: {
                approved: pendencies? false: true
            }
        })
        
        return response.json(orphanagesView.renderMany(orphanages))
    },

    async show(request: Request, response:Response){
        const orphanagesRepository = getRepository(Orphanage)

        const orphanages = await orphanagesRepository.findOneOrFail(request.params.id, {
            relations: ['images']
        })

        return response.json(orphanagesView.render(orphanages))
    },

    async create(request: Request, response: Response){
        
    const {
        name, 
        latitude, 
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends
        } = request.body
    
    const {
        id: user_id
    } = response.locals.user

        const orphanageRepository = getRepository(Orphanage)

        const requestImages = request.files as Express.Multer.File[]
        const images = requestImages.map(image => {
            return {
                path: image.filename
            }
        })
        
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true'? true : false,
            images,
            user_id,
            approved: false
        }

        const scheema = Yup.object().shape({
            name: Yup.string().required(),
            latitude:  Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
               path: Yup.string().required() 
            }))
        })

        await scheema.validate(data, {
            abortEarly: false //faz retornar todos os error de uma vez
        })
        const orphanage = orphanageRepository.create(data)

        await orphanageRepository.save(orphanage)

        return response.status(201).json(orphanage)

    },

    async update(request: Request, response: Response){
        const {
            name, 
            latitude, 
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
            } = request.body
        
        const { id: user_id } = response.locals.user
    
            const orphanageRepository = getRepository(Orphanage)
    
            const requestImages = request.files as Express.Multer.File[]
            const images = requestImages.map(image => {
                return {
                    path: image.filename
                }
            })
            
            const data = {
                name,
                latitude,
                longitude,
                about,
                instructions,
                opening_hours,
                open_on_weekends: open_on_weekends === 'true'? true : false,
                images,
                user_id
            }

            const scheema = Yup.object().shape({
                name: Yup.string(),
                latitude:  Yup.number(),
                longitude: Yup.number(),
                about: Yup.string().max(300),
                instructions: Yup.string(),
                opening_hours: Yup.string(),
                open_on_weekends: Yup.boolean(),
                images: Yup.array(Yup.object().shape({
                   path: Yup.string() 
                }))
            })
    
            await scheema.validate(data, {
                abortEarly: false //faz retornar todos os error de uma vez
            })

            await orphanageRepository.update({
                id: request.params.id
            },{
                name: data.name,
                about: data.about,
                instructions: data.instructions,
                opening_hours: data.opening_hours,
                open_on_weekends: data.open_on_weekends,
                latitude: data.latitude,
                longitude: data.longitude,
            })
    
    
            return response.send()
    },

    async destroy(request: Request, response: Response){
        const orphanageRepository = getRepository(Orphanage)

        const {id: user_id, admin: is_admin} = response.locals.user

        const orphanage = await orphanageRepository.findOneOrFail({
            id: request.params.id
        },{
            relations: ['user_id']
        }) 

        if(user_id !== orphanage.user_id.id && !is_admin){
            return response.status(401).json({message: 'não autorizado'})
        }

        orphanageRepository.delete(orphanage)

        return response.send()
    },

    async approve(request: Request, response: Response){
        const {id} = request.body

        const orphanageRepository = getRepository(Orphanage)

        const orphanage = await orphanageRepository.findOneOrFail(id)

        await orphanageRepository.update({
            id
        },{
            approved: true
        }) 
        return response.json({message: 'aprovado!'})
        
    }
}