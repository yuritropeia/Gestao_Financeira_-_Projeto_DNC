'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState } from 'react'

export const LoginForm = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);

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

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <S.Form onSubmit={ onSubmit }>
                <S.Typography variant='h1' color='primary' style={{marginBottom: '64px'}}>YOURfinance.IO</S.Typography>
                <S.TextField onChange={onChangeValue} name= "email" label="E-mail" variant="outlined" color="primary" fullWidth/>
                <S.FormControl fullWidth variant="outlined">
                                    <S.InputLabel htmlFor="outlined-adornment-password">Senha</S.InputLabel>
                                    <S.OutlinedInput 
                                        id="outlined-adornment-password"
                                        name="password"
                                        onChange={onChangeValue}
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <S.InputAdornment position="end">
                                                <S.IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >{showPassword ? <S.VisibilityOff /> : <S.Visibility />}
                                                </S.IconButton>
                                        </S.InputAdornment>
                                    }
                                        label="Password"
                                    />
                                </S.FormControl>
                <S.Button variant="contained" color="primary" type="submit" fullWidth>Enviar</S.Button>
                <S.Link href="/register">Criar  uma conta</S.Link>
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
