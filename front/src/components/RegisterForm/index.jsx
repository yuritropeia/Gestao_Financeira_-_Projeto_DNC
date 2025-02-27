'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState } from 'react'

export const RegisterForm = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'name') setName(value)
        if (name === 'email') setEmail(value)
        if (name === 'password') setPassword(value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('name: ', name)
        console.log('email: ', email)
        console.log('password: ', password)
        try {
            const response = await axios.post('http://localhost:8080/auth/register', { name, email, password })
            localStorage.setItem('token', response.data.data.token)
            console.log('Response', response)
            setNotification({
                open: true,
                message: `Usuário ${email} cadastrado com sucesso!!`,
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
                <S.H1>Cadastrar-se</S.H1>
                <S.TextField onChange={onChangeValue} name= "name" label="Nome" variant="outlined" color="primary" />
                <S.TextField onChange={onChangeValue} name= "email" label="E-mail" variant="outlined" color="primary"/>
                <S.TextField onChange={onChangeValue} name= "password" type="password" label="Senha" variant="outlined" color="primary" />
                <S.Button variant="contained" color="success" type="submit">Registrar</S.Button>
            </S.Form>
            <S.Snackbar open={notification.open} autoHideDuration={3000} onClose={handleClose}>
                <S.Alert onClose={handleClose} variant="filled" severity={notification.severity} sx={{width: '100%'}}>
                    {notification.message}
                </S.Alert>
            </S.Snackbar>
        </>
    )
}

export default RegisterForm
