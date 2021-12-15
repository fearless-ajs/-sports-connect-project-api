const catchAsync = require('./../../Exceptions/catchAsync');
const AppError = require('./../../Exceptions/appError');
const Controller = require('./Controller');
const Contact = require('../../Models/Contact');
const User = require('../../Models/User');
const Email = require('./../../../utils/Email');


class ContactController extends Controller{

    createContact = catchAsync(async (req, res, next) => {

        //Check if the contact exist
        if (await Contact.findOne({ email: req.body.email })){
            return next(new AppError('Email already exist', 400))
        }
        const contact = await Contact.create(req.body);
        if (!contact){
            return next(new AppError('Something you can\'t be registered this time.', 400))
        }

        const admin = await User.findOne({ email: 'uyi@penciledge.net' });

        if (!admin){
            return next(new AppError('Sorry, something went wrong!', 400))
        }
        const url = `${req.protocol}://${req.get('host')}/users/sign-up`;
        // Mail the contact concerning the newsletter
        await new Email(contact, url).sendNewContactUserMessage();
        // Mail the admin concerning the  newsletter
        await new Email(admin, url).sendNewContactAdminMessage();


        res.status(201).json({
            status: 'success',
            data: {
                contact
            }
        })
    });

    deleteContact = catchAsync(async (req, res, next) => {

        const contact = await Contact.findOne({ _id: req.params.id });
        if (!contact){
            return next(new AppError('Sorry, we couldn\'t find the contact', 404));
        }
         //Delete the post from database
         await contact.delete();

        res.status(202).json({
            status: 'success',
            message: "Contact Deleted successfully"
        })
    });

    getAllContacts = this.getAll(Contact);

    getContact = this.getOne(Contact)

}

module.exports = new ContactController;