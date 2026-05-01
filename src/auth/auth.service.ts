import 'dotenv/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthRegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { UserLoginDto } from './dto/login.dto';
import { nanoid } from 'nanoid';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async register(user: AuthRegisterDto){
        const hashedPassword = await argon2.hash(user.password);

        return this.userService.create({
            email: user.email,
            name: user.name,
            password: hashedPassword
        });
    }

    async login(loginDto: UserLoginDto ){
        const userData = await this.userService.findByEmail(loginDto.email);

        if (!userData) {
            throw new BadRequestException('Invalid credentials');}

        const validatePassword = await argon2.verify(
            userData.password,
            loginDto.password
        );

        if (!validatePassword) {
            throw new BadRequestException('Invalid credentials');
        }

        const {accessToken, refreshToken} = await this.generateTokens(
            userData.id
        )

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async generateTokens(userId: string) {
        const refreshTokenId = nanoid();

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    iss: process.env.JWT_ISSUER,
                    sub: userId
                },
                {expiresIn: '15m'},
            ),
            this.jwtService.signAsync(
                {
                    iss: process.env.JWT_ISSUER,
                    jti: refreshTokenId,
                    sub: userId
                },
                { expiresIn: '7d'},
            ),
        ]);

        const hashedRefreshToken = await argon2.hash(refreshToken);

        await this.prisma.refreshToken.create({
            data: {
                userId,
                id: refreshTokenId,
                token: hashedRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        })

        return {accessToken, refreshToken}
    } 
}
