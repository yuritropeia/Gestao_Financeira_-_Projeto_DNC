'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState } from 'react'

export const MetasCreate = () => {
    const [description, setDescription] = useState();
    const [value, setValue] = useState();
    const [dateMeta, setDateMeta] = useState();

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'description') setDescription(value)
        if (name === 'value') setValue(value)
        if (name === 'dateMeta') setDateMeta(value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('name: ', description)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:8080/metas', { description, value, date: dateMeta }, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            })
            console.log('Response', response) 
            setNotification({
                open: true,
                message: `Meta ${description} criada com sucesso!`,
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
                <S.H1>Criar Meta</S.H1>
                <S.TextField onChange={onChangeValue} name= "description" label="Descricao" variant="outlined" color="primary" fullWidth/>
                <S.TextField onChange={onChangeValue} name="value" label="Valor" variant="outlined" color="primary" fullWidth />
                <S.TextField onChange={onChangeValue} name= "dateMeta" label="Data da Meta" variant="outlined" color="primary" fullWidth/>
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

export default MetasCreate
