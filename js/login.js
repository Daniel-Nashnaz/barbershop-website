import { validateEmail } from "./validation.js";

document.getElementById('loginForm').addEventListener('submit', async(event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('email');
    console.log(email);

    const validationResult = validateEmail(email);
    if (!validationResult === "") {
        console.error(validationResult);
        return;
    }
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loginContainer').style.display = 'none';

    const myTimeout = setTimeout(myGreeting, 5000);

    function myGreeting() {
        document.getElementById('loginContainer').style.display = 'block';

        document.getElementById('loading').style.display = 'none';
        window.location.href = 'index.html';
    }


    //  const response = await fetch(`/getAppointments?email=${email}`);
    // const appointments = await response.json();
    console.log(email);
    // שמירת פרטי המשתמש ב־LocalStorage
    localStorage.setItem('userEmail', email);

    // שמירת הפגישות ב־LocalStorage
    //localStorage.setItem('userAppointments', JSON.stringify(appointments));

    // מעבר לדף הבא


    // const appointmentsDiv = document.getElementById('appointments');
    // appointmentsDiv.innerHTML = ''; // נוקה את התוכן הקודם של הפגישות

    // appointments.forEach(appointment => {
    //     const appointmentElement = document.createElement('div');
    //     appointmentElement.textContent = `Date: ${appointment.date}, Time: ${appointment.time}`;
    //     appointmentsDiv.appendChild(appointmentElement);
    // });
});