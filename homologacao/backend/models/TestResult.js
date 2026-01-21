'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TestResult extends Model {
        static associate(models) {
            TestResult.belongsTo(models.Puppy, { foreignKey: 'puppy_id', as: 'puppy' });
            TestResult.belongsTo(models.TestTemplate, { foreignKey: 'test_template_id', as: 'template' });
        }
    }

    TestResult.init({
        puppy_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        test_template_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        evaluator: DataTypes.STRING,
        date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        scores: {
            type: DataTypes.JSONB, // Key-value pair of parameter -> score
            allowNull: false
        },
        notes: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'TestResult',
        tableName: 'TestResults'
    });

    return TestResult;
};
