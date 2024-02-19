import { v4 as uuidv4 } from 'uuid';

export class UsersService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async createUser(user: Omit<User, 'id'>) {
    const id = uuidv4();
    const newUser = { id, ...user };
    this.users.push(newUser);
    return newUser;
  }

  async getUsers() {
    return this.users;
  }

  async getUserById(userId: string) {
    const user = this.users.find(({ id }) => userId === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUser(userId: string, user: Partial<Omit<User, 'id'>>) {
    let updatedUser: User | undefined;
    this.users.map(item => {
      if (userId === item.id) {
        updatedUser = { ...item, ...user };
        return updatedUser;
      }
      return item;
    });
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const idx = this.users.findIndex(({ id }) => userId === id);
    if (idx < 0) throw new Error('User not found');
    this.users.splice(idx, 1);
  }
}

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
