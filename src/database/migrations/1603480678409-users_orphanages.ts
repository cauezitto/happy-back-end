import {MigrationInterface, QueryRunner, TableForeignKey, TableColumn} from "typeorm";

export class usersOrphanages1603480678409 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("orphanages", new TableColumn({
            name: "user_id",
            type: "integer"
        }));

        await queryRunner.createForeignKey('orphanages', new TableForeignKey({
            name: 'UserOrphanage',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }))
    } 

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('orphanages', 'UserOrphanage')
        await queryRunner.dropColumn('orphanages', 'user_id')
    }

}
