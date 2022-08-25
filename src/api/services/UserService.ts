import { User } from "../../database/entities";

export class UserService{
    private userRepository = User;

    async createNewUser(user) {
        try {
            const userCreated = await this.userRepository.save(user);
            const userResponse = {
                id: userCreated.id,
                cpf: userCreated.cpf,
                admin: userCreated.admin
            };

            return userResponse;
        } catch (error) {
            console.log(error);
        }
    }

    async findUserByCpf(cpf: string){
        const findUser = await this.userRepository.findOne({cpf: cpf});
        return findUser;
    }
}