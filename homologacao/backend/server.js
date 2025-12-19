const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const db = require('./models');
const AnimalController = require('./controllers/AnimalController');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	}
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
	res.send('Kennel Gestor API - Homologacao (Plantel Module Active)');
});

app.get('/health', async (req, res) => {
	try {
		await db.sequelize.authenticate();
		res.json({ status: 'ok', db: 'connected' });
	} catch (error) {
		res.status(500).json({ status: 'error', db: 'disconnected', error: error.message });
	}
});

// === Plantel Routes ===
app.post('/animals', AnimalController.create);
app.get('/animals', AnimalController.findAll);
app.get('/animals/:id', AnimalController.findOne);
app.put('/animals/:id', AnimalController.update);
app.delete('/animals/:id', AnimalController.delete);
app.get('/animals/:id/lineage', AnimalController.getLineage);
app.post('/animals/:id/medical-records', upload.single('file'), AnimalController.addMedicalRecord); // Expecting form field 'file'

// Sync Database and Start Server
db.sequelize.sync({ alter: true }).then(() => {
	console.log('Database synced');
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}).catch(err => {
	console.error('Failed to sync database:', err);
});
