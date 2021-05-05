import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateConnections1620252037571 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.createTable(
    		new Table({
    			name: "connections",
    			columns: [
    				{
    					name: "id",
    					type: "uuid",
    					isPrimary: true
    				},
    				{
    					name: "admin_id",
    					type: "uuid",
    					isNullable: true
    				},
    				{
    					name: "user_id",
    					type: "uuid"
    				},
    				{
    					name: "socket_id",
    					type: "varchar"
    				},
    				{
    					name: "created_at",
    					type: "timestamp",
    					default: "now()"
    				},
    				{
    					name: "updated_at",
    					type: "timestamp",
    					default: "now()"
    				}
    			]
    		}) 
    	);

    	await queryRunner.createForeignKey(
    		"connections",
    		new TableForeignKey({
    			name: "fk_connections_users",
    			referencedTableName: "users",
    			referencedColumnNames: ["id"],
    			columnNames: ["user_id"],
    			onDelete: "SET NULL",
    			onUpdate: "SET NULL"
    		})
    	)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.dropForeignKey("connections", "fk_connections_users");
    	await queryRunner.dropTable("connections");
    }

}