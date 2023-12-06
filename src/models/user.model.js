import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 4,
        maxlength: 50,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 60,
        required: true,
        trim: true
    },
    fullName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email!`
        },
        lowercase: true
    },
    role: {
        type: String,
        enum: ["admin", "writer", "guest"]
    },
    age: {
        type: Number,
        min: 1,
        max: 99
    },
    numberOfArticles: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
}, {
    versionKey: false
});

userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

userSchema.pre("validate", function (next) {
    if (this.age < 0) {
        this.age = 1;
    }
    next();
});

userSchema.pre("save", function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`;
    next();
});

userSchema.pre("updateOne", function (next) {
    let firstName = this.get("firstName");
    let lastName = this.get("lastName");
    this.set("fullName", `${firstName} ${lastName}`);
    next();
});

userSchema.pre("updateOne", function (next) {
    this.set("updatedAt", Date.now());
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
