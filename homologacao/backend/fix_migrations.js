
require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('./config/config.json')['development'];

const dbUrl = process.env.DATABASE_URL ||
    `postgres://${config.username}:${config.password}@127.0.0.1:5432/${config.database}`;

const sequelize = new Sequelize(dbUrl, {
    logging: false,
    dialect: 'postgres'
});

async function run() {
    try {
        const [results] = await sequelize.query('SELECT name FROM "SequelizeMeta"');
        const executed = results.map(r => r.name);

        // Get all migration files starting with 20260114
        const migrationDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationDir).filter(f => f.startsWith('20260114'));

        console.log(`Found ${files.length} migrations from 20260114.`);

        for (const file of files) {
            if (!executed.includes(file)) {
                console.log(`Marking ${file} as executed...`);
                await sequelize.query(`INSERT INTO "SequelizeMeta" (name) VALUES ('${file}')`);
            } else {
                console.log(`${file} already marked.`);
            }
        }

        console.log("Done updating SequelizeMeta.");

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await sequelize.close();
    }
}
run();
