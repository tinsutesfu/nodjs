import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        
        unique: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    cartdata: {
        type: Object,
        default: {}
    },
    profilePicture: {
        type: String,
        default: '/images/profile.png' // default image in the public folder
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}
,{minimize:false}
);

export default mongoose.model('User', userSchema);
