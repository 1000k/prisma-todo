# Prisma ToDo

Next.js + Prisma

## Development

### Initialize

```sh
pnpm
```

### Migration

After editing `prisma/schema.prisma`,

```sh
npx prisma init
npx prisma migrate dev --name init

# Check schema on http://localhost:5555
npx prisma studio
```

### Run

```sh
pnpm run dev
```
