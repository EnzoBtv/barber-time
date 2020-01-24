import {
    Model,
    DataTypes,
    Association,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin
} from "sequelize";
import Address from "./Address";
import connection from "../database";

export default class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public type!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public getAddresses!: HasManyGetAssociationsMixin<Address>;
    public addAddress!: HasManyAddAssociationMixin<Address, number>;
    public hasAddress!: HasManyHasAssociationMixin<Address, number>;
    public countAddresses!: HasManyCountAssociationsMixin;
    public createAddress!: HasManyCreateAssociationMixin<Address>;

    public readonly addresses?: Address[];

    public static associations: {
        addresses: Association<User, Address>;
    };
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
        sequelize: connection,
        tableName: "users"
    }
);

User.hasMany(Address, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "addresses"
});
