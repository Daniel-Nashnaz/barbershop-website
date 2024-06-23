import { SERVER_URL, UserRole } from "./constants.js";
import { isLoggedIn, navigateBasedOnRole, validateEmail } from "./validation.js";
let myTimeout;

document.addEventListener("DOMContentLoaded", () => {
    if (isLoggedIn()) {
        console.log("asasas");
        navigateBasedOnRole();
        return;
    }
    const errorMessage = document.getElementById('error');
    const selectedEmail = document.getElementById('email');

    selectedEmail.addEventListener('input', () => {
        errorMessage.innerHTML = '';
    });

    document.getElementById('loginForm').addEventListener('submit', async(event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const email = formData.get('email');
            console.log(email);

            const validationResult = validateEmail(email);
            if (!validationResult === "") {
                console.error(validationResult);
                return;
            }
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('loading').style.display = 'block';

            myTimeout = setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('loginContainer').style.display = 'block';
            }, 3000);

            const response = await fetch(`${SERVER_URL}/getUserRoleData/${email}`);
            const userData = await response.json();
            localStorage.setItem('userData', JSON.stringify(userData));
            navigateBasedOnRole();
        } catch (error) {
            console.error('Error fetching user data:', error);
            errorMessage.innerHTML = 'Error fetching user data try again';
        }



    });
});