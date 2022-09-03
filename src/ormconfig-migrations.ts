// ormconfig-migrations.ts

import { DataSource, DataSourceOptions} from 'typeorm';
import { config } from './ormconfig';

const ds = config as DataSourceOptions;

const datasource = new DataSource(ds);
datasource.initialize();
export default datasource;
