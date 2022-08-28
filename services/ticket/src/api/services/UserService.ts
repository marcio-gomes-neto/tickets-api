import { User } from 'global-database'

export class UserService{
    private userRepository = User;

    async findUserById(id: string){
        const findUser = await this.userRepository.findOne({id: id});
        return findUser;
    }
}