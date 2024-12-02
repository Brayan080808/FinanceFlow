import { IsOptional, IsString, IsDate, IsDateString, IsBoolean } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class tagsCategoryDto {
    @IsString()
    name: string;

    @IsBoolean()
    income: boolean;

    user: User;

}


