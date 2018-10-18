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
    console.log(req);
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
    User.remove({_id : req.params.userId}).exec()
    .then(result => {
            return res.status(200).json({res : result});
        }
    )
    .catch(err => {
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
                    _id : doc._id,
                    firstName: doc.firstName,
                    secondName: doc.secondName,
                    email: doc.email,
                    url: {
                        edit : "/users/"+doc._id+"/edit",
                        view: "/users/"+doc._id
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
    console.log(req.params.userId);
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
    userUpdate: userUpdate
}