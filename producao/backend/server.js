const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
});

app.get('/', (req, res) => {
	res.send('Kennel Gestor API - Producao');
});

app.get('/health', async (req, res) => {
	try {
		await sequelize.authenticate();
		res.json({ status: 'ok', db: 'connected' });
	} catch (error) {
		res.status(500).json({ status: 'error', db: 'disconnected', error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
