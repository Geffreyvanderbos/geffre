// To calculate the total listens of all time from the provided API response, you need to sum up the listen_count of each item in the listening_activity array.
function processListeningActivityResponse(data) {
    return data.payload.listening_activity.reduce((total, item) => total + item.listen_count, 0);
}

// calculate the average daily listens from the fetched data
function processDailyActivityResponse(data) {
    let totalListens = 0;
    let totalDays = 0;

    for (const day in data.payload.daily_activity) {
        const dayActivity = data.payload.daily_activity[day];
        let dayTotalListens = 0;
        dayActivity.forEach(hour => {
            dayTotalListens += hour.listen_count;
        });
        console.log(`${day}: Total Listens = ${dayTotalListens}`);
        totalListens += dayTotalListens;
        if (dayTotalListens > 0) totalDays++;
    }

    console.log(`Total Listens for all days: ${totalListens}`);
    console.log(`Total Active Days: ${totalDays}`);

    const averageListens = totalDays > 0 ? Math.round(totalListens / totalDays) : 0;
    console.log(`Average Daily Listens: ${averageListens}`);
    return averageListens;
}

const statsConfig = [
    {
        id: 'statsUniqueArtists',
        label: 'Unique Artists',
        apiUrl: 'https://api.listenbrainz.org/1/stats/user/Geffrey/artists',
        processResponse: data => data.payload.total_artist_count
    },
    {
        id: 'statsUniqueReleases',
        label: 'Unique Releases',
        apiUrl: 'https://api.listenbrainz.org/1/stats/user/Geffrey/releases',
        processResponse: data => data.payload.total_release_count
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
        apiUrl: `https://api.listenbrainz.org/1/stats/user/Geffrey/daily-activity?range=week`,
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

        // Append the div to a parent element
        document.getElementById('listeningStats').appendChild(div);
    });
}

function updateAllListeningStats() {
    statsConfig.forEach(stat => {
        fetch(stat.apiUrl)
            .then(response => response.json())
            .then(data => {
                const count = stat.processResponse(data);
                const el = document.getElementById(stat.id);
                animateCountUp(el, 0, count, 5000);
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