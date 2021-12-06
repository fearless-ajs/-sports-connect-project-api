const crypto = require('crypto');
const { promisify } = require('util');
const jwt  = require('jsonwebtoken');
const catchAsync = require('./../../Exceptions/catchAsync');
const AppError = require('./../../Exceptions/appError');
const AuthServiceProvider = require('./../../Providers/AuthServiceProvider');
const roleGuard = require('./RBAC/RoleUserController');
const permissionGuard = require('./RBAC/PermissionUserController');
const RoleUser = require('./../../Models/RBAC/RoleUser');
const Role = require('./../../Models/RBAC/Role');
const PermissionUser = require('./../../Models/RBAC/PermissionUser');
const User = require('./../../Models/User');
const Player = require('./../../Models/Player');
const Agent = require('./../../Models/Agent');
const Email = require('./../../../utils/Email');
const Controller = require('./Controller');

class PlayerController extends Controller{

    signUp = catchAsync(async (req, res, next) => {
        req.body.user = req.user._id;
        // CHeck if user has a player account already
        if (await Player.findOne({ user: req.user._id })){
            return next(new AppError('You already have a player profile', 400))
        }

        // Check if the user has an Agent Account
        if (await Agent.findOne({ user: req.user.id })){
            return next(new AppError('You already have an agent/coach profile', 400))
        }

        // Save the user information in the database
        const newPlayer = await Player.create(req.body);

        //Attach player Role to the user
        const role = roleGuard.attachRole(req.user._id, 'player');

        //Return Error if role not found
        if(!role){
            //Remove the created User data
            await Player.findByIdAndDelete(newPlayer._id);
            return next(new AppError(`No role found with that name`, 404))
        }

        // Remove the new-user role attached at the point of verification
        const removeRole = await roleGuard.detachRole(req.user._id, 'new-user');
        if (!removeRole){
            //Remove assigned agent role
            await roleGuard.detachRole(req.user._id, 'player');
            // Remove created Agent profile
            await Agent.findByIdAndDelete(newPlayer._id);
            // Return Error to the user
            return next(new AppError(`Unable to detach new-user role`, 404))
        }

        // Mail the user concerning the player account creation
        const url = `${req.protocol}://${req.get('host')}`;
        await new Email(req.user, url).sendPlayerAccountCreationMessage();

        //Sign the user in with Jwt token and send response
        return res.status(201).json({
            status: 'success',
            data: {
                player: newPlayer,
            },
            roles: 'player',
        });
    });

    getMyPlayerProfile = catchAsync(async (req, res, next) => {
        //1.Verify if the account exists
        const account = await Player.findOne({ user: req.user._id });
        if (!account){
            return next(new AppError('Sorry, we couldn\'t find your player account', 404));
        }

        //2.Verify if the current User Owns the account
        if (account.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to perform this update', 404));
        }

        res.status(202).json({
            status: 'success',
            data: {
                ...account._doc
            }
        });

    });

    updateMyPlayerProfile = catchAsync(async (req, res, next) => {
        //1.Verify if the account exists
        const account = await Player.findOne({ user: req.user._id });
        if (!account){
            return next(new AppError('Sorry, we couldn\'t find your player account', 404));
        }

        //2.Verify if the current User Owns the account
        if (account.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to perform this update', 404));
        }

        //3. Perform the Account update
        delete req.body.user;
        delete req.body.active;
        delete req.body.updatedAt;
        const updatedAccount = await Player.findByIdAndUpdate(account._id, req.body, {
            new: true, //To return the updated version of the document
            runValidators: true // To validate inputs based on the Business schema
        });

        res.status(202).json({
            status: 'success',
            data: {
                ...updatedAccount._doc
            }
        });

    });

    deleteMyPlayerProfile = catchAsync(async (req, res, next) => {
        //1.Verify if the account exists
        const account = await Player.findOne({ user: req.user._id });
        if (!account){
            return next(new AppError('Sorry, we couldn\'t find your player account', 404));
        }

        //2.Verify if the current User Owns the account
        if (account.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to perform this update', 404));
        }

        //3. Perform the Delete

        res.status(202).json({
            status: 'success',
            message: 'This functionality has not been implemented, check back later!'
        });

    });

    getPlayerProfile = catchAsync(async (req, res, next) => {
        console.log(req.params.userId);
    });



    updatePlayerProfile = catchAsync(async (req, res, next) => {
        //1.Verify if the account exists
        const account = await Player.findOne({ user: req.user_.id });
        if (!account){
            return next(new AppError('No player found with that id', 404));
        }

        //2.Verify if the current User Owns the account
        if (account.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to perform this update', 404));
        }


    });

    deletePlayerProfile = catchAsync(async (req, res, next) => {
        console.log(req.params.userId);

        //Just disable the promary profile
    });

}

module.exports = new PlayerController;