import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
	async findByEmail(email: string) {
		const usersRepository = await getCustomRepository(UsersRepository);

		const userAlreadyExists = await usersRepository.findOne({email});

		return userAlreadyExists;
	}

	async create(email: string) {
		const usersRepository = await getCustomRepository(UsersRepository);
		
		const user = usersRepository.create({ email });

		await usersRepository.save(user);

		return user;
	}
}

export { UsersService };