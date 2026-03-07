import User from "../entity/User.js";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: User): Promise<void>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
