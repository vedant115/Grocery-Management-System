// Add your custom JavaScript here
$(document).ready(function () {
    $('#login-form').submit(function (e) {
        e.preventDefault();

        // You can add your login logic here, e.g., check username and password.
        // If login is successful, redirect to the main page.
        // If login fails, display an error message.

        // Example:
        var username = $('#username').val();
        var password = $('#password').val();

        // Check username and password here
        if (username === 'username' && password === 'password') {
            // Successful login, redirect to the main page
            window.location.href = 'dashboard.html';
        } else {
            // Failed login, display an error message
            alert('Invalid username or password. Please try again.');
        }
    });
});
