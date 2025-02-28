'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState, useEffect } from 'react'

export const TransacoesCreate = () => {
    const [description, setDescription] = useState();
    const [value, setValue] = useState();
    const [type, setType] = useState('Receita');
    const [dateTransacao, setDateTransacao] = useState();
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    useEffect(() => {
        const getCategorias = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('http://localhost:8080/categorias', {
                    headers: {
                        Authorization: `Bearer ${ token}`
                    }
                })
                setCategorias(response.data.data)
            } catch (error) {
                setNotification({
                    open: true,
                    message: error.response.data.message,
                    severity: 'error'
                })
            }
        }
        getCategorias();
    }, [])

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'description') setDescription(value)
        if (name === 'value') setValue(value)
        if (name === 'type') setType(value)
        if (name === 'dateTransacao') setDateTransacao(value)
        if (name === 'categoria') setCategoria(value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('name: ', description)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:8080/transacoes', { description, value, date: dateTransacao, type, categoria_id: categoria}, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            })
            console.log('Response', response) 
            setNotification({
                open: true,
                message: `Transacao ${description} criada com sucesso!`,
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
                <S.H1>Criar Transacao</S.H1>
                <S.TextField onChange={onChangeValue} name= "description" label="Descricao" variant="outlined" color="primary" fullWidth/>
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
                    <S.InputLabel id="categoria">Categorias</S.InputLabel>
                    <S.Select
                        labelId='Categoria'
                        id='categoria_select'
                        name="categoria"
                        value={categoria}
                        label="Categoria"
                        onChange={onChangeValue}
                    >
                        {categorias.map(categoria =>
                            <S.MenuItem key={categoria.id} value={categoria.id}>{categoria.name}</S.MenuItem>
                        )}
                    </S.Select>
                </S.FormControl>
                <S.TextField onChange={onChangeValue} name= "dateTransacao" label="Data da Transacao" variant="outlined" color="primary" fullWidth/>
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
