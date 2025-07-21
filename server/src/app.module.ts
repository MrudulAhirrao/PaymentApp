import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';


@Module({
  imports: [AuthModule, PaymentsModule, TypeOrmModule.forRoot({
     type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'yourpassword',
      database: 'payment_dashboard',
      autoLoadEntities: true,
      synchronize: true,
  }),
],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
