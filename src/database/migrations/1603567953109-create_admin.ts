import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import bcrypt from 'bcryptjs'
import User from '../../models/User'

export class createAdmin1603567953109 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = getRepository(User)

        const user = await userRepository.create({
            email: 'admin@admin',
            password: await bcrypt.hash('admin@admin', 8),
            username: 'admin',
            admin: true
        })

        await userRepository.save(user)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userRepository = getRepository(User)

        const admins = await userRepository.find({
            email: 'admin@admin',
            username: 'admin'
        })

        admins.map( async admin => await userRepository.delete(admin))
    }

}
