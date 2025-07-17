import { DataSource } from 'typeorm';
import { typeOrmOptions } from './config/typeorm.options';

const AppDataSource = new DataSource(typeOrmOptions);
export default AppDataSource;
