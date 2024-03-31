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

// Like button sparks!
document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.querySelector('.tinylytics_kudos');

    // This function will add a new click event listener without interfering with existing ones
    function addSparkEffect() {
        if (likeButton.disabled) {
            return; // Do nothing if the button is disabled
        }

        for (let i = 0; i < 20; i++) {
            const spark = document.createElement('div');
            spark.style.position = 'absolute';
            spark.style.width = '1px';
            spark.style.height = '1px';
            spark.style.backgroundColor = 'black';
            spark.style.left = `44px`;
            spark.style.top = `18px`;

            likeButton.parentNode.appendChild(spark);

            const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            const animateX = plusOrMinus * Math.random() * 30;
            const animateY = plusOrMinus * Math.random() * 30;

            spark.animate([
                { transform: 'translate(0, 0)', opacity: 0.7 },
                { transform: `translate(${animateX}px, ${animateY}px)`, opacity: 0 }
            ], {
                duration: Math.random() * 300 + 600,
                easing: 'ease-out',
                fill: 'forwards'
            });

            spark.addEventListener('animationend', function() {
                spark.remove();
            });
        }
    }

    likeButton.addEventListener('click', addSparkEffect);
});