import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthRegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(registerDto: AuthRegisterDto) {
        const userExists = await this.prisma.user.findUnique({
            where: {email: registerDto.email},
            select: {id: true}
        });

        if (userExists) {
            throw new BadRequestException('Email already registered');
        }

        return await this.prisma.user.create({
            data: {
                email: registerDto.email,
                name: registerDto.name,
                password: registerDto.password,
            }
        });
    }

    async findByIdWithPassword(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {id: id}
        });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    async findByIdWithoutPassword(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {id: id},
            omit: {password: true}
        });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {email: email},
        });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    async update(id: string, updateDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: {id: id},
        });

        if (!user) throw new NotFoundException('User not found');

        return this.prisma.user.update({
            where: {id: id},
            data: {
                name: updateDto.name,
                avatar: updateDto.avatar,
                bio: updateDto.bio,
            },
            omit: {password: true}
        });
        }

        async delete(id: string) {
            const user = await this.prisma.user.findUnique({
                where: {id: id}
            });
            
            if (!user) throw new NotFoundException('User not found');

            return this.prisma.user.delete({
                where: {id: id}
            });
        }

        async updatePassword(id: string, newPassword: string){
            return this.prisma.user.update({
                where: {id: id},
                data: {password: newPassword}
            });
        }

}
