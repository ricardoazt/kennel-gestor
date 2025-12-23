const { sequelize } = require('./models');

async function checkTable() {
    try {
        const [results, metadata] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Animals'");
        console.log(results);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkTable();
