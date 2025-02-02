import emailjs from "@emailjs/browser";

emailjs.init("YOUR_PUBLIC_KEY");

// Your form submission logic...

document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("pGZi-HeC-kpDSqhqP"); // Initialize EmailJS

    document.getElementById("userForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        // Get user input values
        const userData = {
            name: document.getElementById("name").value,
            attribute: document.getElementById("attribute").value,
            wechat: document.getElementById("wechat").value,
            email: document.getElementById("email").value,
        };

        // Send email using EmailJS
        emailjs.send("service_kzpoo7r", "template_lxlwrcw", userData)
            .then(function (response) {
                alert("✅ Email sent successfully!");
                console.log("SUCCESS", response);
                document.getElementById("userForm").reset(); // Clear the form
            })
            .catch(function (error) {
                alert("❌ Failed to send email!");
                console.error("ERROR", error);
            });
    });
});
