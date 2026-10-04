document.addEventListener("DOMContentLoaded", function () {

/* ========================================
   AUTOMATICALLY DISPLAY CURRENT YEAR
======================================== */

const yearElements = document.querySelectorAll("#current-year");

yearElements.forEach(function (element) {
    element.textContent = new Date().getFullYear();
});


/* ========================================
   ACCESSIBLE CONTACT FORM
======================================== */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {

    contactForm.addEventListener("submit", function (event) {

        // Stop the page from reloading
        event.preventDefault();


        // Check whether all required fields are valid
        if (!contactForm.checkValidity()) {

            formStatus.textContent =
                "Please correct the required fields before submitting the form.";

            // Show browser validation messages
            contactForm.reportValidity();

            return;
        }


        // Display success message
        formStatus.textContent =
            "Thank you! Your message has been successfully submitted.";

        // Clear the form
        contactForm.reset();

    });

}

});