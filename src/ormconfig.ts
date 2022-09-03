import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

export const config: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'db',
    entities: [User],
    migrations: ['src/migrations/*{.ts,.js}'],
    // synchronize: true // remove in production
};
