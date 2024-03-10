document.addEventListener('DOMContentLoaded', function() {
    // Create the cover art preview element
    var coverArtPreview = document.createElement('img');
    coverArtPreview.id = 'coverart-preview';
    document.body.appendChild(coverArtPreview);

    // Function to show and position the cover art preview
    function showCoverArtPreview(event) {
        coverArtPreview.src = event.currentTarget.getAttribute('data-coverart');
        coverArtPreview.style.left = event.pageX + 15 + 'px';
        coverArtPreview.style.top = event.pageY + 15 + 'px';
        coverArtPreview.classList.add('visible');
    }

    // Function to hide the cover art preview
    function hideCoverArtPreview() {
        coverArtPreview.classList.remove('visible');
    }

    // Attach event listeners to each review item
    document.querySelectorAll('.review-item').forEach(function(item) {
        item.addEventListener('mousemove', showCoverArtPreview);
        item.addEventListener('mouseleave', hideCoverArtPreview);
    });
});