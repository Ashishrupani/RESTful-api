import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
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