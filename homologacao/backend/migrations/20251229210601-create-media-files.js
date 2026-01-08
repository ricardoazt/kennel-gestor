'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('MediaFiles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            filename: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            original_name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            file_path: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            file_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: 'image or video'
            },
            mime_type: {
                type: Sequelize.STRING(100)
            },
            file_size: {
                type: Sequelize.INTEGER,
                comment: 'Size in bytes'
            },
            width: {
                type: Sequelize.INTEGER
            },
            height: {
                type: Sequelize.INTEGER
            },
            duration: {
                type: Sequelize.INTEGER,
                comment: 'Duration in seconds for videos'
            },
            thumbnail_path: {
                type: Sequelize.STRING(500)
            },
            album_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'MediaAlbums',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            tags: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
                defaultValue: []
            },
            description: {
                type: Sequelize.TEXT
            },
            metadata: {
                type: Sequelize.JSONB,
                comment: 'Additional metadata like EXIF data'
            },
            uploaded_by: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Add indexes for better query performance
        await queryInterface.addIndex('MediaFiles', ['file_type']);
        await queryInterface.addIndex('MediaFiles', ['album_id']);
        await queryInterface.addIndex('MediaFiles', ['uploaded_by']);
        await queryInterface.addIndex('MediaFiles', ['createdAt']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('MediaFiles');
    }
};
