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

<http://localhost:3000/graphql>


### Run the seed mutation to populate the database

#### In src/seed/data/seed-data.ts you can modify the initial data

```bash
mutation Seed {
  executeSeed
}
```

<br/>

---

##### Made with ❤️ by Leandro Arturi
