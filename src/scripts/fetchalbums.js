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
        createFauxList(listElement, 12);

        const response = await fetch(url, options);
        const data = await response.json();
        const uniqueAlbums = getUniqueAlbums(data.payload.listens);
        await displayAlbums(uniqueAlbums.slice(0, 12));
    } catch (error) {
        console.error(error);
        }
    }

    function getUniqueAlbums(listens) {
        const albums = new Map();
        listens.forEach(listen => {
            const albumId = listen.track_metadata.mbid_mapping?.release_mbid || listen.track_metadata.additional_info.recording_msid;

            if (!albums.has(albumId)) {
                const mbidMapping = listen.track_metadata.mbid_mapping;
                const mbid = mbidMapping && (mbidMapping.release_mbid || mbidMapping.recording_mbid);
    
                const artistMbid = mbidMapping && mbidMapping.artist_mbids && mbidMapping.artist_mbids.length > 0 ? mbidMapping.artist_mbids[0] : null;
    
                albums.set(albumId, {
                    albumName: listen.track_metadata.release_name || listen.track_metadata.track_name, // Fallback to track name if release name is not available
                    artistName: listen.track_metadata.additional_info.artist_names[0],
                    artistMbid: artistMbid,
                    mbid: mbid,
                    listenedAt: listen.listened_at
                });
            }
        });
        return Array.from(albums.values());
    }

    async function fetchAlbumArt(mbid) {
        const coverArtUrl = `https://coverartarchive.org/release/${mbid}`;
        try {
            const response = await fetch(coverArtUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const frontCover = data.images.find(image => image.front === true);
            
            if (frontCover) {
                // Use the 'small' thumbnail as an example, but you could choose 'large' or the full 'image' URL
                const thumbnailUrl = frontCover.thumbnails.small;
                return thumbnailUrl;
            } else {
                console.warn(`No front cover art found for MBID: ${mbid}`);
                return 'https://geff.re/assets/cover-art-not-found.png';
            }
        } catch (error) {
            console.warn(`Error fetching album art for ${mbid}:`, error);
            return 'https://geff.re/assets/cover-art-not-found.png';
        }
    }    
    
    async function fetchAllAlbumArt(albums) {
        const albumArtUrls = await Promise.all(albums.map(async (album) => {
            const albumArtUrl = await fetchAlbumArt(album.mbid);
            return albumArtUrl ? albumArtUrl : 'https://geff.re/assets/cover-art-not-found.png';
        }));
        return albumArtUrls;
    }

    async function displayAlbums(albums) {
        const albumReviews = await fetchAlbumReviews();
        const listElement = document.getElementById('listenList');
        const albumArtUrls = await fetchAllAlbumArt(albums);
        
        albums.forEach((album, index) => {
            console.log(album.mbid); // Log the MBID you're using to access the review URL
            console.log(albumReviews); // Log the entire albumReviews object to see its structure and keys
            const reviewUrl = albumReviews[album.mbid]; // Attempt to access the review URL using the MBID
            
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
        albumArt.alt = `Album Art for ${album.mbid}`;
        albumArt.width = '100';
        albumArt.height = '100';    
        // albumArt.loading = 'lazy';
        albumArt.style.opacity = 0; // Start with opacity 0
        albumArt.style.transition = 'opacity .5s ease-in'; // Set transition for opacity
    
        // Event listener for when the image has loaded
        albumArt.onload = () => {
            albumArt.style.opacity = 1; // Fade-in effect
        };
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

        // Check for artist MBID and create link if present
        let artistContent;
        if (album.artistMbid) {
            const artistUrl = `https://musicbrainz.org/artist/${album.artistMbid}`;
            artistContent = `<a href="${artistUrl}" target="_blank">${album.artistName}</a>`;
        } else {
            artistContent = album.artistName;
        }
        titleSpan.innerHTML = `${cleanAlbumName} by ${artistContent}`;
        albumInfoDiv.appendChild(titleSpan);

        // Append albumInfoDiv to listItem
        listItem.appendChild(albumInfoDiv);
    
        // Apply fade-in class for the transition effect
        listItem.classList.add('listenlist--fade-in');
    
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