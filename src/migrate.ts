import {CjApiApplication} from './application';

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new CjApiApplication();
  await app.boot();
  //await app.migrateSchema({existingSchema});
  await app.migrateSchema({
    existingSchema,
    // The order of table creation is important.
    // A referenced table must exist before creating a
    // foreign key constraint.
    // For PostgreSQL connector, it does not create tables in the
    // right order.  Therefore, this change is needed.
    models: ['User','Attribute','Category',
  'Brand','Supplier','Product','AttributeValue'],
  });
  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
