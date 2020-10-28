import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class orphanageAuthorization1603566462503 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("orphanages", new TableColumn({
            name: "approved",
            type: 'boolean',
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('orphanages', 'approved')
    }

}
