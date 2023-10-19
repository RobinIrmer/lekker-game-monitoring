openapi-generate:
	openapi-generator generate -i openapi.yaml -g typescript-fetch -o package-openapi --additional-properties=withInterfaces=true,ensureUniqueParams=true,nullSafeAdditionalProps=true

docker-up:
	docker compose up -d
	npm install
	DATABASE_URL=postgresql://postgres:password@localhost:5432/game_monitoring_api?schema=public node_modules/.bin/prisma migrate deploy node_modules/.bin/prisma migrate deploy

docker-down:
	docker compose down --rmi local

docker-rebuild:
	docker compose up -d --no-deps --build server

