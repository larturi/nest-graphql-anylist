import { registerEnumType } from '@nestjs/graphql';

export enum ValidEnviroments {
  dev = 'dev',
  prod = 'prod',
}

registerEnumType(ValidEnviroments, {
  name: 'ValidEnviroments',
  description: 'Estos son los ambientes permitidos para la aplicación',
});
