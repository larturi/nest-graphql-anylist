/* eslint-disable @typescript-eslint/no-unused-vars */

import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemsModule } from './list-items/list-items.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault],
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl:
        process.env.STATE === 'prod'
          ? {
              rejectUnauthorized: false,
              sslmode: 'require',
            }
          : (false as any),
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),

    ItemsModule,

    UsersModule,

    AuthModule,

    SeedModule,

    CommonModule,

    ListsModule,

    ListItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('\nCargando variables de entorno:');
    console.log('-----------------------------');
    console.log('stage:', process.env.STATE);
    console.log('host:', process.env.POSTGRES_HOST);
    console.log('port:', +process.env.POSTGRES_PORT);
    console.log('username:', process.env.POSTGRES_USER);
    console.log('password:', process.env.POSTGRES_PASSWORD);
    console.log('database:', process.env.POSTGRES_NAME);
    console.log('\n');
  }
}
