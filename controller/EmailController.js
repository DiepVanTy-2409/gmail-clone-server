import { EmailModel } from "../model/EmailModel.js"
import { createError } from './../error.js';

export const createEmail = async (req, res, next) => {
    try {
        const { firstName, lastName, fromEmail, toEmail, subject, body, profilePicture } = req.body
        const newEmail = new EmailModel({
            firstName, lastName, fromEmail, profilePicture, toEmail, subject, body,
        })
        await newEmail.save()
        res.status(200).json(newEmail)
    } catch (error) {
        next(error)
    }
}

export const getEmailsReceived = async (req, res, next) => {
    try {
        const emails = await EmailModel.find({ toEmail: req.email }, {
            firstName: 0, lastName: 0, body: 0, toEmail: 0, updatedAt: 0, __v: 0
        })
        res.status(200).json(emails.sort((a, b) => {
            return b.createdAt - a.createdAt
        }))
    } catch (error) {
        next(error)
    }
}

export const getEmailSent = async (req, res, next) => {
    try {
        const emails = await EmailModel.find({ fromEmail: req.email })
        res.status(200).json(emails.sort((a, b) => {
            return b.createdAt - a.createdAt
        }))
    } catch (error) {
        next(error)
    }
}


export const getEmailById = async (req, res, next) => {
    try {
        // const email = await EmailModel.findByIdAndUpdate(req.params.id, { hasViewed: true }, { new: true })
        const email = await EmailModel.findById(req.params.id)
        if (!email) {
            return next(createError(404, "Email not found"))
        }
        if (email.fromEmail === req.email || email.toEmail === req.email) {
            if (email.toEmail === req.email) {
                await email.updateOne({ $set: { hasViewed: true } })
            }
            console.log(email)
            return res.status(200).json(email)
        }
        return next(createError(403, 'Not authorized'))
    } catch (error) {
        next(error)
    }
}
