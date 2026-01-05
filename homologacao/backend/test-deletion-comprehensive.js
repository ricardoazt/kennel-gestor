const { MediaFile, MediaAlbum, User } = require('./models');
const fs = require('fs').promises;
const path = require('path');

async function test() {
    console.log('Starting comprehensive deletion test...');

    try {
        // 1. Create a test media file
        const media = await MediaFile.create({
            filename: 'test-delete.jpg',
            original_name: 'test-delete.jpg',
            file_path: '/app/uploads/media/test-delete.jpg',
            file_type: 'image'
        });
        console.log('Created test media:', media.id);

        // Create a dummy file
        const uploadDir = '/app/uploads/media';
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(media.file_path, 'dummy content');
        console.log('Created dummy file at:', media.file_path);

        // 2. Create an album with this media as cover
        const album = await MediaAlbum.create({
            name: 'Test Delete Album',
            cover_image_id: media.id
        });
        console.log('Created test album with media as cover:', album.id);

        // 3. Test deleteMedia
        console.log('Testing deleteMedia...');
        const mediaController = require('./controllers/mediaController');
        const reqMedia = { params: { id: media.id } };
        const resMedia = {
            json: (data) => console.log('deleteMedia Response:', data),
            status: (code) => ({ json: (data) => console.log('deleteMedia Error:', code, data) })
        };
        await mediaController.deleteMedia(reqMedia, resMedia);

        const deletedMedia = await MediaFile.findByPk(media.id);
        console.log('Media deleted from DB:', !deletedMedia);

        const updatedAlbum = await MediaAlbum.findByPk(album.id);
        console.log('Album cover_image_id nullified:', updatedAlbum.cover_image_id === null);

        // 4. Test deleteAlbum
        console.log('Testing deleteAlbum...');
        const reqAlbum = { params: { id: album.id } };
        const resAlbum = {
            json: (data) => console.log('deleteAlbum Response:', data),
            status: (code) => ({ json: (data) => console.log('deleteAlbum Error:', code, data) })
        };
        await mediaController.deleteAlbum(reqAlbum, resAlbum);

        const deletedAlbum = await MediaAlbum.findByPk(album.id);
        console.log('Album deleted from DB:', !deletedAlbum);

        // Cleanup dummy file if it still exists
        try {
            await fs.unlink(media.file_path);
        } catch (e) { }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
