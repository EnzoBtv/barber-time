import { Model, DataTypes, Association, Sequelize } from "sequelize";

import User from "./User";

export default class Hour extends Model {
    public id!: number;
    public day!: string;
    public hour!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public readonly users?: User[];

    public static associations: {
        users: Association<User, Hour>;
    };

    static async initModel(connection: Sequelize) {
        Hour.init(
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false
                },
                day: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                hour: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                sequelize: connection,
                tableName: "hours"
            }
        );
    }

    static async associate(models: any) {
        Hour.belongsToMany(models.User, {
            foreignKey: "hour_id",
            through: "user_hours",
            as: "users"
        });
    }
}
