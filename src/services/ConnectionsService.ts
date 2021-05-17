import { getCustomRepository, Repository, createQueryBuilder } from "typeorm";
import { Connection } from '../entities/Connection';
import { ConnectionsRepository } from '../repositories/ConnectionsRepository';

interface IConnectionCreate {
	socket_id: string;
	user_id: string;
	admin_id?: string;
}

class ConnectionsService {
	private connectionsRepository: Repository<Connection>;

	constructor() {
		this.connectionsRepository = getCustomRepository(ConnectionsRepository);
	}

	async create({ socket_id, user_id, admin_id }: IConnectionCreate) {
		const connection = this.connectionsRepository.create({
			socket_id,
			user_id,
			admin_id
		});

		await this.connectionsRepository.save(connection);

		return connection;
	}

	async update({ socket_id, user_id}: IConnectionCreate) {
		const updatedConn = await this.connectionsRepository
					.createQueryBuilder()
					.update(Connection)
					.set({ socket_id })
					.where("user_id = :user_id", {
						user_id,
					})
					.execute();

		return updatedConn;
	}

	async findUserById(user_id: string) {
		const connection = await this.connectionsRepository.findOne({user_id});
		
		return connection;
	}

	async findAllWithoutAdmin() {
		const connections = await this.connectionsRepository.find({
			where: { admin_id: null },
			relations: ["user"],
		});

		return connections;
	}

	async findBySocketId(socket_id: string) {
		const conn = await this.connectionsRepository.findOne({ socket_id });

		return conn;
	}
}

export { ConnectionsService };