<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# AnylistAPI with Nest & GraphQL

# Dev

### Install dependencies

```bash
yarn install
```

### Create .env file with .env.template as a template

### Run Docker Container with PostgresDB Image

```bash
docker-compose up -d
```

### Running the app

```bash
yarn start:dev
```

### Open in ApolloGraphQL Studio

<http://localhost:4000/graphql>


### Run the seed mutation to populate the database

#### In src/seed/data/seed-data.ts you can modify the initial data

```bash
mutation Seed {
  executeSeed
}
```

#### Login

```bash
mutation Mutation($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    user {
      email
      fullName
      isActive
      roles
    }
    token
  }
}

# Variables
{
  "loginInput": {
    "email": "leandro@email.com",
    "password": "123456"
  }
}
```

#### List of items

```bash
query Items {
  items {
    name
    id
    quantityUnits
  }
}

# Headers
Authorization Bearer <Token>
```

# Docker Prod

#### Build
```bash
docker-compose -f docker-compose.prod.yml up --build
```

#### Run
```bash
docker-compose -f docker-compose.prod.yml up
```

#### Nota
Por defecto, docker-compose usa el archivo .env, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con

```bash
docker-compose -f docker-compose.prod.yml up --build
```

#### Cambiar nombre
```bash
docker tag <nombre app> <usuario docker hub>/<nombre repositorio>
Ingresar a Docker Hub

docker login
Subir imagen

docker push <usuario docker hub>/<nombre repositorio>
```

<br/>

---

##### Made with ❤️ by Leandro Arturi
