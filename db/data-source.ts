import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
