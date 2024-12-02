import { User } from "src/users/entities/user.entity"

export class CreateTransactionDto {
    name:string;
    amount:number;
    category:string;
    type:string;
}
