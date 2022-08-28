import { User, IUser } from 'global-database'

export class UserService{
    private userRepository = User;

    async createNewUser(user:IUser) {
        const userCreated = await this.userRepository.save(user);
        return userCreated;
    }

    async findUserByCpf(cpf: string){
        const findUser = await this.userRepository.findOne({cpf: cpf});
        return findUser;
    }

    async findUserById(id: string){
        const findUser = await this.userRepository.findOne({id: id});
        return findUser;
    }

    async findUserByEmail(email: string){
        const findUser = await this.userRepository.findOne({email: email});
        return findUser;
    }

    async findUserByEmailVerification(code: string){
        const findUser = await this.userRepository.findOne({emailVerification: code});
        return findUser;
    }

    async activateUser(user: IUser){
        user.status = 'active';

        const updateUser = await this.userRepository.save(user);
        return updateUser;
    }

    async deactivateUser(user: IUser){
        user.status = 'inactive';

        const updateUser = await this.userRepository.save(user);
        return updateUser;
    }

    async saveUserUpdates(user: IUser){
        await this.userRepository.save(user);
    }
}