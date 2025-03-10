'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState, useEffect } from 'react'

export const TransacoesUpdate = ({transactionId}) => {
    const [description, setDescription] = useState();
    const [value, setValue] = useState();
    const [type, setType] = useState('Receita');
    const [dateTransaction, setDateTransaction] = useState();
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState();

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    useEffect(() => {
        const getCategories = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('http://localhost:8080/categories', {
                    headers: {
                        Authorization: `Bearer ${ token}`
                    }
                })
                setCategories(response.data.data)
            } catch (error) {
                setNotification({
                    open: true,
                    message: error.response.data.message,
                    severity: 'error'
                })
            }
        }
        getCategories();
    }, [])

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'description') setDescription(value)
        if (name === 'value') setValue(value)
        if (name === 'type') setType(value)
        if (name === 'dateTransaction') setDateTransaction(value)
        if (name === 'category') setCategory(value)
    }

    useEffect(() => {
        const getTransaction = async () => {
            try {
                const token = localStorage.getItem('token')
                
                const response = await axios.get(`http://localhost:8080/transactions/${transactionId}`, {
                    headers: {
                        Authorization: `Bearer ${ token}`
                    }
                })
                setDescription(response.data.data.description);
                setValue(response.data.data.value);
                setDateTransaction(response.data.data.date);
                setUserId(response.data.data.user_id);
                setType(response.data.data.type);
                setCategory(response.data.data.category_id);

            } catch (error) {
                setNotification({
                    open: true,
                    message: error.response.data.message,
                    severity: 'error'
                })
            }
        }
        getTransaction();
    }, [transactionId])



    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const response = await axios.put(`http://localhost:8080/transacoes/${transactionId}`, { description, value, date: dateTransaction, type, category_id: category, user_id: userId}, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            })
            setNotification({
                open: true,
                message: `Transação ${description} atualizada com sucesso!`,
                severity: 'success'
            })
        } catch (error) {
            setNotification({
                open: true,
                message: error.response.data.message,
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
                <S.H1>Atualizar Transacao</S.H1>
                <S.TextField onChange={onChangeValue} name="description" label="Descricao" variant="outlined" value={description} color="primary" fullWidth/>
                <S.TextField onChange={onChangeValue} name="value" label="Valor" variant="outlined" value={value} color="primary" fullWidth />
                <S.FormControl fullWidth>
                    <S.InputLabel id="type">Tipo</S.InputLabel>
                    <S.Select
                        labelId='Tipo'
                        id='type_select'
                        name="type"
                        value={type}
                        label="Tipo"
                        onChange={onChangeValue}
                    >
                        <S.MenuItem value="Despesa">Despesa</S.MenuItem>
                        <S.MenuItem value="Receita">Receita</S.MenuItem>
                    </S.Select>
                </S.FormControl>
                <S.FormControl fullWidth>
                    <S.InputLabel id="category">Categories</S.InputLabel>
                    <S.Select
                        labelId='Category'
                        id='category_select'
                        name="category"
                        value={category}
                        label="Category"
                        onChange={onChangeValue}
                    >
                        {categories.map(category =>
                            <S.MenuItem key={category.id} value={category.id}>{category.name}</S.MenuItem>
                        )}
                    </S.Select>
                </S.FormControl>
                <S.TextField onChange={onChangeValue} name="dateTransaction" label="Data da Transacao" variant="outlined" value={dateTransaction} color="primary" fullWidth/>
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

export default TransacoesUpdate
