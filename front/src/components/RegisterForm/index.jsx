'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation.js';

export const RegisterForm = () => {
    const router = useRouter()
    
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [showPassword, setShowPassword] = useState(false);
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
            router.push('/dashboard')
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
                <S.Typography variant='h2' style={{marginBottom: '64px'}}>Crie sua conta</S.Typography>
                <S.TextField onChange={onChangeValue} name="name" label="Nome" variant="outlined" color="primary" fullWidth />
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
                <S.Button variant="contained" color="primary" type="submit" fullWidth>Fazer cadastro</S.Button>
            <div>Já possui uma conta? <S.Link href={"/login"}>Faça login aqui</S.Link></div>
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
