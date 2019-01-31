const isTest = process.env.NODE_ENV === "test";

module.exports = {
  name: "default",
  type: "postgres",
  host: process.env.POSTGRESQL_HOST || "localhost",
  port: process.env.POSTGRESQL_PORT || 5432,
  username: process.env.POSTGRESQL_USERNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: `${process.env.POSTGRESQL_DB_NAME}${isTest ? "-test" : ""}`,
  synchronize: !isTest,
  logging: !isTest,
  entities: ["src/entities/*.*"]
};
