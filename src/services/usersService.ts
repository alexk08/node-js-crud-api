import { v4 as uuidv4, validate } from 'uuid';
import { ApiError } from '../errors/apiError';
import { User } from './types';

export class UsersService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  getUsers() {
    return this.users;
  }

  getUserById(userId: string | undefined) {
    this.validateId(userId);
    const user = this.users.find(({ id }) => userId === id);
    if (!user) throw new ApiError('user_not_exist');
    return user;
  }

  createUser(user: Partial<Omit<User, 'id'>>): User {
    if (!user.age || !user.hobbies || !user.username) {
      throw new ApiError('missing_required_field');
    }

    const { age, hobbies, username } = user;
    const id = uuidv4();
    const newUser = { id, age, hobbies, username };
    this.users.push(newUser);

    return newUser;
  }

  updateUser(userId: string | undefined, upFields: Partial<Omit<User, 'id'>>) {
    this.validateId(userId);
    let updatedUser: User | undefined;
    this.users.map(item => {
      if (userId === item.id) {
        updatedUser = { ...item, ...upFields };
        return updatedUser;
      }
      return item;
    });
    if (!updatedUser) throw new ApiError('user_not_exist');
    return updatedUser;
  }

  deleteUser(userId: string | undefined) {
    this.validateId(userId);
    const idx = this.users.findIndex(({ id }) => userId === id);
    if (idx < 0) throw new ApiError('user_not_exist');
    this.users.splice(idx, 1);
  }

  private validateId(id: string | undefined) {
    if (!id || !validate(id)) throw new ApiError('not_valid_id');
  }
}
