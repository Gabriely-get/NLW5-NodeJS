import { EntiryRepository, Repository } from "typeorm";
import { User } from "../entities/User";

@EntiryRepository('users')
class UserRepository extends Repository<User> {

}

export { UserRepository };