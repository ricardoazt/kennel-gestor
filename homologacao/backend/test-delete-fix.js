const { MediaFile, MediaAlbum } = require('./models');

async function test() {
    console.log('Starting media deletion fix test...');

    try {
        // 1. Create a dummy media file
        const media = await MediaFile.create({
            filename: 'test-delete.jpg',
            original_name: 'test-delete.jpg',
            file_path: '/app/uploads/media/test-delete.jpg',
            file_type: 'image',
            mime_type: 'image/jpeg'
        });
        console.log('Created dummy media with ID:', media.id);

        // 2. Create an album and set this media as cover
        const album = await MediaAlbum.create({
            name: 'Test Deletion Album',
            cover_image_id: media.id
        });
        console.log('Created album with ID:', album.id, 'and cover_image_id:', album.cover_image_id);

        // 3. Mock the request/response for deleteMedia
        const req = { params: { id: media.id } };
        const res = {
            json: (data) => console.log('Response JSON:', data),
            status: (code) => ({
                json: (data) => console.log('Response Error (', code, '):', data)
            })
        };

        const mediaController = require('./controllers/mediaController');

        // We need to mock fs.unlink because the physical file doesn't exist
        const fs = require('fs').promises;
        const originalUnlink = fs.unlink;
        fs.unlink = async () => { console.log('Mocked fs.unlink called'); };

        console.log('Calling deleteMedia...');
        await mediaController.deleteMedia(req, res);

        // 4. Verify results
        const deletedMedia = await MediaFile.findByPk(media.id);
        const updatedAlbum = await MediaAlbum.findByPk(album.id);

        if (!deletedMedia) {
            console.log('CONFIRMED: Media file record deleted from database.');
        } else {
            console.error('ERROR: Media file record still exists.');
        }

        if (updatedAlbum.cover_image_id === null) {
            console.log('CONFIRMED: Album cover_image_id set to NULL.');
        } else {
            console.error('ERROR: Album cover_image_id is still:', updatedAlbum.cover_image_id);
        }

        // Cleanup
        await updatedAlbum.destroy();
        fs.unlink = originalUnlink;

    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
