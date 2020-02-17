import {
    Model,
    DataTypes,
    Association,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManySetAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    HasMany
} from "sequelize";

import Address from "./Address";
import Token from "./Token";
import Hour from "./Hour";
import Appointment from "./Appointment";

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

    public getAppointments!: HasManyGetAssociationsMixin<Appointment>;
    public addAppointment!: HasManyAddAssociationMixin<Appointment, number>;
    public addEstablishmentAppointment!: HasManyAddAssociationMixin<
        Appointment,
        number
    >;
    public hasAppointment!: HasManyHasAssociationMixin<Appointment, number>;
    public countAppointments!: HasManyCountAssociationsMixin;
    public addAppointments!: HasManyCreateAssociationMixin<Appointment>;
    public setAppointments!: HasManySetAssociationsMixin<Appointment, number>;

    public getTokens!: HasManyGetAssociationsMixin<Token>;
    public addToken!: HasManyAddAssociationMixin<Token, number>;
    public hasToken!: HasManyHasAssociationMixin<Token, number>;
    public countTokens!: HasManyCountAssociationsMixin;
    public addTokens!: HasManyCreateAssociationMixin<Token>;

    public getHours!: BelongsToManyGetAssociationsMixin<Hour>;
    public addHour!: BelongsToManyAddAssociationMixin<Hour, number>;
    public hasHour!: BelongsToManyHasAssociationMixin<Hour, number>;
    public countHours!: BelongsToManyCountAssociationsMixin;
    public addHours!: BelongsToManyCreateAssociationMixin<Hour>;

    public readonly addresses?: Address[];
    public readonly tokens?: Token[];
    public readonly hours?: Hour[];
    public readonly appointments?: Appointment[];

    public static Appointment: HasMany<User, Appointment>;
    public static EstablishmentAppointment: HasMany<User, Appointment>;

    public static associations: {
        addresses: Association<User, Address>;
        tokens: Association<User, Token>;
        hours: Association<User, Hour>;
        appointments: Association<User, Appointment>;
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

        User.Appointment = User.hasMany(models.Appointment, {
            sourceKey: "id",
            foreignKey: "user_id",
            as: "appointments"
        });

        User.EstablishmentAppointment = User.hasMany(models.Appointment, {
            sourceKey: "id",
            foreignKey: "establishment_id",
            as: "establishmentAppointments"
        });

        User.belongsToMany(models.Hour, {
            foreignKey: "user_id",
            through: "user_hours",
            as: "users"
        });
    }
}
