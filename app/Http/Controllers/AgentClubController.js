const catchAsync = require('./../../Exceptions/catchAsync');
const AppError = require('./../../Exceptions/appError');
const AgentClub = require('./../../Models/AgentClub');
const Controller = require('./Controller');

class AgentController extends Controller{

    addClub = catchAsync(async (req, res, next) => {
        delete req.body.createdAt;
        delete req.body.updatedAt;
        req.body.user = req.user._id;
        // Save the user information in the database
        const newAgentClub = await AgentClub.create(req.body);

        //Sign the user in with Jwt token and send response
        return res.status(201).json({
            status: 'success',
            data: {
                club: newAgentClub,
            },
            roles: 'agent',
        });
    });

    getAllMyClubs = catchAsync(async (req, res, next) => {

        //1.Verify if the account exists
        const account = await AgentClub.find({ user: req.user._id });

        res.status(202).json({
            status: 'success',
            data: {
                account
            }
        });

    });

    updateMyAgentClub = catchAsync(async (req, res, next) => {
        //1.Verify if the account exists
        delete req.body.createdAt;
        delete req.body.updatedAt;
        delete  req.body.user;

        const account = await AgentClub.findOne({ user: req.user._id, _id: req.params.clubId });
        if (!account){
            return next(new AppError('Sorry, we couldn\'t find your player account', 404));
        }

        //2.Verify if the current User Owns the account
        if (account.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to perform this update', 403));
        }
        //3. Perform the Account update
        delete req.body.user;
        delete req.body.active;
        delete req.body.updatedAt;
        const updatedAccount = await AgentClub.findByIdAndUpdate(account._id, req.body, {
            new: true, //To return the updated version of the document
            runValidators: true, // To validate inputs based on the Business schema
            useFindAndModify: false
        });

        res.status(202).json({
            status: 'success',
            data: {
                ...updatedAccount._doc
            }
        });

    });

    deleteMyAgentClub = catchAsync(async (req, res, next) => {
        const account = await AgentClub.findOne({ user: req.user._id, _id: req.params.clubId });
        if (!account){
            return next(new AppError('Sorry, we couldn\'t find your player account', 404));
        }

        //2.Verify if the current User Owns the account
        if (account.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to perform this update', 403));
        }

        //3. Perform the Delete
        await account.delete();

        res.status(202).json({
            status: 'success',
            message: 'Club delete successfully'
        });

    });
}

module.exports = new AgentController;