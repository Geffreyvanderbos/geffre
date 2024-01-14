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
    const url = 'https://api.listenbrainz.org/1/user/Geffrey/listens?count=60';
    const options = {
        method: 'GET',
        headers: { Authorization: 'Bearer fddf472f-7210-4c62-9db7-d69e8de58c7e' }
    };

    try {
        const listElement = document.getElementById('listenList');
        createFauxList(listElement, 10);

        const response = await fetch(url, options);
        const data = await response.json();
        const uniqueAlbums = getUniqueAlbums(data.payload.listens);
        await displayAlbums(uniqueAlbums.slice(0, 10));
    } catch (error) {
        console.error(error);
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

    async function fetchAllAlbumArt(albums) {
        const albumArtUrls = await Promise.all(albums.map(async (album) => {
            const albumArtUrl = await fetchAlbumArt(album.mbid);
            return albumArtUrl ? albumArtUrl : 'https://geffreyvanderbos.com/wp-content/uploads/2024/01/albumart-not-found.png';
        }));
        return albumArtUrls;
    }

    async function displayAlbums(albums) {
        const albumReviews = await fetchAlbumReviews();
        const listElement = document.getElementById('listenList');
        const albumArtUrls = await fetchAllAlbumArt(albums);
        
        albums.forEach((album, index) => {
            const reviewUrl = albumReviews[album.mbid];
            const listItem = createAlbumListItem(album, albumArtUrls[index], reviewUrl);
    
            replaceFauxItemWithReal(listElement, listItem, index);
        });
    
        removeRemainingFauxItems(listElement);
    }

    function createAlbumListItem(album, albumArtUrl, reviewUrl) {
        const listItem = document.createElement('li');
    
        // Create and add album art image
        const albumArt = document.createElement('img');
        albumArt.src = albumArtUrl;
        albumArt.alt = 'Album Art';
        albumArt.loading = 'lazy';
        listItem.appendChild(albumArt);
    
        // Create and add album info container
        const albumInfoDiv = document.createElement('div');
    
        // Create and add metadata span
        const metadataSpan = document.createElement('span');
        metadataSpan.className = 'metadata';
        metadataSpan.innerHTML = reviewUrl ?
            `${new Date(album.listenedAt * 1000).toISOString().split('T')[0]} • <a href="${reviewUrl}">My review</a>` :
            `${new Date(album.listenedAt * 1000).toISOString().split('T')[0]}`;
        albumInfoDiv.appendChild(metadataSpan);
    
        // Create and add album title span
        const titleSpan = document.createElement('span');
        const cleanAlbumName = album.albumName.replace(/(\(.*?\)| - .*)/g, '').trim();
        titleSpan.className = 'title';
        titleSpan.textContent = `${cleanAlbumName} by ${album.artistName}`;
        albumInfoDiv.appendChild(titleSpan);
    
        // Append albumInfoDiv to listItem
        listItem.appendChild(albumInfoDiv);
    
        // Apply fade-in class for the transition effect
        listItem.classList.add('fade-in');
    
        return listItem;
    }

    function createFauxList(listElement, count) {
        for (let i = 0; i < count; i++) {
            const fauxItem = document.createElement('li');
            fauxItem.classList.add('faux-item');
            listElement.appendChild(fauxItem);
        }
    }

    async function replaceFauxItemWithReal(listElement, realItem, index) {
        const fauxItems = listElement.getElementsByClassName('faux-item');
        if (fauxItems.length > index) {
            listElement.replaceChild(realItem, fauxItems[index]);
        } else {
            listElement.appendChild(realItem);
        }
    }
    
    function removeRemainingFauxItems(listElement) {
        const fauxItems = listElement.getElementsByClassName('faux-item');
        while (fauxItems.length > 0) {
            listElement.removeChild(fauxItems[0]);
        }
    }

    fetchListens();