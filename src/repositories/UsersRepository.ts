import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User";

@EntityRepository('users')
class UsersRepository extends Repository<User> {

}

export { UsersRepository };