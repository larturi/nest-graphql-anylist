import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidEnviroments } from './enums/valid-enviromente.enum';

@Injectable()
export class SeedService {
  private isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProduction = configService.get('STATE') === ValidEnviroments.prod;
  }

  async executeSeed() {
    if (this.isProduction)
      throw new UnauthorizedException('We can not run the Seed on Production');
    return true;
  }
}
