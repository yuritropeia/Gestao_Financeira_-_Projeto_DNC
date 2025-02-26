import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import userRouter from './modules/user/user.route.js'
import authRouter from './modules/auth/auth.route.js'

const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.get('/health', (_, res) => {
    return res.send('Sistema está operacional!');
})

app.listen(8080, async () => {
    console.log('Servidor rodando na porta 8080.')
}); 