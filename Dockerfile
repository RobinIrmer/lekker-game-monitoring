ARG BUILD_IMAGE=node:20.1.0
ARG RUN_IMAGE=gcr.io/distroless/nodejs20-debian11

# Build stage
FROM $BUILD_IMAGE AS build-env
COPY . /app
WORKDIR /app
RUN npm ci && npm run build

# Prepare production dependencies
FROM $BUILD_IMAGE AS deps-env
COPY --from=build-env /app/node_modules /app
RUN /app/node_modules/.bin/prisma generate

# Create final production stage
FROM $RUN_IMAGE AS run-env
WORKDIR /app
COPY --from=build-env /app/node_modules /node_modules
COPY --from=build-env /app/dist /dist
COPY --from=build-env /app/openapi.yaml /dist/src/openapi.yaml

ENV NODE_ENV="production"
CMD ["/dist/src/server.js"]
