import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PaymentsService, CreatePaymentDto } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Payment } from './payment.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard) // This protects all endpoints in this controller
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }
  
  @Get('stats')
  getStats(): Promise<{ totalRevenue: number; totalCount: number; failedCount: number }> {
    return this.paymentsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }
}
