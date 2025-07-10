import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaClient, User } from '../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { ResponseMessage } from 'src/const/response.const';

@Injectable()
export class UserService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDTO.username },
          { email: createUserDTO.email },
        ],
      },
    });
    if (existingUser) {
      throw new BadRequestException('Username hoặc email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDTO,
        password: hashedPassword,
      },
    });
    return user;
  }

  async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDTO,
    });
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllUser(): Promise<User[]> {
    const allUser = await this.prisma.user.findMany();
    if (allUser.length === 0)
      throw new NotFoundException(ResponseMessage.NOT_FOUND);
    return allUser;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(ResponseMessage.NOT_FOUND);
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(ResponseMessage.NOT_FOUND);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(ResponseMessage.NOT_FOUND);
    }
    return user;
  }
}
