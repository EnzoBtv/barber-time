import {
    Model,
    DataTypes,
    Association,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin
} from "sequelize";

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
    public addAddresses!: HasManyCreateAssociationMixin<Address>;

    public getTokens!: HasManyGetAssociationsMixin<Token>;
    public addToken!: HasManyAddAssociationMixin<Token, number>;
    public hasToken!: HasManyHasAssociationMixin<Token, number>;
    public countTokens!: HasManyCountAssociationsMixin;
    public addTokens!: HasManyCreateAssociationMixin<Token>;

    public readonly addresses?: Address[];
    public readonly tokens?: Token[];

    public static associations: {
        addresses: Association<User, Address>;
        tokens: Association<User, Token>;
    };

    static async initModel(connection: Sequelize) {
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
    }

    static async associate(models: any) {
        User.hasMany(models.Address, {
            sourceKey: "id",
            foreignKey: "user_id",
            as: "addresses"
        });

        User.hasMany(models.Token, {
            sourceKey: "id",
            foreignKey: "user_id",
            as: "tokens"
        });
    }
}
