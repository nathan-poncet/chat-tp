// user/user.service.ts
import { Injectable } from '@nestjs/common';
import { User } from 'types/user';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserByClientId(clientId: string): User | undefined {
    return this.users.find((user) => user.clientId === clientId);
  }

  addUser(user: User): User {
    this.users = [...this.users, user];
    return user;
  }

  removeUser(clientId: string): User | undefined {
    const user = this.getUserByClientId(clientId);
    if (user) {
      this.users = this.users.filter((user) => user.clientId !== clientId);
    }
    return user;
  }

  isUsernameTaken(username: string): boolean {
    return this.users.some((user) => user.username === username);
  }
}
