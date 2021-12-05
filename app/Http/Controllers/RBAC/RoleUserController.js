const Controller = require('./../Controller');
const catchAsync = require('./../../../Exceptions/catchAsync');
const RoleUser = require('../../../Models/RBAC/RoleUser');
const Role = require('../../../Models/RBAC/Role');


class RoleUserController extends Controller{
    constructor() {
        super();
    }

    //
    attachRole = async (user, role) => {
        //Check if role name exist
        let doc = await Role.findOne({ name: role });
        if (!doc){
            console.log(role);
            return false
        }

        //Add the user with the role to the record
        return await RoleUser.create({
            user,
            role: doc._id
        });
    };

    attachRoleWithName = async (user, roleName) => {
        //Check if role name exist
        let role = await Role.findOne({name: roleName});
        if (!role){
            return false
        }
        console.log(role._id);

        //Add the user with the role to the record
        await RoleUser.create({
            user: user,
            role: role._id
        });
        return role.name;
    };

    detachRole = async (user, role) => {
        //Check if role name exist
        let doc = await Role.findOne({ name: role });
        if (!doc){
            console.log(role);
            return false
        }

        //Detach the role from the user
       const roleUser = await RoleUser.findOneAndDelete({  user: user, role: doc._id })
       if (roleUser){
           return true;
       }else {
           return false;
       }
    }
}
module.exports = new RoleUserController;