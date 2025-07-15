import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/typeorm.options';

const AppDataSource = new DataSource(typeOrmConfig());
export default AppDataSource;
