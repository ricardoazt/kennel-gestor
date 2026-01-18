
require('dotenv').config();
const { Animal, Litter, Sequelize } = require('./models');

async function test() {
    try {
        console.log("Checking Animals table...");
        const animals = await Animal.findAll({ raw: true });
        console.log(`Found ${animals.length} animals.`);

        animals.forEach(a => {
            console.log(`Animal: ${a.id} - ${a.nome} (${a.sexo})`);
        });

        const father = animals.find(a => a.sexo === 'Macho');
        const mother = animals.find(a => a.sexo === 'Femea');

        if (father && mother) {
            console.log(`\nAttempting to create litter with Father ID: ${father.id} and Mother ID: ${mother.id}`);
            try {
                const litter = await Litter.create({
                    father_id: father.id,
                    mother_id: mother.id,
                    birth_date: new Date(),
                    total_males: 1,
                    total_females: 0,
                    status: 'born'
                });
                console.log("Litter created successfully!", litter.toJSON());
                await litter.destroy();
                console.log("Litter deleted.");
            } catch (e) {
                console.error("\nCreation failed:");
                console.error(e.message);
                if (e.parent) {
                    console.error("SQL Error:", e.parent.message);
                    console.error("Detail:", e.parent.detail);
                }
            }
        } else {
            console.log("Not enough animals to test.");
        }

    } catch (e) {
        console.error("General Error:", e);
    } finally {
        // close connection if possible
        const db = require('./models');
        await db.sequelize.close();
    }
}

test();
