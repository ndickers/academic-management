import * as yup from "yup";
export const registerSchema = yup.object({
    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),
    role: yup.string().required("Role is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[^a-zA-Z0-9]/, "Must contain at least one special character")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export const loginSchema = yup.object({
    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),
    password: yup
        .string()
        .required("Password is required"),

});