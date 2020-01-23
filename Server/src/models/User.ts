import { Model, DataTypes } from "sequelize";

import connection from "../database";

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

User.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ["barber", "client"]
        }
    },
    {
        sequelize: connection
    }
);

export default User;
