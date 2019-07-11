import { getRepository } from "typeorm";
import { User } from "../entities/user";

export class UserRepository {
    // This will use typeorm
    async find(id : number) {
        return await getRepository(User).findOne(id);
    }
}
