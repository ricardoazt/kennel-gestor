'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TestTemplate extends Model {
        static associate(models) {
            TestTemplate.hasMany(models.TestResult, { foreignKey: 'test_template_id', as: 'results' });
        }
    }

    TestTemplate.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT,
        parameters: {
            type: DataTypes.JSONB, // Array of objects defining criteria
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'TestTemplate',
        tableName: 'TestTemplates'
    });

    return TestTemplate;
};
