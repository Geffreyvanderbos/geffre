async function fetchAlbumReviews() {
    try {
        const response = await fetch('/albumReviews.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching album reviews:', error);
        return {};
    }
}

  async function fetchListens() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block'; // Show loading indicator

    const url = 'https://api.listenbrainz.org/1/user/Geffrey/listens?count=60';
    const options = {
        method: 'GET',
        headers: { Authorization: 'Bearer fddf472f-7210-4c62-9db7-d69e8de58c7e' }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        const uniqueAlbums = getUniqueAlbums(data.payload.listens);
        await displayAlbums(uniqueAlbums.slice(0, 10));
    } catch (error) {
        console.error(error);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

    function getUniqueAlbums(listens) {
        const albums = new Map();
        listens.forEach(listen => {
            // Use Spotify album ID as the primary identifier
            const albumId = listen.track_metadata.additional_info.spotify_album_id || listen.track_metadata.additional_info.recording_msid;

            // Check if this album/track is already added
            if (!albums.has(albumId)) {
                const mbid = listen.track_metadata.mbid_mapping?.release_mbid || listen.track_metadata.mbid_mapping?.recording_mbid;
                albums.set(albumId, {
                    albumName: listen.track_metadata.release_name || listen.track_metadata.track_name, // Fallback to track name if release name is not available
                    artistName: listen.track_metadata.additional_info.artist_names[0],
                    mbid: mbid,
                    spotifyUrl: listen.track_metadata.additional_info.origin_url,
                    listenedAt: listen.listened_at
                });
            }
        });
        return Array.from(albums.values());
    }

    async function fetchAlbumArt(mbid) {
        const coverArtUrl = `https://coverartarchive.org/release/${mbid}/front`;
        try {
            const response = await fetch(coverArtUrl);
            if (!response.ok) {
                throw new Error('Cover art not found');
            }
            return coverArtUrl;
        } catch (error) {
            console.warn('Error fetching album art:', error);
            return '';
        }
    }

    async function displayAlbums(albums) {
        const albumReviews = await fetchAlbumReviews(); // Fetch the reviews

        const listElement = document.getElementById('listenList');
        listElement.innerHTML = ''; // Clear existing list

        for (const album of albums) {
            const reviewUrl = albumReviews[album.mbid]; // Get the review URL
            const listItem = document.createElement('li');

            const albumArt = document.createElement('img');
            albumArt.loading = 'lazy';
            const albumArtUrl = await fetchAlbumArt(album.mbid);
            albumArt.src = albumArtUrl ? albumArtUrl : 'https://geffreyvanderbos.com/wp-content/uploads/2024/01/albumart-not-found.png';
            albumArt.alt = 'Album Art';

            listItem.appendChild(albumArt);

            const albumInfoDiv = document.createElement('div');

            const metadataSpan = document.createElement('span');
            metadataSpan.className = 'metadata';
            if (reviewUrl) {
                metadataSpan.innerHTML = `${new Date(album.listenedAt * 1000).toISOString().split('T')[0]} • <a href="${reviewUrl}">My review</a>`;
            } else {
            metadataSpan.textContent = `${new Date(album.listenedAt * 1000).toISOString().split('T')[0]}`;
            }
            
            albumInfoDiv.appendChild(metadataSpan);

            const titleSpan = document.createElement('span');
            const cleanAlbumName = album.albumName.replace(/(\(.*?\)| - .*)/g, '').trim();  
            titleSpan.className = 'title';
            titleSpan.textContent = `${cleanAlbumName} by ${album.artistName}`;
            albumInfoDiv.appendChild(titleSpan);

            listItem.appendChild(albumInfoDiv);
            listElement.appendChild(listItem);
        }
    }

    fetchListens();