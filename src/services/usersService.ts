import { v4 as uuidv4, validate } from 'uuid';
import { ApiError } from '../errors/apiError';
import { BaseUser, User } from '../types';
import { isValidUser } from '../utils';
import { readFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import { resolve } from 'url';

export class UsersService {
  private pathToData: string;

  constructor() {
    this.pathToData = resolve(__dirname, '../data.json');
  }

  private async readData() {
    try {
      const json = await readFile(this.pathToData, { encoding: 'utf-8' });
      const { users } = (json ? JSON.parse(json) : { users: [] }) as { users: User[] };
      return users;
    } catch (err) {
      throw new ApiError('OTHER_ERROR');
    }
  }

  private async writeData(users: User[]) {
    return new Promise<void>((resolve, reject) => {
      const json = JSON.stringify({ users }, null, 2);
      const writable = createWriteStream(this.pathToData);

      writable.on('error', () => {
        reject(new ApiError('OTHER_ERROR'));
      });

      writable.on('finish', () => {
        resolve();
      });

      writable.write(json);
      writable.end();
    });
  }

  async getUsers() {
    return await this.readData();
  }

  async getUserById(userId: string | undefined) {
    this.validateId(userId);
    const users = await this.readData();
    const user = users.find(({ id }) => userId === id);
    if (!user) throw new ApiError('USER_NOT_EXIST');
    return user;
  }

  async createUser(user: BaseUser) {
    this.validateUser(user);
    const { age, hobbies, username } = user;
    const id = uuidv4();
    const newUser = { id, age, hobbies, username };
    const users = await this.readData();
    users.push(newUser);
    await this.writeData(users);
    return newUser;
  }

  async updateUser(id: string | undefined, user: BaseUser) {
    this.validateId(id);
    this.validateUser(user);
    const users = await this.readData();
    const idx = users.findIndex(item => item.id === id);
    if (idx < 0) throw new ApiError('USER_NOT_EXIST');
    const updatedUser = { ...users[idx], ...user };
    users[idx] = updatedUser;
    await this.writeData(users);
    return updatedUser;
  }

  async deleteUser(userId: string | undefined) {
    this.validateId(userId);
    const users = await this.readData();
    const idx = users.findIndex(({ id }) => userId === id);
    if (idx < 0) throw new ApiError('USER_NOT_EXIST');
    users.splice(idx, 1);
    await this.writeData(users);
  }

  async flushDB() {
    await this.writeData([]);
  }

  private validateId(id: string | undefined) {
    if (!id || !validate(id)) throw new ApiError('NOT_VALID_ID');
  }

  private validateUser(user: BaseUser) {
    if (!isValidUser(user)) throw new ApiError('MISSING_REQUIRED_FIELD');
  }
}
