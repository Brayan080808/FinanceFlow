import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from 'src/users/entities/user.entity';
import { filterTransactionsDto } from './dto/filter-transactions.dto';
import { tagsCategoryDto } from './dto/tags-category.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactions: Repository<Transaction>,
    
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,

    @InjectRepository(User)
    private readonly users: Repository<User>,

  ) {}

  async create(userId:number, data: CreateTransactionDto): Promise<Transaction> {

    const categoryId = await this.categories.createQueryBuilder('category')
    .select('category.id','id')
    .where('category.userId = :userId', { userId })
    .andWhere('category.name = :name', { name: data.category })
    .getRawOne(); 

    const coinId = await this.users.createQueryBuilder('user')
    .select('user.coinId','id')
    .where('user.id = :userId', { userId })
    .getRawOne();

    
    const newTransaction = this.transactions.create({
      coin:  coinId,
      category: categoryId,
      user: { id: userId },
      value: data.amount,
      name: data.name,
    })
    return this.transactions.save(newTransaction);

  }

 


  async createCategory(createTransactionDto: CreateCategoryDto): Promise<Category> {
    const category = this.categories.create(createTransactionDto);
    return await this.categories.save(category);
  }

  async deleteCategoryByUser(user: User) {
    await this.categories.delete({ user });
  }

  async timeline(userId:number,filters:filterTransactionsDto):Promise<any[]>{
    let start:Date;
    let end:Date;


    const query = this.transactions
    .createQueryBuilder('transaction')
    .select('transaction.date','date')
    .addSelect('transaction.value','value')
    .where('transaction.userId = :userId', { userId })

    const now = new Date()
    let fromDate: Date
    switch (filters.time) {
      case 'week':
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        query.andWhere('date >= :fromDate', { fromDate })
        break
      case 'month':
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        query.andWhere('date >= :fromDate', { fromDate })
        break
      case 'year':
        fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        query.andWhere('date >= :fromDate', { fromDate })
        break
      case 'all':
        break
      default:
        if (filters.start != 'undefined') {

          const [month,day,year] = filters.start.split('/');

          start = new Date(parseInt(year), parseInt(month), parseInt(day));
          query.andWhere('date >= :star', { star: start})
        }
        if (filters.end != 'undefined'){

          const [month,day,year] = filters.end.split('/');
          end = new Date(parseInt(year), parseInt(month), parseInt(day));
          query.andWhere('date <= :end', { end: end })
        }
    }
    
    const data = await query.orderBy('date')
    .getRawMany();


    return data?.map((item) => ({date: item.date.toLocaleDateString('es-ES'),value:parseFloat(item.value)}))
  }

  async findAllCategory(userId:number):Promise<any[]>{

    const results = await this.categories
        .createQueryBuilder('category')
        .select([
            'category.name AS category',
            'category.income AS income',
            'COALESCE(SUM(transaction.value), 0) AS amount',
            'COUNT(transaction.id) AS count'
        ])
        .leftJoin('category.transaction', 'transaction') // Usa la relación definida en la entidad
        .where('category.userId = :userId', { userId })
        .groupBy('category.id, category.name')
        .getRawMany();

    return results;
  }

  async incomeTotal(userId:number):Promise<any[]>{
    const result = await this.transactions
        .createQueryBuilder('transaction')
        .select('SUM(transaction.value)', 'amount') // Suma los valores
        .innerJoin(Category, 'category', 'transaction.categoryId = category.id') // Realiza el INNER JOIN
        .where('transaction.userId = :userId', { userId })
        .groupBy('category.income') // Agrupa por income
        .getRawMany(); // Obtiene resultados en formato crudo

    return result;
  }

  async syncCategorias(tags:tagsCategoryDto[],tagsName:string[],user:User) {
  
    await this.categories
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(tags)
        .orIgnore() // Esto maneja el ON CONFLICT DO NOTHING
        .execute();


    await this.categories
        .createQueryBuilder()
        .delete()
        .from(Category)
        .where('userId = :userId', { "userId":user.id })
        .andWhere('name NOT IN (:...names)', { names: tagsName })
        .execute();


  }

  async countTransactions(userId:number,type:string,search:string){

    const results = this.transactions.createQueryBuilder('transaction')
    .where('transaction.userId = :userId', { userId }) // Filtra por el userId

    if (search){
      results.andWhere('transaction.name = :search', { search })
    }
    if (type === "income" ){
      results.andWhere('transaction.value >= 0')
    }
    if (type === "expense" ){
      results.andWhere('transaction.value <= 0')
    }
      

    const transacciones = await results.getCount();

    return transacciones;
  }

  async findAll(userId: number, limit: number = 10, offset: number = 0, order: string = null, type: string = null, search:string = null): Promise<Transaction[]> {
  
    const results = this.transactions.createQueryBuilder('transaction')
      .innerJoin('transaction.category', 'category') // Realiza el INNER JOIN
      .select([
        'transaction.id AS id',
        'transaction.value AS amount',
        'transaction.name AS name',
        'category.name AS category',
        'category.income AS income',
        'transaction.date AS date',
      ])
      .where('transaction.userId = :userId', { userId }) 


    if (search){
      results.andWhere('transaction.name ILIKE :search', { "search":`%${search}%` })
    }

    if (type === "income" ){
      results.andWhere('transaction.value >= 0')
    }
    if (type === "expense" ){
      results.andWhere('transaction.value <= 0')
    }

    if (order === "amount"){
      results.orderBy('transaction.value', 'DESC') 
    }
    else {
      results.orderBy('transaction.date', 'DESC') 
    }
      
    const transactions = await results.offset(offset).limit(limit).getRawMany(); // Obtiene los resultados en bruto
  
    return transactions?.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('es-ES'), // Asegúrate de convertir a fecha
    }));
  }

  async findOne(id: number) {
    const transaction = await this.transactions.findOne({ where: { id } });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);

    Object.assign(transaction, updateTransactionDto);

    return this.transactions.save(transaction);
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);
    await this.transactions.remove(transaction); // Asegúrate de usar await aquí para eliminar correctamente

    return `This action removes a #${id} transaction`;
  }



}









