import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
	async findByEmail(email: string) {
		const usersRepository = getCustomRepository(UsersRepository);

		const userAlreadyExists = await usersRepository.findOne(email);

		return userAlreadyExists;
	}

	async create(email: string) {
		const user = usersRepository.create({ email });

		await usersRepository.save(user);

		return user;
	}
}

export { UsersService };