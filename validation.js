const registerValidation = (data) => {
    if (data.email.length < 6) {
        return { message: 'email too short' };
    }

    if (data.password.length < 6) {
        return { message: 'password too short' };
    }
}

const loginValidation = (data) => {
    if (data.email.length < 6) {
        return { message: 'email too short' };
    }
}

module.exports = {
    registerValidation,
    loginValidation
}
