import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthRegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { UserLoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtServce: JwtService,
        private readonly prismaService: PrismaService
    ) {}

    async register(user: AuthRegisterDto){
        const hashedPassword = await argon2.hash(user.password);

        return this.userService.create({
            username: user.username,
            name: user.name,
            password: hashedPassword
        });
    }

    // NEED TO FINISH USER SERVICE TO CONTINUE
}
