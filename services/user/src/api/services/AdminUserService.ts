import { User, IUser } from 'global-database'

export class AdminUserService{
    private userRepository = User;

    async getAllUsers(){
        const allUsers = this.userRepository.find({
            select:['id', 'email', 'name', 'phone', 'status', 'createdAt']
        })

        return allUsers
    }

    async getAllUsersByStatus(status: string){
        const allUsers = this.userRepository.find({ 
            select:['id', 'email', 'name', 'phone', 'status', 'createdAt'],
            where: { status }
        })

        return allUsers
    }

}