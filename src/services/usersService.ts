import { v4 as uuidv4, validate } from 'uuid';
import { ApiError } from '../errors/apiError.js';

export class UsersService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async createUser(user: Partial<Omit<User, 'id'>>) {
    if (!user.age || !user.hobbies || !user.username) throw new ApiError('missing_required_field');
    const id = uuidv4();
    const newUser = { id, ...user };
    this.users.push(newUser as User);
    return newUser;
  }

  async getUsers() {
    return this.users;
  }

  async getUserById(userId: string | undefined) {
    this.validateId(userId);
    const user = this.users.find(({ id }) => userId === id);
    if (!user) throw new ApiError('user_not_exist');
    return user;
  }

  async updateUser(userId: string, user: Partial<Omit<User, 'id'>>) {
    this.validateId(userId);
    let updatedUser: User | undefined;
    this.users.map(item => {
      if (userId === item.id) {
        updatedUser = { ...item, ...user };
        return updatedUser;
      }
      return item;
    });
    if (!updatedUser) throw new ApiError('user_not_exist');
    return updatedUser;
  }

  async deleteUser(userId: string) {
    this.validateId(userId);
    const idx = this.users.findIndex(({ id }) => userId === id);
    if (idx < 0) throw new ApiError('user_not_exist');
    this.users.splice(idx, 1);
  }

  private validateId(id: string | undefined) {
    if (!id || !validate(id)) throw new ApiError('not_valid_id');
  }
}

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
