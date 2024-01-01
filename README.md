# thesis-tracker

## Usage

### Environment variables

You will need to set up some environment variables, which you can put in a
`.env` file in the project root if you like.

```sh
API_PORT=
CLIENT_PORT=

ADMIN_USER=

DB_HOST=
DB_USER=
DB_NAME=

POETRY_VERSION=

DEADLINE=

# prod only
API_HOST=
CLIENT_HOST=
```

### Development

```sh
# old
docker-compose -f docker-compose.dev.yml up --build

# new
docker compose -f docker-compose.dev.yml up --build
```

### Deployment

```sh
# old
docker-compose -f docker-compose.prod.yml up --build

# new
docker compose -f docker-compose.prod.yml up --build
```
