'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {
        static associate(models) {
            // Association with Client
            Reservation.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });

            // Association with Litter (optional)
            Reservation.belongsTo(models.Litter, { foreignKey: 'litter_id', as: 'litter' });

            // Association with Puppy (optional)
            Reservation.belongsTo(models.Puppy, { foreignKey: 'puppy_id', as: 'puppy' });

            // Association with Preferences
            Reservation.hasOne(models.ReservationPreferences, {
                foreignKey: 'reservation_id',
                as: 'preferences'
            });

            // Association with Documents
            Reservation.hasMany(models.ReservationDocument, {
                foreignKey: 'reservation_id',
                as: 'documents'
            });
        }
    }

    Reservation.init({
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Clients',
                key: 'id'
            }
        },
        reservation_type: {
            type: DataTypes.ENUM('litter_choice', 'specific_puppy'),
            allowNull: false,
            defaultValue: 'litter_choice'
        },
        litter_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Litters',
                key: 'id'
            }
        },
        puppy_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Puppies',
                key: 'id'
            }
        },
        choice_priority: {
            type: DataTypes.STRING,
            allowNull: true
        },
        choice_gender: {
            type: DataTypes.ENUM('male', 'female'),
            allowNull: true
        },
        total_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        deposit_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        deposit_paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        deposit_paid_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        payment_method: {
            type: DataTypes.ENUM('pix', 'credit_card', 'bank_transfer', 'cash', 'other'),
            allowNull: true
        },
        payment_proof_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(
                'awaiting_deposit',
                'confirmed',
                'contract_pending',
                'active',
                'completed',
                'cancelled',
                'expired'
            ),
            defaultValue: 'awaiting_deposit',
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status_history: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Reservation',
        tableName: 'Reservations',
        hooks: {
            beforeCreate: async (reservation) => {
                // Auto-set expiry date if status is awaiting_deposit
                if (reservation.status === 'awaiting_deposit' && !reservation.expires_at) {
                    const expiryDate = new Date();
                    expiryDate.setHours(expiryDate.getHours() + 24); // 24 hours from now
                    reservation.expires_at = expiryDate;
                }

                // Initialize status history
                if (!reservation.status_history || reservation.status_history.length === 0) {
                    reservation.status_history = [{
                        status: reservation.status,
                        changed_at: new Date(),
                        notes: 'Reserva criada'
                    }];
                }
            }
        }
    });

    return Reservation;
};
