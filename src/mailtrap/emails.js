import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailTrapClient , sender} from "./mailtrapConfig.js"


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailTrapClient.send({
            from : sender,
            to : recipient,
            subject : "Verify Your email",
            html : VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category : "Email verification"
        })

        console.log("Email verification sent succesfully", response)
    } catch (error) {
        throw Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];

    try {
        const response = await mailTrapClient.send({
            from : sender,
            to : recipient,
            subject: "Welcome",
            html : `<h1>Welcome ${name}</h1>`,
            category: "Welcome Email"
        });

        console.log("Welcome email sent succesfully..", response);
    } catch (error) {
        console.log(error.message);
        throw Error("Error sending welcome email message");
    }

}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}];
    
    try {
        const response = await mailTrapClient.send({
            from : sender,
            to : recipient,
            subject : "Forgot Password",
            html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category : "Forgot Password"
        });

        console.log("Forgot password email sent succesfull..", response);
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong.. forgot password email not sent");   
    }

}

export const sendPasswordResetSuccessEmail = async (email) => {
    const recipient = [{email}];

    try {
        const response = mailTrapClient.send({
            from : sender,
            to : recipient,
            subject : "Password has been reset.",
            html : PASSWORD_RESET_SUCCESS_TEMPLATE,
            category : "Password Reset Sucess"
        });

        console.log("Password has been reset email was successful..", response);
    } catch (error) {
        console.log("Something went wrong with reseting password email..", error.message);
        throw new Error("Something went wrong with reseting password email..");
    }
}