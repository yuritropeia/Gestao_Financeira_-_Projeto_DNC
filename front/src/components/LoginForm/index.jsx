'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState } from 'react'

export const LoginForm = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'email') setEmail(value)
        if (name === 'password') setPassword(value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('email: ', email)
        console.log('password: ', password)
        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email, password })
            localStorage.setItem('token', response.data.data.token)
            console.log('Response', response) 
            setNotification({
                open: true,
                message: `Usuário ${email} autenticado com sucesso!`,
                severity: 'success'
            })
        } catch (error) {
            setNotification({
                open: true,
                message: error.response.data.error,
                severity: 'error'
            })
        }
    };

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification({
        open: false,
        message: '',
        severity: ''
    })
    }

    return (
        <>
            <S.Form onSubmit={ onSubmit }>
                <S.H1>Login</S.H1>
                <S.TextField onChange={onChangeValue} name= "email" label="E-mail" variant="outlined" color="primary" fullWidth/>
                <S.TextField onChange={onChangeValue} name= "password" type="password" label="Password" variant="outlined" color="primary" fullWidth/>
                <S.Button variant="contained" color="success" type="submit">Enviar</S.Button>
            </S.Form>

            <S.Snackbar open={notification.open} autoHideDuration={3000} onClose={handleClose}>
                <S.Alert onClose={handleClose} variant="filled" severity={notification.severity} sx={{width: '100%'}}>
                    {notification.message}
                </S.Alert>
            </S.Snackbar>
        </>
    )
}

export default LoginForm
