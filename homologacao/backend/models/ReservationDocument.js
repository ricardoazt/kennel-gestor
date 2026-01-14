'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ReservationDocument extends Model {
        static associate(models) {
            // Association with Reservation
            ReservationDocument.belongsTo(models.Reservation, {
                foreignKey: 'reservation_id',
                as: 'reservation'
            });

            // Association with User (who generated it)
            ReservationDocument.belongsTo(models.User, {
                foreignKey: 'generated_by_user_id',
                as: 'generatedBy'
            });
        }
    }

    ReservationDocument.init({
        reservation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Reservations',
                key: 'id'
            }
        },
        document_type: {
            type: DataTypes.ENUM('contract', 'deposit_receipt', 'full_receipt', 'other'),
            allowNull: false
        },
        file_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        generated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        generated_by_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'ReservationDocument',
        tableName: 'ReservationDocuments'
    });

    return ReservationDocument;
};
