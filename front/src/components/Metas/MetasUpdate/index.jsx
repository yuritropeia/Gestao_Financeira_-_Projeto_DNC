'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState, useEffect } from 'react'

export const MetasUpdate = ({goalId}) => {
    const [description, setDescription] = useState();
    const [value, setValue] = useState();
    const [dateGoal, setDateGoal] = useState();
    const [userId, setUserId] = useState();

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'description') setDescription(value)
        if (name === 'value') setValue(value)
        if (name === 'dateGoal') setDateGoal(value)
    }
    
    useEffect(() => {
        const getMeta = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`http://localhost:8080/goals/${ goalId }`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setDescription(response.data.data.description);
                setValue(response.data.data.value);
                setDateGoal(response.data.data.date);
                setUserId(response.data.data.user_id);
                
            } catch (error) {
                setNotification({
                    open: true,
                    message: error.response.data.message,
                    severity: 'error'
                })
            }
        }

        getMeta()
    }, [goalId])

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            await axios.put(`http://localhost:8080/goals/${ goalId }`, { description, value, date: dateGoal, user_id: userId }, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            })
            setNotification({
                open: true,
                message: `Meta ${description} atualizada com sucesso!`,
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
                <S.H1>Atualizar Meta</S.H1>
                <S.TextField onChange={onChangeValue} name="description" label="Descricao" variant="outlined" value={description} color="primary" fullWidth/>
                <S.TextField onChange={onChangeValue} name="value" label="Valor" variant="outlined" value={value} color="primary" fullWidth />
                <S.TextField onChange={onChangeValue} name="dateGoal" label="Data da Meta" variant="outlined" value={dateGoal} color="primary" fullWidth/>
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

export default MetasUpdate
