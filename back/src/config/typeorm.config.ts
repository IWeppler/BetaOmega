import { registerAs } from '@nestjs/config';
import { typeOrmOptions } from './typeorm.options';

export default registerAs('typeorm', () => typeOrmOptions);