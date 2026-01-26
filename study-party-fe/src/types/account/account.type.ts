export type VerifyEmailRequest = {
    email: string;
}

export type ConfirmVerifyEmailRequest = {
    email: string;
    otp: string;
}

export type ForgotPasswordRequest = {
    email: string;
}

export type ResetPasswordRequest = {
    email: string;
    otp: string;
    newPassword: string;
}

export type ChangePasswordRequest = {
    oldPassword: string;
    newPassword: string;
}