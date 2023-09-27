import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    fromEmail: {
        type: String,
    },
    profilePicture: {
        type: String
    },
    toEmail: {
        type: String,
    },
    subject: {
        type: String,
    },
    body: {
        type: String,
    },
    hasViewed: {
        type: Boolean, default: false
    },
}, {
    timestamps: true
})

export const EmailModel = mongoose.model('Emails', EmailSchema)