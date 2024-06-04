document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("bookingForm");

    // Call the populateHours function to generate and populate the select list
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedBarbershop = document.getElementById("barbershop_number").value;
        const selectedBarber = document.getElementById("barber_name").value;
        const selectedHaircutTypes = document.querySelectorAll('input[name="haircut_type[]"]:checked');
        const selectedDate = new Date(document.getElementById("appointmentDate").value);
        const currentDate = new Date();
        const selectedTime = document.getElementById("appointmentTime").value;
        const customerName = document.getElementById("customer_name").value;
        const customerEmail = document.getElementById("customer_email").value;
        const customerPhone = document.getElementById("customer_phone").value;


        let isValid = true;
        const errorMessages = [];

        if (selectedBarbershop === "") {
            isValid = false;
            errorMessages.push("Please select a barbershop.");
        }

        if (selectedBarber === "") {
            isValid = false;
            errorMessages.push("Please select a barber.");
        }

        if (selectedHaircutTypes.length === 0) {
            isValid = false;
            errorMessages.push("Please select at least one haircut type.");
        }

        if (selectedDate < currentDate || selectedDate.getDay() === 5 || selectedDate.getDay() === 6) {
            isValid = false;
            errorMessages.push("Please select a valid date (not including Friday or Saturday, and not in the past).");
        }

        if (selectedTime === "") {
            isValid = false;
            errorMessages.push("Please select a time.");
        }

        if (!/^[a-zA-Z\s]{2,}$/.test(customerName)) {
            isValid = false;
            errorMessages.push("Please enter a valid name with at least two letters and no numbers.");
        }

        if (!/^\d+$/.test(customerPhone)) {
            isValid = false;
            errorMessages.push("Please enter a valid phone number containing only digits.");
        }

        if (!isValidEmail(customerEmail)) {
            isValid = false;
            errorMessages.push("Please enter a valid email address.");
        }

        if (!isValid) {
            alert(errorMessages.join("\n"));
        } else {
            // If the form is valid, you can proceed with form submission
            alert("Form submitted successfully!");
            bookingForm.submit();
        }
    });

    // Function to validate email address
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Generating list of hours


    // Other form validation code goes here...


});

/* document.addEventListener('DOMContentLoaded', function () {

 const dateInput = document.getElementById('appointmentDate');
   const appointmentTimeSelect = document.getElementById('appointmentTime');
   const form = document.getElementById('appointmentForm');
   const errorMessage = document.getElementById('errorMessage');

   // Call showAvailableTimes immediately to check if a date is selected
   // showAvailableTimes(dateInput.value, appointmentTimeSelect);

   // Add event listener for date change
   dateInput.addEventListener('change', function () {
       showAvailableTimes(dateInput.value, appointmentTimeSelect);
   });

   form.addEventListener('submit', function (event) {
       event.preventDefault(); // Prevent default form submission behavior

       const selectedDate = dateInput.value;
       const selectedTime = appointmentTimeSelect.value;
       const selectedHaircut = document.getElementById('haircutType').value;
       const name = document.getElementById('name').value;
       const email = document.getElementById('email').value;
       const phone = document.getElementById('phone').value;

       // Validate inputs
       if (!selectedDate || !selectedTime || !selectedHaircut || !name || !email || !phone) {
           errorMessage.textContent = 'Please fill out all fields.';
           return;
       }

       const appointmentDateTimeStart = new Date(selectedDate + 'T' + selectedTime);
       const appointmentDateTimeEnd = new Date(selectedDate + 'T' + addHalfHourToTime(selectedTime));

       // Create an object with the appointment details
       const appointmentData = {
           timeStart: appointmentDateTimeStart,
           timeEnd: appointmentDateTimeEnd,
           haircutType: parseInt(selectedHaircut),
           name: name,
           email: email,
           phone: phone
       };
       // If all inputs are valid, you can proceed with submitting the form or handling the appointment data.
       // For demonstration purposes, I'm just logging the appointment data.
       console.log('Appointment Details:');
       console.log('Date:', appointmentDateTimeStart);
       console.log('Date:', appointmentDateTimeEnd);
       console.log('Haircut Type:', selectedHaircut);
       console.log('Name:', name);
       console.log('Email:', email);
       console.log('Phone:', phone);

       // Clear any previous error message
       errorMessage.textContent = '';

       fetch('http://localhost:3001/addAppointment', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(appointmentData),
       })
           .then(response => response.json())
           .then(data => {
               console.log('New customer and appointment:', data);
           })
           .catch(error => {
               console.error('Error:', error);
           });
   });
});

function addHalfHourToTime(time) {
   const [hours, minutes] = time.split(':').map(Number);
   let newHours = hours;
   let newMinutes = minutes + 30;
   if (newMinutes >= 60) {
       newHours++;
       newMinutes -= 60;
   }
   return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

async function showAvailableTimes(selectedDate, timeSelect) {
   console.log(selectedDate);
   console.log(timeSelect);
   let availableTimes;
   const errorMessage = document.getElementById('errorMessage');

   if (!selectedDate) {
       errorMessage.textContent = 'Please select a date to show available times';
       timeSelect.innerHTML = '';
       return;
   }
   const selectedDateTime = new Date(selectedDate);
   if (selectedDateTime.getDay() === 5 || selectedDateTime.getDay() === 6) {
       errorMessage.textContent = 'Please select a date other than Friday or Saturday.';
       return;
   }
   // Validate date
   const today = new Date();
   const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
   if (selectedDateTime < todayWithoutTime) {
       errorMessage.textContent = 'Please select a date in the future.';
       timeSelect.innerHTML = '';
       return;
   }

   try {
       const response = await fetch(`http://localhost:3001/availableSlots/${selectedDate}`);
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       availableTimes = await response.json();
       console.log(availableTimes);
   } catch (error) {
       console.error('There was a problem with your fetch operation:', error);
   }

   timeSelect.innerHTML = '';

   if (availableTimes && Array.isArray(availableTimes)) {
       availableTimes.forEach(time => {
           const option = document.createElement('option');
           option.text = time;
           timeSelect.add(option);
       });
   } else {
       console.error('Data is empty or not an array:', availableTimes);
   }

   // Clear any previous error message
   errorMessage.textContent = '';
}
*/