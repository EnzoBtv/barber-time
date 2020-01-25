"use strict";
import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("addresses", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            zipCode: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            number: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false
            },
            complement: {
                type: DataTypes.STRING,
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable("addresses");
    }
};
