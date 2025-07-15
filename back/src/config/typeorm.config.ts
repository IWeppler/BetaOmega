import { registerAs } from '@nestjs/config';
import { typeOrmConfig } from './typeorm.options';

export default registerAs('typeorm', typeOrmConfig);