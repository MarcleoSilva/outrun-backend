import { IsNotEmpty, IsString } from "class-validator";

export class AuthRegisterDto {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}