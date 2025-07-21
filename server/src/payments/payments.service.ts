import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

// DTO (Data Transfer Object) for creating a payment.
export class CreatePaymentDto {
  amount: number;
  receiver: string;
  status: string;
  method: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  /**
   * Creates a new payment record in the database.
   */
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  /**
   * Retrieves all payments from the database, sorted by creation date.
   */
  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Finds a single payment by its ID.
   */
  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`Payment with ID #${id} not found`);
    }
    return payment;
  }

  /**
   * Calculates statistics for the payments.
   */
  async getStats(): Promise<{ totalRevenue: number; totalCount: number; failedCount: number }> {
    const totalRevenueResult = await this.paymentsRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "sum")
      .where("payment.status = :status", { status: 'Success' })
      .getRawOne();
      
    const totalCount = await this.paymentsRepository.count();
    const failedCount = await this.paymentsRepository.count({ where: { status: 'Failed' } });
    
    return {
      totalRevenue: parseFloat(totalRevenueResult.sum) || 0,
      totalCount: totalCount || 0,
      failedCount: failedCount || 0,
    };
  }
}
