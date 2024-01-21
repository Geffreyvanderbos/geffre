// To calculate the total listens of all time from the provided API response, you need to sum up the listen_count of each item in the listening_activity array.
function processListeningActivityResponse(data) {
    return data.payload.listening_activity.reduce((total, item) => total + item.listen_count, 0);
}

// To calculate the average daily listens from the given data structure, you need to sum up the listen counts for each hour and then divide by the number of days represented in the data
function processDailyActivityResponse(data) {
    let totalListens = 0;
    let daysCounted = 0;

    for (const day in data.payload.daily_activity) {
        const dayActivity = data.payload.daily_activity[day];
        dayActivity.forEach(hour => {
            totalListens += hour.listen_count;
        });
        daysCounted++;
    }

    return daysCounted > 0 ? Math.round(totalListens / daysCounted) : 0;
}


const statsConfig = [
    {
        id: 'statsUniqueArtists',
        label: 'Unique Artists',
        apiUrl: 'https://api.listenbrainz.org/1/stats/user/Geffrey/artists',
        processResponse: data => data.payload.total_artist_count // Example for array length
    },
    {
        id: 'statsUniqueReleases',
        label: 'Unique Releases',
        apiUrl: 'https://api.listenbrainz.org/1/stats/user/Geffrey/releases',
        processResponse: data => data.payload.total_release_count // Example for array length
    },
    {
        id: 'statsTotalListens',
        label: 'Songs Played',
        apiUrl: 'https://api.listenbrainz.org/1/stats/user/Geffrey/listening-activity',
        processResponse: processListeningActivityResponse
    },
    {
        id: 'statsAvgDailyListens',
        label: 'Tracks a Day (avg.)',
        apiUrl: 'https://api.listenbrainz.org/1/stats/user/Geffrey/daily-activity',
        processResponse: processDailyActivityResponse
    }
    
];

function createStatsElements(config) {
    config.forEach(stat => {
        // Create the container div
        const div = document.createElement('div');
        div.className = 'stats-grid__item';

        // Create and append the number span
        const numberSpan = document.createElement('span');
        numberSpan.className = 'listeningstats__number';
        numberSpan.id = stat.id;
        div.appendChild(numberSpan);

        // Create and append the label span
        const labelSpan = document.createElement('span');
        labelSpan.className = 'listeningstats__label';
        labelSpan.textContent = stat.label;
        div.appendChild(labelSpan);

        // Append the div to a parent element, e.g., a specific section in your HTML
        document.getElementById('listeningStats').appendChild(div); // Replace 'parentElementId' with your parent element's ID
    });
}

function updateAllListeningStats() {
    statsConfig.forEach(stat => {
        fetch(stat.apiUrl)
            .then(response => response.json())
            .then(data => {
                const count = stat.processResponse(data);
                const el = document.getElementById(stat.id);
                animateCountUp(el, 0, count, 1000);
            })
            .catch(error => console.error('Error fetching listening statistics:', error));
    });
}

function easeOutExpo(t, b, c, d) {
    return c * (-Math.pow(2, -5 * t / d) + 1) + b;
}

function animateCountUp(el, start, end, duration) {
    let current = start;
    const range = end - start;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        let increment = easeOutExpo(progress, start, range, duration);

        el.innerHTML = Math.round(increment);

        if (progress < duration) {
            window.requestAnimationFrame(step);
        } else {
            el.innerHTML = end;
        }
    }

    window.requestAnimationFrame(step);
}

createStatsElements(statsConfig);
updateAllListeningStats();