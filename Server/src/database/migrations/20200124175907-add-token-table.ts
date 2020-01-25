"use strict";
import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("tokens", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            ip: {
                type: DataTypes.STRING,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
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
        return queryInterface.dropTable("tokens");
    }
};
