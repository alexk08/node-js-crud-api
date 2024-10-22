import { v4 as uuidv4, validate } from 'uuid';
import { ApiError } from '../errors/apiError';
import { BaseUser, User } from '../types';
import { isValidUser } from '../utils';

export class UsersService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async getUsers() {
    return this.users;
  }

  async getUserById(userId: string | undefined) {
    this.validateId(userId);
    const user = this.users.find(({ id }) => userId === id);
    if (!user) throw new ApiError('USER_NOT_EXIST');
    return user;
  }

  async createUser(user: BaseUser) {
    this.validateUser(user);
    const { age, hobbies, username } = user;
    const id = uuidv4();
    const newUser = { id, age, hobbies, username };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string | undefined, user: BaseUser) {
    this.validateId(id);
    this.validateUser(user);
    const idx = this.users.findIndex(item => item.id === id);
    if (idx < 0) throw new ApiError('USER_NOT_EXIST');
    const updatedUser = { ...this.users[idx], ...user };
    this.users[idx] = updatedUser;
    return updatedUser;
  }

  async deleteUser(userId: string | undefined) {
    this.validateId(userId);
    const idx = this.users.findIndex(({ id }) => userId === id);
    if (idx < 0) throw new ApiError('USER_NOT_EXIST');
    this.users.splice(idx, 1);
  }

  private validateId(id: string | undefined) {
    if (!id || !validate(id)) throw new ApiError('NOT_VALID_ID');
  }

  private validateUser(user: BaseUser) {
    if (!isValidUser(user)) throw new ApiError('MISSING_REQUIRED_FIELD');
  }
}
