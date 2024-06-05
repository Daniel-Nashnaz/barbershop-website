document.addEventListener("DOMContentLoaded", function () {
    populateHours();
    const bookingForm = document.getElementById("bookingForm");
    const errorMessageContainer = document.getElementById("errorPopup");
    const successMessageContainer = document.getElementById("successPopup");

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

        const errorMessages = [];

        if (selectedBarbershop === "") {
            errorMessages.push("Please select a barbershop.");
        }

        if (selectedBarber === "") {
            errorMessages.push("Please select a barber.");
        }

        if (selectedHaircutTypes.length === 0) {
            errorMessages.push("Please select at least one haircut type.");
        }

        if (selectedDate < currentDate || selectedDate.getDay() === 5 || selectedDate.getDay() === 6) {
            errorMessages.push("Please select a valid date (not including Friday or Saturday, and not in the past).");
        }

        if (selectedTime === "") {
            errorMessages.push("Please select a time.");
        }

        if (!/^[a-zA-Z\s]{2,}$/.test(customerName)) {
            errorMessages.push("Please enter a valid name with at least two letters and no numbers.");
        }

        if (!/^\d+$/.test(customerPhone)) {
            errorMessages.push("Please enter a valid phone number containing only digits.");
        }

        if (!isValidEmail(customerEmail)) {
            errorMessages.push("Please enter a valid email address.");
        }

        if (errorMessages.length > 0) {
            showErrorMessages(errorMessages);
        } else {
            // If the form is valid, display success modal
            openModal()
            showSuccessModal();
        }

    // Event listener for the confirm button
    document.getElementById("confirmButton").addEventListener("click", function () {
        closeModal();
        // Additional actions upon confirmation, if needed
    });

    // Event listener for the reset button
    document.getElementById("resetButton").addEventListener("click", function () {
        bookingForm.reset();
        closeModal();
    });

    // Function to close the modal
});


    // Function to validate email address
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to populate appointment hours
    function populateHours() {
        var select = document.getElementById("appointmentTime");
        for (var i = 0; i < hours.length; i++) {
            var option = document.createElement("option");
            option.text = hours[i];
            option.value = hours[i];
            select.appendChild(option);
        }
    }

    // Function to display error messages in a pop-up
    function showErrorMessages(messages) {
        const errorMessage = messages.join("\n");
        alert(errorMessage);
    }
/*
    // Function to display success modal
    function showSuccessModal() {
        const modal = document.getElementById("successModal");
        modal.style.display = "block";
    }

    // Close the modal when the user clicks on the close button
    const closeBtn = document.querySelector(".close");
    closeBtn.addEventListener("click", function () {
        const modal = document.getElementById("successModal");
        modal.style.display = "block";
    });

    // Close the modal when the user clicks outside of it
    window.addEventListener("click", function (event) {
        const modal = document.getElementById("successModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    */
});



let scrollPosition = 0;

function openModal() {
    const modal = document.getElementById("successModal");
    modal.style.display = "block";
    disableScroll(); // מנע גלילה
}

function closeModal() {
    const modal = document.getElementById("successModal");
    modal.style.display = "none";
    enableScroll(); // שחרור המניעה
}

function disableScroll() {
    scrollPosition = document.documentElement.scrollTop;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

function enableScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, scrollPosition);
}

var hours = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
];


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