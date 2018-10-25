const Roles = require('../models/rolesModel');

const getAllRoles = (req, res) => {
    Roles.find().select('name _id').exec()
    .then(docs => {
        const response = {
            roles: docs.map(doc => {
                return {
                    id : doc._id,
                    name: doc.name,
                }
            })
        }
            res.json(response);
        }
    )
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

const addRole = (req, res) => {
    const role = new Roles(req.body);
    role
    .save()
    .then(result => {
            res.json({
                message:'Role created successfuly',
                role: {
                    id : result._id,
                    name : result.name,
                }
            });
        }
    )
    .catch(err => {
            res.status(500).json({
                error: err
            });
        }
    );
}
module.exports = {
    getAllRoles : getAllRoles,
    addRole : addRole
    }