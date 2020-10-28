import {
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn
} from 'typeorm'

import Orphanage from './Orphanage'

@Entity('users')
export default class User{

    @PrimaryGeneratedColumn('increment')
    id: Number;

    @Column()
    username: String;

    @Column()
    email: String;

    @Column()
    password: String;

    @Column()
    admin: Boolean;

    @OneToMany(()=>Orphanage, orphanage => orphanage.user_id, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({name: 'orphanage_id'})
    orphanages: Orphanage[]
}
