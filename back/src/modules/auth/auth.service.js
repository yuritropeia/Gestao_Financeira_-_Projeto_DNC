import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { save, getByEmail } from '../user/index.js';
;//const User = require('../../models/user.model'); // Adjust the path as necessary


export const register = async (params) => {

    // Check if user already exists
    const user = await getByEmail(params.email);
    if (user) {
        throw new Error('This e-mail already exists');
    }

    // Create new user
    const userCreated = await save(params)

    // Generate JWT token
    const token = jwt.sign({ id: userCreated[0] }, process.env.JWT_SECRET);

    return { token };
    }

export const login = async (params) => {
    // Verify if user exists
    const user = await getByEmail(params.email);
    if (!user) {
        throw new Error('Invalid e-mail or password');
    }

    // Compare password
    const passwordCorrect = await bcrypt.compareSync(params.password, user.password);
    if (!passwordCorrect) {
        throw new Error('Invalid e-mail or password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return { token };
}

