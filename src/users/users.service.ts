import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(data: AuthRegisterDto) {
        const userExists = await this.prisma.user.findUnique({
            where: {username: data.username},
            select: {id: true}
        });

        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        return this.prisma.user.create({
            data: {
                username: data.username,
                name: data.name,
                password: data.password,
            }
        });
    }

    // FINISH USER SERVICE

    getUsers() {
        return this.prisma.user.findMany();
    }

}
