import { SERVER_URL } from "./constants.js";
import { AppointmentData } from "./models.js";

import { logout, checkAdminAccess, isLoggedIn, isNullOrUndefined } from "./validation.js";

const OPTIONS = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};
let barbershopsOfBarberData = [];
let appointmentData = [];


document.addEventListener('DOMContentLoaded', async() => {
    if (!isLoggedIn() && !checkAdminAccess()) {
        console.error("user not connected!");
        window.location.href = '/login.html'
        return;
    }
    const currentUser = JSON.parse(localStorage.getItem('userData'));
    const barbershopSelect = document.getElementById('barbershopSelect');
    barbershopsOfBarberData = await populateBarbershopsOfBarber(barbershopSelect, currentUser.id.BarberId[0]);
    populateFooterData(barbershopsOfBarberData[0]);
    populateOpeningHours(barbershopsOfBarberData[0].opening_hours);
    if (barbershopsOfBarberData.length === 0) {
        console.error(`no barbershop for ${currentUser.name} barber`);
    }
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'list'],
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'
        },
        selectable: true,
        defaultView: 'dayGridWeek',
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        events: async(info, successCallback, failureCallback) => {
            const startDate = info.startStr;
            const endDate = info.endStr;
            try {
                appointmentData = await getAppointmentsOfBarberInBarbershop(startDate, endDate, barbershopSelect.value, 1);
                if (appointmentData.length === 0) {
                    console.error(`no appointments for ${"Moshe"} barber`);
                }
                console.log(appointmentData);

                const events = appointmentData.map(item => ({
                    title: item.name,
                    start: item.timeStart,
                    end: item.timeEnd,
                    extendedProps: {
                        typesHaircuts: item.haircutType,
                        customerPhone: item.phone,
                        customerEmail: item.email,
                    },
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    textColor: '#ffffff'
                }));
                successCallback(events);
            } catch (error) {
                failureCallback()
                console.error('Error fetching events from server:', error);
            }
        },
        eventClick: openModal,
    });

    calendar.render();

    barbershopSelect.addEventListener('change', () => {
        const result = barbershopsOfBarberData.find(item => item.id === parseInt(barbershopSelect.value, 10));
        if (!isNullOrUndefined(result)) {
            populateFooterData(result);
            populateOpeningHours(result.opening_hours);
            calendar.refetchEvents();
        } else {
            console.error("No matching barbershop found");
        }
    });

});


const openModal = (info) => {
    document.getElementById('customerName').textContent = info.event.title || 'N/A';
    document.getElementById('haircutType').textContent = info.event.extendedProps.typesHaircuts || 'N/A';
    document.getElementById('customerPhone').textContent = info.event.extendedProps.customerPhone || 'N/A';
    document.getElementById('customerEmail').textContent = info.event.extendedProps.customerEmail || 'N/A';
    document.getElementById('startTime').textContent = getCurrentTime(info.event.start) || 'N/A';
    document.getElementById('endTime').textContent = getCurrentTime(info.event.end) || 'N/A';
    //document.getElementById('additionalDetails').textContent = info.event.extendedProps. || 'N/A';
    document.getElementById('eventModal').style.display = 'block';
}
const getAppointmentsOfBarberInBarbershop = async(startDate, endDate, barbershopId, barberId) => {
    try {
        const response = await fetch(`${SERVER_URL}/appointmentsByDateRangeAndBarberIdAndBarbershopId?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&barberId=${barberId}&barbershopId=${barbershopId}`, OPTIONS);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const serverData = await response.json();
        return serverData.map(item => {
            const appointmentData = new AppointmentData();
            appointmentData.timeStart = item.appointment_time_start;
            appointmentData.timeEnd = item.appointment_time_end;
            appointmentData.haircutType = item.typesHaircuts.join(', ');
            appointmentData.name = item.customers.name;
            appointmentData.email = item.customers.email;
            appointmentData.phone = item.customers.phone_number;
            return appointmentData;
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return []; // Return empty array on error
    }


};

window.closeModal = () => {
    document.getElementById('eventModal').style.display = 'none';
};
window.logout = () => {
    logout();
};

const getCurrentTime = (date) => {
    console.log(date);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return hours + ':' + minutes;
};

const populateBarbershopsOfBarber = async(barbershopSelect, barberId) => {
    try {
        const response = await fetch(`${SERVER_URL}/barbershop/getBarbershopOfBarberId/${barberId}`, OPTIONS);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        barbershopsOfBarberData = await response.json();
        if (barbershopsOfBarberData && barbershopsOfBarberData.length !== 0 && Array.isArray(barbershopsOfBarberData)) {
            barbershopsOfBarberData.forEach(shop => {
                const option = document.createElement('option');
                option.value = shop.id;
                option.text = shop.name + " " + shop.address + " " + shop.city;
                barbershopSelect.appendChild(option);
            });
            return barbershopsOfBarberData;
        } else {
            console.error('Data is empty or not an array:', barbershopsOfBarberData);
            //showError('Data is empty or not an array.');
            return [];
        }
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        //showError('There was a problem with your fetch operation.');
        return [];
    }
};

const populateFooterData = (data) => {
    const phoneNumberElement = document.getElementById('phone-number');
    phoneNumberElement.textContent = data.phone_number;

    const emailElement = document.getElementById('email');
    emailElement.textContent = data.email;

    const locationDetailsElement = document.getElementById('location-details');
    locationDetailsElement.innerHTML = `
        <li>Address: ${data.address}</li>
        <li>City: ${data.city}</li>
    `;
}

const populateOpeningHours = (openingHours) => {
    const openingHoursList = document.getElementById('opening-hours-list');
    openingHoursList.innerHTML = '';

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    daysOfWeek.forEach(day => {
        const hours = openingHours[day].opening_hours;
        const listItem = document.createElement('li');

        if (hours.length > 0) {
            const formattedHours = hours.map(h => `${h.start} - ${h.end}`).join(', ');
            listItem.innerHTML = `<strong>${day}:</strong> ${formattedHours}`;
        } else {
            listItem.innerHTML = `<strong>${day}:</strong> Closed`;
        }

        openingHoursList.appendChild(listItem);

        const today = new Date().getDay();
        if (today === daysOfWeek.indexOf(day)) {
            listItem.style.color = '#d19f68';
        }
    });
}