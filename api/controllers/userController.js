var User = require('../models/userModel');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSignUp = (req, res) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                status: 409,
                message: 'Email exists'
            });
        } else {
            bcrypt.genSalt(parseInt(process.env.JWT_KEY), (err, salt) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User(
                            {
                                firstName: req.body.firstName,
                                secondName: req.body.secondName,
                                email : req.body.email,
                                role: req.body.role,
                                password : hash
                            });
                        user.save()
                        .then(result => {
                            const token = jwt.sign({
                                firstName: user.firstName,
                                secondName: user.secondName,
                                email: user.email,
                                userId: user._id,
                            }, process.env.JWT_KEY,
                            {
                                expiresIn: '1h'
                            }
                            );
                            res.status(201).json({
                                message: 'User created',
                                id: user._id,
                                role: user.role,
                                token: token,
                                status: 200
                            });
                        })
                        .catch(err => {
                            return res.status(500).json({
                                error: err
                            });
                        });
                    }
                });
            });
        }
    })
    .catch(err => {
        return res.status(500).json({
            error: err
        });
    })
};

const userLogIn = (req, res) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        bcrypt.compare(req.body.password, user.password)
        .then((resp)=> {
            const token = jwt.sign({
                firstName: user.firstName,
                secondName: user.secondName,
                email: user.email,
                userId: user._id,
            }, process.env.JWT_KEY,
            {
                expiresIn: '1h'
            }
            );

            if (resp) {
                return res.status(200).json({
                    status: 200,
                    messsage: 'Auth succ',
                    id: user._id,
                    role: user.role,
                    token: token
                });
            } else {
                return res.status(401).json({
                    status: 401,
                    message: 'Auth failed'
                });
            }
        })
        .catch(err => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: 'Auth failed'
                });
            }
        })
    })
    .catch(err => {
        return res.status(500).json({
            status: 500,
            error: err
        })
    });
};

const userDelete = (req, res) => {
    User.deleteOne({_id : req.params.userId}).exec()
    .then(result => {
            return res.status(200).json({res : result, id: req.params.userId});
        }
    )
    .catch(err => {
        return res.status(500).json({
            error: err
        });
    });
};

const deleteMultipleUsers = (req, res) => {
    User.deleteMany({_id : {$in: req.body}}).exec()
    .then(result => {
        console.log(result);
            return res.status(200).json({res : result, ids: req.body});
        }
    )
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    });
};

const users = (req, res) => {
    User.find().exec()
    .then(docs => {
        const response = {
            count: docs.length,
            allUsers: docs.map(doc => {
                return {
                    id : doc._id,
                    firstName: doc.firstName,
                    secondName: doc.secondName,
                    email: doc.email,
                    role: doc.role,
                    url: {
                        edit : "/users/"+doc._id+"/edit",
                        view: "/users/"+doc._id,
                        delete: "/users/"+doc._id+"/delete"
                    }
                }
            })
        }
        res.status(200).json(response);
        }
    )
    .catch(err => {
        res.status(500).json({
            status: 500,
            error: err
        });
    });
}

const getUser = (req, res) => {
    User.find({"_id": req.params.userId}).exec()
    .then(doc => {
        doc=doc[0];
        const response = {
            id: doc._id,
            firstName: doc.firstName,
            secondName: doc.secondName,
            email: doc.email,
            role: doc.role
        }
        res.status(200).json(response);
        }
    )
    .catch(err => {
        res.status(500).json({
            status: 500,
            error: err
        });
    });
}

const userUpdate = (req,res) => {
    if (typeof(req.body.password) !== "undefined") {
        bcrypt.genSalt(parseInt(process.env.JWT_KEY), (err, salt) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    req.body.password = hash;
                    User.update({"_id": req.params.userId}, {$set: req.body}).exec()
                    .then(user => {
                        return res.status(200).json({
                            status: 200,
                            messsage: 'User Updated',
                            user: user
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            status: 500,
                            error: err
                        });
                    });
                }
            });
        });
    }
    User.update({"_id": req.params.userId}, {$set: req.body}).exec()
    .then(user => {
        return res.status(200).json({
            status: 200,
            messsage: 'User Updated',
            user: user
        });
    })
    .catch(err => {
        res.status(500).json({
            status: 500,
            error: err
        });
    });
}

module.exports = {
    userSignUp: userSignUp,
    userLogIn: userLogIn,
    userDelete: userDelete,
    users: users,
    getUser: getUser,
    userUpdate: userUpdate,
    deleteMultipleUsers: deleteMultipleUsers
}