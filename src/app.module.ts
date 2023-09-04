import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/users.entity';
import { Permission } from './user/entities/permissions.entity';
import { Role } from './user/entities/roles.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guard/login.guard';
import { PermissionGuard } from './guard/permission.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:'.env',
      load: [configuration],
    }),
    // 数据库连接
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: 3306,
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        synchronize: true,
        logging: true,
        entities: [User, Permission, Role],
        poolSize: 10,
        connectorPackage: 'mysql2',
      }),
      inject: [ConfigService],
    }),
    // JWT
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('secret.secret'),
          signOptions: {
            expiresIn: configService.get('secret.tokenTime'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // JWT 守卫
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    // 权限 守卫
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
