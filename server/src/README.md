## Database hot fix

https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing

`npx prisma migrate resolve --applied "<migration-name>" --schema src/database/prisma/schema.prisma`

If the migration list and schema get out of sync, mark the trouble migrations as applied, then manually alter the table.
