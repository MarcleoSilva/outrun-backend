import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    createUser(data: Prisma.UserCreateInput){
        return this.prisma.user.create({data: data})
    }

    getUsers() {
        return this.prisma.user.findMany();
    }

}
