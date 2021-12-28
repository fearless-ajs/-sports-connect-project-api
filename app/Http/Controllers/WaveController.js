const catchAsync = require('./../../Exceptions/catchAsync');
const AppError = require('./../../Exceptions/appError');
const Controller = require('./Controller');
const Wave = require('../../Models/Wave');


class WaveController extends Controller{


    createWave = catchAsync(async (req, res, next) => {
        // Check if receiver Id exists
        if (!req.params.receiverId){
            return next(new AppError('We need the receiver ID', 400))
        }
       // Add user and media details to the request body
        req.body.user = req.user._id;
        req.body.receiver = req.params.receiverId;

        // Check if sender and receiver equals
        if (req.user._id.toString() === req.body.receiver.toString()){
            return next(new AppError('You are not allowed to wave at yourself', 400))
        }

        // Delete Unwanted fields
        delete req.body.createdAt;

        const wave = await Wave.create(req.body);
        if (!wave){
            return next(new AppError('Something you can\'t wave at the moment', 400))
        }

        res.status(201).json({
            status: 'success',
            data: {
                wave
            }
        })
    });

    deleteWave = catchAsync(async (req, res, next) => {

        const post = await Post.findOne({ _id: req.params.id });
        if (!post){
            return next(new AppError('Sorry, we couldn\'t find the post', 404));
        }

        //2.Verify if the current User Owns the account
        if (post.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to delete this post', 403));
        }

        // Delete any media attached with the post
         if (post.media){ await this.removePostMedia(post.media); }

         //Delete the post from database
         await post.delete();

        res.status(202).json({
            status: 'success',
            message: "Post Deleted successfully"
        })
    });

    getMyWaves = catchAsync(async (req, res, next) => {

        const posts = await Wave.find({ user: req.user._id });
        if (!posts){
            return next(new AppError('Sorry, we couldn\'t find any post for you', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                posts
            }
        })
    });

    getWave = catchAsync(async (req, res, next) => {
        //1. Fetch the wave
        const wave = await Wave.findById(req.params.id);
        if (!wave){
            return next(new AppError('Sorry, we couldn\'t find this wave', 404));
        }

        if (wave.receiver._id.toString() !== req.user._id.toString() && wave.user._id.toString() !== req.user._id.toString()) {
            return next(new AppError('Unauthorized Access to wave', 401));
        }

        //2. If you are the receiver then update seen to true
        if (wave.receiver._id.toString() === req.user._id.toString()){
            const updatedWave = await Wave.findByIdAndUpdate(req.params.id, {
                seen: true
            }, {
                new: true, //To return the updated version of the document
                runValidators: true, // To validate inputs based on the Business schema
                useFindAndModify: false
            });
           return  res.status(200).json({
                status: 'success',
                data: {
                    wave: updatedWave
                }
            })
        }else {
            return  res.status(200).json({
                status: 'success',
                data: {
                    wave
                }
            })
        }


    });

    getReceivedWaves = catchAsync(async (req, res, next) => {
        //1. Fetch the wave
        const waves = await Wave.find({ receiver: req.user._id });
        if (!waves){
            return next(new AppError('Sorry, we couldn\'t find this wave', 404));
        }

        return  res.status(200).json({
            status: 'success',
            data: {
                waves
            }
        })



    });

    getUnseenReceivedWaves = catchAsync(async (req, res, next) => {
        //1. Fetch the wave
        const waves = await Wave.find({ receiver: req.user._id, seen: false });
        if (!waves){
            return next(new AppError('Sorry, we couldn\'t find this wave', 404));
        }

        return  res.status(200).json({
            status: 'success',
            data: {
                waves
            }
        })



    });

    getSeenReceivedWaves = catchAsync(async (req, res, next) => {
        //1. Fetch the wave
        const waves = await Wave.find({ receiver: req.user._id, seen: true });
        if (!waves){
            return next(new AppError('Sorry, we couldn\'t find this wave', 404));
        }

        return  res.status(200).json({
            status: 'success',
            data: {
                waves
            }
        })



    });

    getSentWaves = catchAsync(async (req, res, next) => {
        //1. Fetch the wave
        const waves = await Wave.find({ user: req.user._id });
        if (!waves){
            return next(new AppError('Sorry, we couldn\'t find this wave', 404));
        }

        return  res.status(200).json({
            status: 'success',
            data: {
                waves
            }
        })



    });

    getUnseenSentWaves = catchAsync(async (req, res, next) => {
        //1. Fetch the wave
        const waves = await Wave.find({ user: req.user._id, seen: false });
        if (!waves){
            return next(new AppError('Sorry, we couldn\'t find this wave', 404));
        }

        return  res.status(200).json({
            status: 'success',
            data: {
                waves
            }
        })

    });

    getSeenSentWaves = catchAsync(async (req, res, next) => {
        //1. Fetch the wave
        const waves = await Wave.find({ user: req.user._id, seen: true });
        if (!waves){
            return next(new AppError('Sorry, we couldn\'t find this wave', 404));
        }

        return  res.status(200).json({
            status: 'success',
            data: {
                waves
            }
        })



    });

}

module.exports = new WaveController();