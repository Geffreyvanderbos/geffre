---
category: technology
created: 2024-04-01
title: "Understanding Streaming Music Royalty Payments"
updated: 2024-04-01
---

Note: What I share here is a simplified take on how royalty payouts work. There's a lot more to it, with lots of details and nuances. I put this note together to communicate clearer, especially when I'm chatting with people who might not be as familiar with all the ins and outs.

Most music streaming services in 2024 use the pro-rata payout system. It's a method used to distribute royalties to the sound recording owners. In most cases, the record labels. For the sake of simplicity I won't go into the different types of royalties.

The pro-rata system divides the amount of money generated from users among artists based on their share of the total stream, after deducting the streaming service's cut.

Let's consider Spotify, which in 2023 generated about €1.11 billion in revenue per month ([source](https://www.businessofapps.com/data/spotify-statistics/)). Spotify typically retains about 30% of this revenue, which amounts to €333 million (€1.11 billion * 30% = €0.333 billion). Leaving the rest available for distributing among the ≈2 million artists on their service.

The popularity of an artist matters a lot. For instance, a global superstar like Taylor Swift, who accounted (in 2023) for about 1.79% of all Spotify streams in the U.S. market alone  ([source](https://www.recordoftheday.com/on-the-move/news-press/34-global-streaming-growth-uplift-luminate-releases-2023-year-end-music-report#:~:text=%C3%A2%E2%80%94%C2%8F%C2%A0%C2%A0%C2%A0%C2%A0%C2%A0%C2%A0Taylor%20Swift%20made%20up%201.79%25%20of%20the%20U.S.%20market%20(Albums%20w/%20TEA%20w/%20SEA%20On%2DDemand%20Audio)%20and%201%20in%20every%2078%20U.S.%20Audio%20streams.)), would command a significantly larger portion of the payout pool compared to your average metal band with significantly fewer streams.

The model has very real implications for artists and the music industry in general. The pro-rata payout system rewards popularity and mass appeal. Neglecting the 'small' artists that are forced to find other sources of income. 

When you are a fan of artists with less ‘mass appeal’, support them by buying their recordings and merchandise. Visit their performances. Spread the word.


## Streaming Service Simulator
<br>
<div class="input-group">
  <label for="revenue">Monthly Revenue:</label>
  <input type="number" id="revenue" value="1000" style="width: 86px;">
</div>

<div class="input-group">
  <label for="serviceCut">Service's Cut (%):</label>
  <input type="number" id="serviceCut" value="30" style="width: 48px;">
</div>

<div class="input-group">
  <label for="numArtists">Number of Artists:</label>
  <input type="number" id="numArtists" value="2" min="1" max="10" size="2">
  <button onclick="setupArtistInputs()">Set Artists</button>
</div>

<div id="artists-container">
  <!-- Artist inputs will be generated here -->
</div>

<button onclick="calculatePayouts()">Calculate Payouts</button>

<div id="results">
  <!-- Results will be displayed here -->
</div>

<style>
    .result {
        display: block;
        margin-bottom: .24rem;
    }
</style>
<script>
function setupArtistInputs() {
  const container = document.getElementById('artists-container');
  container.innerHTML = ''; // Clear existing inputs
  const numArtists = Math.min(parseInt(document.getElementById('numArtists').value), 10);
  
  let remainingPercentage = 100;
  for (let i = 1; i <= numArtists; i++) {
    const artistPercentage = Math.round(remainingPercentage / (numArtists - i + 1));
    remainingPercentage -= artistPercentage;
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('artist-input');
    inputGroup.innerHTML = `
      <label>Artist ${i} Streams (% of total): </label>
      <input type="number" class="artistStreams" id="artist${i}Streams" min="0" max="100" value="${artistPercentage}" onchange="adjustPercentages()">
    `;
    container.appendChild(inputGroup);
  }
}

function adjustPercentages() {
  const artistInputs = document.querySelectorAll('.artistStreams');
  let totalPercentage = 0;

  artistInputs.forEach(input => {
    totalPercentage += parseFloat(input.value);
  });

  const warningMsg = document.getElementById('warning-message');
  if (totalPercentage > 100) {
    if (!warningMsg) {
      const warningElement = document.createElement('p');
      warningElement.id = 'warning-message';
      warningElement.innerText = 'Warning: The total percentage exceeds 100%. Please adjust the values.';
      document.getElementById('artists-container').appendChild(warningElement);
    }
  } else if (warningMsg) {
    warningMsg.remove();
  }
}

function calculatePayouts() {
  const revenue = parseFloat(document.getElementById('revenue').value);
  const serviceCut = parseFloat(document.getElementById('serviceCut').value);
  const serviceCutAmount = revenue * (serviceCut / 100);
  const netRevenue = revenue - serviceCutAmount;
  const artistInputs = document.querySelectorAll('.artistStreams');
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  const serviceCutElement = document.createElement('span');
  serviceCutElement.className = "result";
  serviceCutElement.innerText = `Service's Cut: €${serviceCutAmount.toFixed(2)}`;
  resultsContainer.appendChild(serviceCutElement);
  
  artistInputs.forEach((input, index) => {
    const artistStreamsPercentage = parseFloat(input.value);
    const payout = netRevenue * (artistStreamsPercentage / 100);
    const payoutElement = document.createElement('span');
    payoutElement.className = "result";
    payoutElement.innerText = `Artist ${index + 1} Payout: €${payout.toFixed(2)}`;
    resultsContainer.appendChild(payoutElement);
  });
}

setupArtistInputs(); // Initialize with 2 artists
</script>