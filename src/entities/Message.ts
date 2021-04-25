import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";

@Entity("messages")
class Message {
	@PrimaryColumn()
	id: string;

	@Column()
	admin_id: string;

	@Column()
	text: string;

	@JoinColumn({ name: "user_id" }) //join com qual coluna desta tabela
	@ManyToOne(() => User) //Do tipo usuario
	user: User;
	//Primeira parte(Many) é a classe q estou ; Segunda parte(One) é a classe que defino na linha debaixo

	@Column()
	user_id: string;

	@CreateDateColumn()
	created_at: Date;

	constructor() {
		if(!this.id) {
			this.id = uuid();
		}
	}
}

export { Message };