import { Sequelize } from "sequelize";

const connection = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    username: "root",
    password: "root",
    database: "barber-time",
    define: {
        timestamps: true,
        underscored: true
    }
});

export default connection;
