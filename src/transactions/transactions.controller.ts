import { Controller, Res, Req, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UseGuards } from '@nestjs/common';
import { JwtUserGuard } from 'src/guards/jwt-users.guard';
import { Response, Request } from 'express';
import { filterTransactionsDto } from './dto/filter-transactions.dto';



interface IUserRequest extends Request {
  user: any;
}

interface Pagination {
  page:string,
  search?:string,
  order?:string,
  type?:string,
}


@Controller('transactions')
@UseGuards(JwtUserGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  async create(@Body() createTransactionDto, @Req() request:  IUserRequest, @Res() res: Response) {
     

    const response = await this.transactionsService.create(request.user.userId,createTransactionDto);
    res.status(201)
    return res.send({
      'newTransaction':response,
     });;
  }

  @Get()
  async findAll(@Req() request:  IUserRequest, @Res() res: Response, @Query() query:Pagination) {

    const search = query.search;
    const type = query.type;
    let page;

    if (query.page) page = parseInt(query.page);
    else page = 0;
  
    const limit = 10;
    const offset = page*limit;
    let next:Number=null;
    const order = query.order;

    const count = await this.transactionsService.countTransactions(request.user.userId,type,search);



    if (offset+limit<count)
        next=page+1;

    const transactions = await this.transactionsService.findAll(request.user.userId,limit,offset,order,type,search);

    res.status(200);

    return res.send({count,transactions,next}) 
  }

  @Get('timeline')
  async timeline (@Req() request:  IUserRequest, @Query() data: filterTransactionsDto) {
    return await this.transactionsService.timeline(request.user.userId,data)
  }
  
  @Get('category')
  async findAllCategory(@Req() request:  IUserRequest,@Res() res: Response) {
    const spendingCategory = await this.transactionsService.findAllCategory(request.user.userId)

    const incomeTotal = await this.transactionsService.incomeTotal(request.user.userId)

    res.status(200)


    return res.send({
                     'spendingCategory':spendingCategory,
                     'incomeTotal':incomeTotal
                    });
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.transactionsService.remove(+id);

    return result;
  }


}
