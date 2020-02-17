import { Model, DataTypes, Sequelize } from "sequelize";

export default class Appointment extends Model {
    public id!: number;
    public date!: Date;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    static async initModel(connection: Sequelize) {
        Appointment.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                    unique: true
                },
                date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: { model: "users", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE"
                },
                establishment_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: { model: "users", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE"
                }
            },
            {
                sequelize: connection,
                tableName: "appointments"
            }
        );
    }
}
