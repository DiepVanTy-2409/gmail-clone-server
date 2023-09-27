import express from 'express'
import { createEmail, getEmailsReceived, getEmailSent, getEmailById } from '../controller/EmailController.js'

const router = express.Router()

router.post('/', createEmail);
router.get('/received', getEmailsReceived);
router.get('/sent', getEmailSent);
router.get('/:id', getEmailById);

export default router;