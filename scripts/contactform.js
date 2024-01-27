document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submit-button');
    const inputs = document.querySelectorAll('#contactForm input[type="text"], #contactForm input[type="radio"]');

    function updateButtonState() {
        let isFormValid = Array.from(inputs).every(input => {
            if (input.type === "text") {
                return input.value.trim() !== '';
            }
            if (input.type === "radio") {
                return Array.from(document.querySelectorAll('input[name="' + input.name + '"]')).some(radio => radio.checked);
            }
        });

        submitButton.disabled = !isFormValid;
    }

    inputs.forEach(input => {
        input.addEventListener('keyup', updateButtonState);
        input.addEventListener('change', updateButtonState);
    });

    updateButtonState();
});

    document.addEventListener('DOMContentLoaded', function () {
    const radioButtons = document.querySelectorAll('#contactForm input[type="radio"][name="platform"]');
    const contactLabel = document.getElementById('contact-label');

    function updateLabel() {
        const selectedChannel = document.querySelector('#contactForm input[type="radio"][name="platform"]:checked').value;
        if (selectedChannel === "email") {
            contactLabel.textContent = 'Email Address';
        }
        else if (selectedChannel === "telegram") {
            contactLabel.textContent = 'Number or Username';
        }
         else {
            contactLabel.textContent = 'Phone Number';
        }
    }

    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateLabel);
    });

    updateLabel(); // Update label on initial load
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent the default form submission

const form = event.target;
const data = new FormData(form);
const submissionMessage = document.getElementById('submissionMessage');

fetch(form.action, {
    method: 'post',
    body: data,
})
.then(function(response) {
    if (response.ok) {
        return response.text();
    } else {
        throw new Error('Network response was not ok.');
    }
})
.then(function(text) {
    submissionMessage.innerHTML = "Form submitted successfully! I'll be in touch soon!";
    form.style.display = 'none'; // Hide the form
})
.catch(function(error) {
    submissionMessage.innerHTML = "An error occurred. Please try again.";
    form.style.display = 'none'; // Hide the form even on error to prevent spam
});
});