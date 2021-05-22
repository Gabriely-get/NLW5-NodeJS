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

	async updateSocketId(socket_id: string, userid: string) {
		await this.connectionsRepository
			.createQueryBuilder()
			.update(Connection)
			.set({ socket_id })
			.where({ user_id: userid })
			.execute();
	}

	async updateAdminId({ user_id, socket_id }: IConnectionCreate) {
		await this.connectionsRepository
				.createQueryBuilder()
				.update(Connection)
				.set({ admin_id: socket_id })
				.where("user_id = :user_id", { user_id })
				.execute();
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

	async findUserWithoutAdmin(userId: string) {
		const isNull = await this.connectionsRepository.findOne({
			where: {
				admin_id: null,
				user_id: userId
			},
			relations: ["user"],
		});

		return isNull;
	}

	async findBySocketId(socket_id: string) {
		const conn = await this.connectionsRepository.findOne({ socket_id });

		return conn;
	}
}

export { ConnectionsService };