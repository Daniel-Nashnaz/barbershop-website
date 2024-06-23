import { CLOSED_DAY_1, CLOSED_DAY_2, DAYS, UserRole } from "./constants.js";

export function validateName(name) {
    const nameRegex = /^[\u0590-\u05FFa-zA-Z\s]{2,}$/;
    return nameRegex.test(name) ? "" : "Please enter a valid name with at least two letters and no numbers.";
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address.";
}

export function validatePhone(phone) {
    const phoneRegex = /^\+?([0-9]|[-.\s()]){10,}$/;
    const phoneWithoutSpaces = phone.replace(/\s/g, ''); // Remove spaces from the phone number
    return phoneRegex.test(phoneWithoutSpaces) ? "" : "Please enter a valid phone number containing only digits.";
}

export function validateSelectedDate(selectedDate) {
    if (!selectedDate || isNaN(new Date(selectedDate))) {
        return 'Please select a valid date.';
    }

    const selectedDateTime = new Date(selectedDate);

    if (selectedDateTime.getDay() === CLOSED_DAY_1 || selectedDateTime.getDay() === CLOSED_DAY_2) {
        return `Please select a date other than ${DAYS[CLOSED_DAY_1]} or ${DAYS[CLOSED_DAY_2]}.`;
    }

    const today = new Date();
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (selectedDateTime < todayWithoutTime) {
        return 'Please select a date in the future.';
    }

    return null;
}

export function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
export function isNullOrUndefinedOrNan(value) {
    return value === null || value === undefined || isNaN(value);
}

export const isLoggedIn = () => {
    return localStorage.getItem('userData') !== null;
};
export const logout = () => {
    localStorage.removeItem('userData');
};

export const checkAdminAccess = () => {
    const currentUser = JSON.parse(localStorage.getItem('userData'));
    if (isNullOrUndefined(currentUser))
        return false;

    return currentUser.includes(UserRole.Admin) || currentUser.includes(UserRole.Barber);

};


export const navigateBasedOnRole = () => {
    const currentUser = JSON.parse(localStorage.getItem('userData'));
    console.log(currentUser);
    if (currentUser.roles.includes(UserRole.Admin)) {
        console.log("Navigate to Admin dashboard");
        window.location.href = 'barberInfo.html';
        //create admin page...
    } else if (currentUser.roles.includes(UserRole.Barber)) {
        console.log("Navigate to Barber dashboard");
        window.location.href = 'barberInfo.html';
    } else if (currentUser.roles.includes(UserRole.Customer)) {
        console.log("Navigate to Customer dashboard");
        window.location.href = 'index.html';
    } else {
        console.log("Navigate to default page");
    }
};