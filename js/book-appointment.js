import { IP, PORT } from './constants.js';
import { AppointmentData } from './models.js';
import { validateName, validateEmail, validatePhone, validateSelectedDate, isNullOrUndefined, isNullOrUndefinedOrNan } from './validation.js';
let validations = false;
let scrollPosition = 0;

const appointmentData = new AppointmentData();
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("appointmentDate");
    const selectedTime = document.getElementById("appointmentTime");
    const selectedBarbershops = document.getElementById("barbershops");
    const selectedBarbers = document.getElementById("barbers");
    const selectedHaircutTypes = document.querySelectorAll('input[name="haircut_type[]"]');
    const nameInput = document.getElementById("customer_name");
    const emailInput = document.getElementById("customer_email");
    const phoneInput = document.getElementById('customer_phone');
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
    const form = document.getElementById("appointmentForm");
    populateBarbershops(selectedBarbershops);

    dateInput.addEventListener('change', () => {
        showAvailableTimes(dateInput, selectedTime, showError);
    });

    selectedBarbershops.addEventListener('change', () => {
        handleSelectionBarbershopsChange(selectedBarbershops.value);
        selectedBarbers.innerHTML = "";
        if (selectedBarbershops.value !== "") {
            populateBarbers(selectedBarbers);
        }
    });

    selectedBarbers.addEventListener('change', () => {
        handleSelectionBarbersChange(selectedBarbers.value);
    });

    handleSelectedCheckboxesChange(selectedHaircutTypes);

    selectedTime.addEventListener('change', () => {
        appointmentData.timeStart = new Date(dateInput.value + 'T' + selectedTime.value);
        appointmentData.timeEnd = new Date(dateInput.value + 'T' + addHalfHourToTime(selectedTime.value));
    });

    nameInput.addEventListener('input', (event) => {
        const validateNameResult = validateName(event.target.value);
        if (validateNameResult === "") {
            appointmentData.name = event.target.value;
            showError();
        } else {
            appointmentData.name = null;
            showError(validateNameResult);
        }
    });

    emailInput.addEventListener('input', (event) => {
        const validateEmailResult = validateEmail(event.target.value);
        if (validateEmailResult === "") {
            appointmentData.email = event.target.value;
            showError();
        } else {
            appointmentData.email = null;
            showError(validateEmailResult);
        }
    });

    phoneInput.addEventListener('input', (event) => {
        const validatePhoneResult = validatePhone(event.target.value);
        if (validatePhoneResult === "") {
            appointmentData.phone = event.target.value;
            showError();
        } else {
            appointmentData.phone = null;
            showError(validatePhoneResult);
        }
    });

    form.addEventListener("reset", (event) => {
        event.preventDefault();
        selectedBarbershops.innerHTML = '';
        selectedBarbers.innerHTML = '';
        selectedTime.innerHTML = '';
        dateInput.value = '';
        form.reset();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(appointmentData);
        validateForm();
        if (validations) {
            fetch(`http://${IP}:${PORT}/addAppointment`, {
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

            //== If the form is valid, display success modal
            openModal()

        }

    });

    const validateForm = () => {
        showError();
        const errorMessages = [];
        if (isNullOrUndefined(appointmentData.barbershopId) || selectedBarbershops.value === "") {
            errorMessages.push("Please select a barbershop.");
        }

        if (isNullOrUndefined(appointmentData.barberId) || selectedBarbers.value === "") {
            errorMessages.push("Please select a barber.");
        }

        if (isNullOrUndefined(appointmentData.haircutType) || appointmentData.haircutType.length === 0) {
            errorMessages.push("Please select at least one haircut type.");
        }

        if (dateInput.value === "") {
            errorMessages.push("Please select a date.");
        }

        if (isNullOrUndefined(appointmentData.timeStart) || selectedTime.value === "") {
            errorMessages.push("Please select a time.");
        }

        if (isNullOrUndefined(appointmentData.name)) {
            errorMessages.push("Please enter your name");
        }
        if (isNullOrUndefined(appointmentData.email)) {
            errorMessages.push("Please enter your email");
        }
        if (isNullOrUndefined(appointmentData.phone)) {
            errorMessages.push("Please enter your phone");
        }

        showError(errorMessages.join('\n'));
    }

    const openModal = () => {
        const successModal = document.getElementById('statusSuccessModal');
        successModal.classList.add('show');
        disableScroll();
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.remove('show');
            form.reset();
            enableScroll();
        });
    });

    const disableScroll = () => {
        scrollPosition = document.documentElement.scrollTop;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    const enableScroll = () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollPosition);
    }
});



