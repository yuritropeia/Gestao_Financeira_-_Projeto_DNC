import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { save, getByEmail } from '../user/index.js';
;//const User = require('../../models/user.model'); // Adjust the path as necessary


export const register = async (params) => {

    // Check if user already exists
    const user = await getByEmail(params.email);
    if (user) {
        return { error: 'Uma conta com o e-mail inserido já existe.' };
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
        return { error: 'E-mail ou senha inválidos.' };
    }

    // Compare password
    const passwordCorrect = await bcrypt.compareSync(params.password, user.password);
    if (!passwordCorrect) {
        return { error: 'E-mail ou senha inválidos.' }
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return { token };
}

