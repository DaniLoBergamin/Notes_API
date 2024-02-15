// Mongoose - connection to mongodb.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
        name: String,
        email: { type: String, required: true, unique: true },  // unique = Mongoose validation so that there are no 2 identical emails registered. 
        password: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    });

    

            // const document = this;
// Bcrypt - Hash password
    userSchema.pre('save', function (next) {
        if (this.isNew || this.isModified('password')) {                                                              
            bcrypt.hash(this.password, 10,      // 10 = Number of random characters inserted into the hash. 
                (err, hashedPassword) => {              
                if (err)
                next(err);
            else{
                this.password = hashedPassword;        
                next();
                }
            }
        )
    }
});



// Login
    userSchema.methods.isCorrectPassword = function (password, callback) {
        console.log('User ', password);
        console.log('Password ', this.password);
        bcrypt.compare(password, this.password, function (err, same) {
            if (err)
                callback(err);
            else 
                callback(err, same);          
        })
    }

    module.exports = mongoose.model('User', userSchema);