import { Model, DataTypes, Sequelize } from "sequelize";

export default class Token extends Model {
    public id!: number;
    public ip!: string;
    public token!: string;
    public type!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    static async initModel(connection: Sequelize) {
        Token.init(
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false
                },
                ip: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                token: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                sequelize: connection,
                tableName: "tokens"
            }
        );
    }
}
