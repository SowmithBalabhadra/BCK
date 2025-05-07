import User from '../models/UserRent.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gskkarthikeya@gmail.com',
        pass: 'umom lgwo dlup lhkk',
    },
});

class AuthController {
   
    async sendOtp(req, res) {
        const { userName, password, typeOfCustomer } = req.body;
    
        try {
            const user = await User.findOne({ userName, typeOfCustomer });
    
            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid credentials or type of customer' });
            }
    
            // Compare hashed passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
    
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, message: 'Invalid credentials' });
            }
    
            
            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
    
            
            user.otp = otp;
            user.otpExpiresAt = otpExpiresAt;
            await user.save();
    
            
            const mailOptions = {
                from: 'gskkarthikeya@gmail.com',
                to: user.email,
                subject: 'Your Login OTP',
                text: `Dear ${user.userName},\n\nYour OTP for login is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nBest regards,\nYour Company Team`,
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending OTP:', error);
                    return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
                }
                console.log('OTP sent:', info.response);
                return res.status(200).json({ success: true, message: 'OTP sent successfully' });
            });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
        }
    }
    

    
    async login(req, res) {
        const { userName, otp } = req.body;
    
        try {
            
            const user = await User.findOne({ userName, otp });
    
            
            if (user) {
                if (!user.isActive) {
                    return res.status(403).json({
                        success: false,
                        message: 'Account is inactive. Please verify your email to activate your account.',
                    });
                }
    
                if (user.otpExpiresAt > new Date()) {
                    
                    const token = jwt.sign(
                        { userId: user._id, userName: user.userName, typeOfCustomer: user.typeOfCustomer },
                        'hello', 
                        { expiresIn: '1h' }
                    );
    
                    
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
                        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                    });
    
                    
                    user.otp = null;
                    user.otpExpiresAt = null;
                    await user.save();
    
                    return res.status(200).json({
                        success: true,
                        message: 'Login successful',
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid or expired OTP',
                    });
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'User not found or invalid OTP',
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred. Please try again.',
            });
        }
    }

    
    async showregister(req, res) {
        res.render('auth/register');
    }

    async register(req, res) {
        const { userName, password, email, typeOfCustomer } = req.body;

        try {
            
            const existingUser = await User.findOne({
                $or: [{ userName }, { email }],
            });

            if (existingUser) {
                const errorMsg = existingUser.userName === userName
                    ? 'User with the same username already exists'
                    : 'User with the same email already exists';
                return res.status(400).json({ message: errorMsg });
            }

            
            const hashedPassword = await bcrypt.hash(password, 10);

            
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

            
            const newUser = new User({
                userName,
                password: hashedPassword,
                email,
                typeOfCustomer,
                verificationToken,
                tokenExpiresAt,
                isActive: false,
            });

            await newUser.save();

            
            const verificationLink = `http://localhost:3000/auth/verify/${verificationToken}`;
            const mailOptions = {
                from: 'your_email@gmail.com',
                to: email,
                subject: 'Verify Your Email',
                text: `Dear ${userName},\n\nPlease verify your email by clicking the link below:\n\n${verificationLink}\n\nThis link is valid for 24 hours.\n\nBest regards,\nYour Company Team`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending verification email:', error);
                    return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
                }
                console.log('Verification email sent:', info.response);
                res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
            });

        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ message: 'An error occurred during registration. Please try again.' });
        }
    }

    
    async verifyEmail(req, res) {
        const { token } = req.params;

        try {
            const user = await User.findOne({
                verificationToken: token,
                tokenExpiresAt: { $gt: new Date() },
            });

            if (!user) {
                return res.status(400).send({
                    message: 'Invalid or expired token.',
                });
            }

            
            user.isActive = true;
            user.verificationToken = null;
            user.tokenExpiresAt = null;
            await user.save();

            res.status(200).send({
                message: 'Email verified successfully! You can now log in.',
            });
        } catch (error) {
            console.error('Error verifying email:', error);
            res.status(500).send({
                message: 'An error occurred during verification. Please try again.',
            });
        }
    }

    
    async logout(req, res) {
        try {
            res.clearCookie('token', { httpOnly: true, secure: true }); 
            res.status(200).json({ message: 'Logout successful' }); 
        } catch (error) {
            console.error("Error during logout:", error);
            res.status(500).json({ message: 'Logout failed', error });
        }
    }
}

export default new AuthController();
