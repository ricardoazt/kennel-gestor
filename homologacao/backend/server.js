const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const db = require('./models');
const AnimalController = require('./controllers/AnimalController');
const AgendaController = require('./controllers/AgendaController');
const mediaController = require('./controllers/mediaController');
const campaignController = require('./controllers/campaignController');
const ShareLinkController = require('./controllers/ShareLinkController');
const ReservationController = require('./controllers/ReservationController');
const LitterController = require('./controllers/LitterController');
const PuppyController = require('./controllers/PuppyController');
const ClientController = require('./controllers/ClientController');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
	origin: '*',
	credentials: true
}));
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ limit: '1gb', extended: true }));

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
app.post('/animals/:id/photos', upload.any(), AnimalController.addPhoto);
app.delete('/animals/:id/photos/:photoIndex', AnimalController.deletePhoto);

// === Agenda Routes ===
app.post('/agenda', AgendaController.create);
app.get('/animals/:animal_id/agenda', AgendaController.findByAnimal);
app.put('/agenda/:id', AgendaController.update);
app.delete('/agenda/:id', AgendaController.delete);

// === Media Center Routes ===
app.post('/api/media/upload', mediaController.upload.single('file'), mediaController.uploadMedia);
app.post('/api/media/upload-multiple', mediaController.upload.array('files', 50), mediaController.uploadMultiple);
app.get('/api/media', mediaController.getMedia);

// === Media Albums Routes ===
app.get('/api/media/albums', mediaController.getAlbums);
app.post('/api/media/albums', mediaController.createAlbum);
app.put('/api/media/albums/:id', mediaController.updateAlbum);
app.post('/api/media/albums/:id/media', mediaController.addMediaToAlbum);
app.delete('/api/media/albums/:albumId/media/:mediaId', mediaController.removeMediaFromAlbum); // Remove media from album
app.delete('/api/media/albums/:id', mediaController.deleteAlbum);
app.get('/api/media/albums/:id/details', mediaController.getAlbumById); // Get album details by ID

// === Share Links Routes ===
app.post('/api/albums/:albumId/share-links', ShareLinkController.createShareLink); // Create new share link
app.get('/api/albums/:albumId/share-links', ShareLinkController.getShareLinks); // Get all links for album
app.put('/api/share-links/:id/toggle', ShareLinkController.toggleShareLink); // Activate/deactivate link
app.delete('/api/share-links/:id', ShareLinkController.deleteShareLink); // Delete link
app.get('/api/public/albums/:token', ShareLinkController.getPublicAlbumByToken); // Public access via share link

app.get('/api/media/:id', mediaController.getMediaById);
app.put('/api/media/:id', mediaController.updateMedia);
app.delete('/api/media/:id', mediaController.deleteMedia);

// === Campaign Routes ===
app.get('/api/campaigns/templates', campaignController.getTemplates);
app.post('/api/campaigns', campaignController.createCampaign);
app.get('/api/campaigns', campaignController.getCampaigns);
app.get('/api/campaigns/:id', campaignController.getCampaignById);
app.put('/api/campaigns/:id', campaignController.updateCampaign);
app.delete('/api/campaigns/:id', campaignController.deleteCampaign);
app.post('/api/campaigns/:id/publish', campaignController.publishCampaign);
app.post('/api/campaigns/:id/share-links', campaignController.generateShareLinks);
app.post('/api/campaigns/:id/track-view', campaignController.trackView);

// === Public Campaign Routes (no auth required) ===
app.get('/p/:slug', campaignController.getPublicCampaign);

// === Reservation Routes ===
app.post('/api/reservations', ReservationController.create);
app.get('/api/reservations', ReservationController.findAll);
app.get('/api/reservations/:id', ReservationController.findOne);
app.put('/api/reservations/:id', ReservationController.update);
app.put('/api/reservations/:id/status', ReservationController.updateStatus);
app.get('/api/reservations/litter/:litterId', ReservationController.getByLitter);
app.get('/api/reservations/expiring', ReservationController.getExpiring);
app.post('/api/reservations/cancel-expired', ReservationController.cancelExpired);

// === Availability Check ===
app.get('/api/litters/:litterId/availability', ReservationController.checkAvailability);

// === Litter Management ===
app.post('/api/litters', LitterController.create);
app.get('/api/litters', LitterController.findAll);
app.get('/api/litters/:id', LitterController.findOne);
app.put('/api/litters/:id', LitterController.update);
app.delete('/api/litters/:id', LitterController.delete);

// === Puppy Management ===
app.post('/api/puppies', PuppyController.create);
app.get('/api/puppies', PuppyController.findAll);
app.get('/api/puppies/:id', PuppyController.findOne);
app.put('/api/puppies/:id', PuppyController.update);
app.delete('/api/puppies/:id', PuppyController.delete);

// === Client Management (CRM) ===
app.post('/api/clients', ClientController.create);
app.get('/api/clients', ClientController.findAll);
app.get('/api/clients/:id', ClientController.findOne);
app.put('/api/clients/:id', ClientController.update);
app.delete('/api/clients/:id', ClientController.delete);

// Retry logic for Database Synchronization
const startServer = async () => {
	const dns = require('dns');
	dns.lookup('db', (err, address, family) => {
		if (err) console.error('DNS Lookup Error:', err);
		else console.log('DNS Lookup for db:', address, 'Family: IPv' + family);
	});

	let retries = 100;
	while (retries) {
		try {
			await db.sequelize.authenticate();
			console.log('Database connection established successfully.');

			// Force User table creation first to avoid FK issues with AgendaEvents
			if (db.User) {
				console.log('Syncing User model...');
				await db.User.sync({ alter: true });
			}

			await db.sequelize.sync({ alter: true });
			console.log('Database synced');
			app.listen(PORT, () => {
				console.log(`Server running on port ${PORT}`);
			});
			break;
		} catch (err) {
			console.error('Failed to connect to database:', err.message);
			retries -= 1;
			console.log(`Retries left: ${retries}`);
			if (retries === 0) {
				console.error('Could not connect to database after multiple attempts. Exiting.');
				process.exit(1);
			}
			// Wait 5 seconds before retrying
			await new Promise(res => setTimeout(res, 5000));
		}
	}
};

startServer();
