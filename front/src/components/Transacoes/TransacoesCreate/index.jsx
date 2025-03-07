'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState, useEffect } from 'react'

export const TransacoesCreate = () => {
    const [description, setDescription] = useState();
    const [value, setValue] = useState();
    const [type, setType] = useState('Receita');
    const [dateTransaction, setDateTransaction] = useState();
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

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

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('name: ', description)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:8080/transactions', { description, value, date: dateTransaction, type, category_id: category}, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            })
            console.log('Response', response) 
            setNotification({
                open: true,
                message: `Transação ${description} criada com sucesso!`,
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
                <S.H1>Criar Transaction</S.H1>
                <S.TextField onChange={onChangeValue} name= "description" label="Descrição" variant="outlined" color="primary" fullWidth/>
                <S.TextField onChange={onChangeValue} name="value" label="Valor" variant="outlined" color="primary" fullWidth />
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
                    <S.InputLabel id="category">Categorias</S.InputLabel>
                    <S.Select
                        labelId='Category'
                        id='category_select'
                        name="category"
                        value={category}
                        label="Categoria"
                        onChange={onChangeValue}
                    >
                        {categories.map(category =>
                            <S.MenuItem key={category.id} value={category.id}>{category.name}</S.MenuItem>
                        )}
                    </S.Select>
                </S.FormControl>
                <S.TextField onChange={onChangeValue} name= "dateTransaction" label="Data da Transação" variant="outlined" color="primary" fullWidth/>
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

export default TransacoesCreate
