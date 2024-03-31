document.addEventListener('DOMContentLoaded', function() {
    // Create the cover art preview element
    var coverArtPreview = document.createElement('img');
    coverArtPreview.id = 'coverart-preview';
    document.body.appendChild(coverArtPreview);

    // Function to show and position the cover art preview
    function showCoverArtPreview(event) {
        coverArtPreview.src = event.currentTarget.getAttribute('data-coverart');
        var yPosition = event.currentTarget.getAttribute('data-coverart-y-position');
        // Use clientX and clientY for positioning relative to the viewport
        coverArtPreview.style.left = event.clientX + 15 + 'px';
        coverArtPreview.style.top = event.clientY + Number(yPosition) + 'px';
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

//  Like button sparks!
document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.querySelector('.tinylytics_kudos');

    likeButton.addEventListener('click', function() {
        // Generate multiple sparks
        for (let i = 0; i < 20; i++) { // Change 10 to the number of sparks you want
            const spark = document.createElement('div');
            spark.style.position = 'absolute';
            spark.style.width = '1px'; // Slightly larger spark
            spark.style.height = '1px';
            spark.style.backgroundColor = 'black';
            // spark.style.left = `${Math.random() * 5}%`;
            // spark.style.top = `${Math.random() * 5}%`;
            spark.style.left = `44px`;
            spark.style.top = `18px`;

            // Add the spark to the container
            this.parentNode.appendChild(spark);

            // Animate the spark
            const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            const animateX = plusOrMinus * Math.random() * 30; // Adjust for larger spread
            const animateY = plusOrMinus * Math.random() * 30;

            spark.animate([
                // Keyframes
                { transform: 'translate(0, 0)', opacity: .7 },
                { transform: `translate(${animateX}px, ${animateY}px)`, opacity: 0 }
            ], {
                // Timing options
                duration: Math.random() * 300 + 600, // Randomize duration for each spark
                easing: 'ease-out',
                fill: 'forwards'
            });

            // Remove the spark after the animation
            spark.addEventListener('animationend', function() {
                this.remove();
            });
        }
    });
});