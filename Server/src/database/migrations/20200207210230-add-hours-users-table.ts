"use strict";
import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("user_hours", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            hour_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "hours", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
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
