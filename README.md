## Start the backend in development mode

```sh
# Build and start containers (backend + postgres) with live reload
docker-compose up --build
# Logs (optional)
docker-compose logs -f backend
```

## Access the backend container (shell)

```sh
docker exec -it helyx-backend sh
```

## Useful Database commands

```sh
# 🛠 Generate a migration based on your current entities
# Replace $migrationName with something meaningful, e.g., add-users-table
npm run migration:generate --name=$migrationName

# 🧱 Create an empty migration file (you'll fill it manually)
npm run migration:create --name=$migrationName

# ▶️ Run all pending migrations on the database
npm run migration:run

# ⏪ Revert the last executed migration
npm run migration:revert

# 💣 Drop the entire database schema (use with caution)
npm run migration:drop

```
