import { IsOptional, IsString, IsDate, IsDateString } from 'class-validator';

export class filterTransactionsDto {
    @IsOptional()
    @IsString()
    time: String;

    @IsOptional()
    @IsString()
    start?: String;
    
    @IsOptional()
    @IsString()
    end?: String;
}



