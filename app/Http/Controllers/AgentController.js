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

class AgentController extends Controller{

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
        const newAgent = await Agent.create(req.body);

        //Attach player Role to the user
        const role = roleGuard.attachRole(req.user._id, 'agent');

        //Return Error if role not found
        if(!role){
            //Remove the created User data
            await Agent.findByIdAndDelete(newAgent._id);
            return next(new AppError(`No role found with that name`, 404))
        }

        // Remove the new-user role attached at the point of verification
        const removeRole = await roleGuard.detachRole(req.user._id, 'new-user');
        if (!removeRole){
            //Remove assigned agent role
            await roleGuard.detachRole(req.user._id, 'agent');
            // Remove created Agent profile
            await Agent.findByIdAndDelete(newAgent._id);
            // Return Error to the user
            return next(new AppError(`Unable to detach new-user role`, 404))
        }

        // Mail the user concerning the player account creation
        const url = `${req.protocol}://${req.get('host')}`;
        await new Email(req.user, url).sendAgentAccountCreationMessage();

        //Sign the user in with Jwt token and send response
        return res.status(201).json({
            status: 'success',
            data: {
                agent: newAgent,
            },
            roles: 'agent',
        });
    });

}

module.exports = new AgentController;