const showAvailableTimes = async(selectedDate, timeSelect, errorHandler) => {
    let availableTimes;
    if (isNullOrUndefinedOrNan(appointmentData.barbershopId)) {
        errorHandler("Please select a barbershop.");
        timeSelect.innerHTML = '';
        selectedDate.value = '';
        return;
    }

    if (isNullOrUndefinedOrNan(appointmentData.barberId)) {
        errorHandler("Please select a barber.");
        timeSelect.innerHTML = '';
        selectedDate.value = '';
        return;
    }

    const validateMessage = validateSelectedDate(selectedDate.value);
    if (!isNullOrUndefinedOrNan(validateMessage)) {
        timeSelect.innerHTML = '';
        selectedDate.value = '';
        errorHandler(validateMessage);
        return;
    }
    try {
        const response = await fetch(`http://${IP}:${PORT}/availableSlots?date=${selectedDate.value}&barberId=${appointmentData.barberId}&barbershopId=${appointmentData.barbershopId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        availableTimes = await response.json();
    } catch (error) {
        timeSelect.innerHTML = '';
        selectedDate.value = '';
        console.error('There was a problem with your fetch operation:', error);
        errorHandler('There was a problem with your fetch operation.');
    }
    console.log(availableTimes);
    if (availableTimes && availableTimes.length !== 0 && Array.isArray(availableTimes)) {
        timeSelect.innerHTML = '';
        const option = document.createElement("option");
        option.value = "";
        timeSelect.add(option);
        availableTimes.forEach(time => {
            const option = document.createElement('option');
            option.text = time;
            timeSelect.add(option);
        });
        errorHandler();
    } else {
        timeSelect.innerHTML = '';
        console.error('Data is empty or not an array:', availableTimes);
        errorHandler('Data is empty, there are no queues');
    }
}

const populateBarbershops = async(selectedBarbershop) => {
    let barbershopsData;
    try {
        const response = await fetch(`http://${IP}:${PORT}/barbershop/barbershops`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        barbershopsData = await response.json();

        if (barbershopsData && barbershopsData.length !== 0 && Array.isArray(barbershopsData)) {
            barbershopsData.forEach((data) => {
                const option = document.createElement("option");
                option.text = data.name + " " + data.address + " " + data.city;
                option.value = data.id;
                selectedBarbershop.appendChild(option);
            });
        } else {
            console.error('Data is empty or not an array:', barbershopsData);
            showError('Data is empty or not an array.');
        }
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        showError('There was a problem with your fetch operation.');
    }
}
const populateBarbers = async(selectedBarbershop) => {
    let barbersData;
    try {
        const response = await fetch(`http://${IP}:${PORT}/barber/getBarbersOfBarbershopId/${appointmentData.barbershopId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        barbersData = await response.json();
        console.log(barbersData);
        if (barbersData && barbersData.length !== 0 && Array.isArray(barbersData)) {
            //TODO: remove this code and fix the event of selected barber
            const option = document.createElement("option");
            option.value = "";
            selectedBarbershop.appendChild(option);
            barbersData.forEach((data) => {
                const option = document.createElement("option");
                option.text = data.name;
                option.value = data.id;
                selectedBarbershop.appendChild(option);
            });
        } else {
            console.error('Data is empty or not an array:', barbersData);
            showError('Data is empty or not an array.');
        }
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        showError('There was a problem with your fetch operation.');
    }
}

const handleSelectedCheckboxesChange = (selectedHaircutTypes) => {
    const selectedCheckboxes = [];
    selectedHaircutTypes.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                selectedCheckboxes.push(event.target.value.toString());
            } else {
                const index = selectedCheckboxes.indexOf(event.target.value);
                if (index !== -1) {
                    selectedCheckboxes.splice(index, 1);
                }
            }
            appointmentData.haircutType = selectedCheckboxes;
        });
    });

}

const handleSelectionBarbershopsChange = (selectedBarbershop) => {
    appointmentData.barbershopId = parseInt(selectedBarbershop);
}

const handleSelectionBarbersChange = (selectedBarber) => {
    appointmentData.barberId = parseInt(selectedBarber);
    console.log(selectedBarber);
}

const showError = (errorMessage = "") => {
    const errorMessageElement = document.getElementById('error-message');
    console.log(errorMessage);
    if (isNullOrUndefined(errorMessage) || errorMessage === "") {
        console.log("true");
        validations = true;
    } else {
        console.log("false");

        validations = false;
    }
    errorMessageElement.textContent = errorMessage;
}

const addHalfHourToTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    let newHours = hours;
    let newMinutes = minutes + 30;
    if (newMinutes >= 60) {
        newHours++;
        newMinutes -= 60;
    }
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}