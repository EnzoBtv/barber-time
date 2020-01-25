"use strict";
import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
    up: async (queryInterface: QueryInterface) => {
        return await queryInterface.addColumn("tokens", "type", {
            type: DataTypes.STRING,
            allowNull: false
        });
    },

    down: async (queryInterface: QueryInterface) => {
        return await queryInterface.removeColumn("tokens", "type");
    }
};
