'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState } from 'react'

export const CategoriasCreate = () => {
    const [name, setName] = useState();

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'name') setName(value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('name: ', name)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:8080/categorias', { name }, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            })
            console.log('Response', response) 
            setNotification({
                open: true,
                message: `Categoria ${name} criada com sucesso!`,
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
                <S.H1>Criar categoria</S.H1>
                <S.TextField onChange={onChangeValue} name= "name" label="Name" variant="outlined" color="primary" fullWidth/>
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

export default CategoriasCreate
