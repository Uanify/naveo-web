export const translateAuthError = (message: string): string => {
    const errors: Record<string, string> = {
        "Invalid login credentials": "Correo electrónico o contraseña incorrectos",
        "Email not confirmed": "El correo electrónico no ha sido verificado",
        "User already registered": "Este correo electrónico ya está registrado",
        "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
        "Invalid email structure": "El formato del correo electrónico es inválido",
        "User not found": "No se encontró ningún usuario con ese correo",
        "Signup confirmed": "Registro confirmado",
        "New password should be different from the old password.": "La nueva contraseña debe ser diferente a la anterior",
    };

    // Fallback if message is not in the dictionary
    return errors[message] || message;
};

export const validatePassword = (password: string): { isValid: boolean; message: string | null } => {
    if (password.length < 8) {
        return { isValid: false, message: "La contraseña debe tener al menos 8 caracteres" };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: "La contraseña debe incluir al menos una letra mayúscula" };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: "La contraseña debe incluir al menos una letra minúscula" };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: "La contraseña debe incluir al menos un número" };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, message: "La contraseña debe incluir al menos un carácter especial" };
    }
    return { isValid: true, message: null };
};
