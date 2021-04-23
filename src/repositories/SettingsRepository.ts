import { Repository, EntityRepository } from "typeorm";
import { Setting } from "../entities/Setting";

@EntityRepository('settings')
class SettingsRepository extends Repository<Setting> {
	// console.log('respository');
}

export { SettingsRepository };