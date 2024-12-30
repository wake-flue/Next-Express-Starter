const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "邮箱是必需的"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "密码是必需的"],
        minlength: [6, "密码至少需要6个字符"],
        select: false,
    },
    name: {
        type: String,
        required: [true, "用户名是必需的"],
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
});

// 创建索引
userSchema.index({ email: 1 });

// 保存前加密密码
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 验证密码方法
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// 隐藏敏感字段
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model(config.db.collections.USERS, userSchema);

module.exports = User; 