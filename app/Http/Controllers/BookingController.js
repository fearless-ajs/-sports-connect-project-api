const catchAsync = require('./../../Exceptions/catchAsync');
const AppError = require('./../../Exceptions/appError');
const Controller = require('./Controller');
const Booking = require('../../Models/Booking');
const User = require('../../Models/User');


class BookingController extends Controller{

    createBooking = catchAsync(async (req, res, next) => {
        // Check if receiver Id exists
        if (!req.params.receiverId){
            return next(new AppError('We need the receiver ID', 400))
        }
       // Add user and media details to the request body
        req.body.user = req.user._id;
        req.body.receiver = req.params.receiverId;

        // Check if sender and receiver equals
        if (req.user._id.toString() === req.body.receiver.toString()){
            return next(new AppError('You are not allowed to book yourself', 400))
        }

        // Check if the receiver exists
        const user = await User.findById(req.body.user);
        if (!user)
        {
            return next(new AppError('Talent not found', 404))
        }

        // Check if there is an existing booking
        const existingBooking = await Booking.findOne({ user: req.body.user, receiver: req.body.receiver });
        if (existingBooking){
            return next(new AppError('There is an existing booking between the user and the receiver', 400))
        }

        // Delete Unwanted fields
        delete req.body.createdAt;

        const booking = await Booking.create(req.body);
        if (!booking){
            return next(new AppError('Something you can\'t wave at the moment', 400))
        }

        res.status(201).json({
            status: 'success',
            data: {
                booking
            }
        })

    });

    deleteBooking = catchAsync(async (req, res, next) => {

        const booking = await Booking.findOne({ _id: req.params.id });
        if (!booking){
            return next(new AppError('Sorry, we couldn\'t find the booking', 404));
        }

        //2.Verify if the current User Owns the account
        if (booking.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to delete this post', 403));
        }

         //Delete the booking from database
         await booking.delete();

        res.status(202).json({
            status: 'success',
            message: "Post Deleted successfully"
        })
    });

    getMyBooking = catchAsync(async (req, res, next) => {

        const bookings = await Booking.find({ user: req.user._id });
        if (!bookings){
            return next(new AppError('Sorry, we couldn\'t find any post for you', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                bookings
            }
        })
    });

    getAllBookings = this.getAll(Booking);

}

module.exports = new BookingController();