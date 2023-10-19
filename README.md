# Game Monitoring API

Welcome to the Game Monitoring API project! Follow the instructions below to build, run, and explore the API.

### Prerequisites

Before you begin, make sure you have [Docker](https://www.docker.com/get-started) installed on your system.

## Getting Started

### Start the Application

To start the application, open your terminal and run the following command:

```bash
$ make docker-up
```

This command will build and launch the Game Monitoring API using Docker containers.

### Stop the Application

To stop the application and shut down the Docker containers, run:

```bash
$ make docker-down
```

### Rebuild the Application

If you need to rebuild the application after making changes, you can use the following command:

```bash
$ make docker-rebuild
```

## Exploring the API

Once the application is running, you can explore the API in two ways:

### Swagger Documentation

Visit http://localhost:3000/api-docs in your web browser to access the Swagger documentation. This interactive
documentation allows you to explore and test the API endpoints.

### OpenAPI Specification

You can also view the API's OpenAPI specification by opening the openapi.yaml file. This file provides a comprehensive
description of the API endpoints and data structures, and it can be used to generate client code or for further
documentation.

### Using OpenAPI

The Game Monitoring API uses OpenAPI to define its interfaces for services. You can use the OpenAPI specification to
generate client libraries, documentation, and more, making it easier to integrate with the API.