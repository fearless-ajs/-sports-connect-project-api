const jwt  = require('jsonwebtoken');
const RoleUser = require('./../Models/RBAC/RoleUser');
const Role = require('./../Models/RBAC/Role');
const Permission = require('./../Models/RBAC/Permission');
const PermissionUser = require('./../Models/RBAC/PermissionUser');
const AppError = require('./../Exceptions/appError');

class AuthServiceProvider {
    constructor() {
        this.role = undefined;
        this.permission = undefined;
    }

    createAuthToken =  async (user, role=undefined, statusCode, res) => {
        const token = this.signToken(user._id);

        //Sets the cookie also
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        }
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', token, cookieOptions);

        //Remove password from the output
        user.password = undefined;

        if (role !== undefined){
            //Fetch user Roles also
            this.role =  await Role.findOne({name: role}).select(['displayName', 'name']);
        }else {
            this.role = await RoleUser.find({user: user._id}).select(['-_id', 'role'])
        }

        await res.status(statusCode).json({
            status: 'success',
            token,
            data: {
                user
            },
            roles: this.role,
        });
    };

    createNewUserToken =  async (user, role=undefined, res) => {
        const token = this.signToken(user._id);

        //Sets the cookie also
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        }
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', token, cookieOptions);

        //Remove password from the output
        user.password = undefined;


        await res.status(201).json({
            status: 'success',
            token,
            data: {
                user
            },
            roles: role,
        });
    };


    restrictTo = (...roles) => {
        return (req, res, next) => {
            // roles ['admin', 'lead-guide']. role='user'
            if (!roles.includes(req.user.role)){
                return next(
                    new AppError('You do not have the permission to perform this action', 403)
                );
            }

            next();
        };
    };

    signToken = id => {
        return jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
    };

    userRoles = async (userId) => {
        return RoleUser.find({ user: userId }).populate({
            path: 'role',
            field: 'name'
        });
    }

    userPermissions = async (userId) => {
        return PermissionUser.find({user: userId}).populate({
            path: 'permission',
            select: 'name'
        });
    }

}
module.exports = AuthServiceProvider;