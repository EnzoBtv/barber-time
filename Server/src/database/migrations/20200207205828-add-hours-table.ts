"use strict";
import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("hours", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            day: {
                type: DataTypes.ENUM,
                values: [
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday"
                ],
                allowNull: false
            },
            hour: {
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
        return queryInterface.dropTable("hours");
    }
};
