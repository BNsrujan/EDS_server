'use strict';
const UserModel = require('../models/usermodel');
exports.storeOsName = async (req, res) => {
    const { user } = req.body; // Expecting user details (from Auth0)
    console.log(req.body)

    // Validate if the user sub is provided
    if (!user || !user.sub) {
        return res.status(400).json({ error: 'User information (sub) is required' });
    }

    try {
        // Check if the user already exists, if not, save the user
        let existingUser = await UserModel.findOne({ sub: user.sub });
        if (!existingUser) {
            const newUser = new UserModel({
                sub: user.sub,
                // Store additional user info if needed
                // name: user.name,
                // email: user.email,
                // picture: user.picture,
            });
            existingUser = await newUser.save();
            console.log(`User with sub ${user.sub} saved successfully`);
        } else {
            console.log('User already exists');
        }

        // Return user details after successful login
        return res.json({ message: 'Login successful', user: existingUser });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'An error occurred during login' });
    }
};
