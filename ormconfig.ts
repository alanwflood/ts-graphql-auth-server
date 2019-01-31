const isTest = process.env.NODE_ENV === "test";

module.exports = {
  name: "default",
  type: "postgres",
  host: "localhost",
  port: "5432",
  username: "test",
  password: "test",
  database: isTest ? "type-graphql-sever-test" : "type-graphql-server",
  synchronize: !isTest,
  logging: !isTest,
  entities: ["src/entities/*.*"]
};
