'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export const CategoriasCreate = ({openModal, closeModal}) => {
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
            const response = await axios.post('http://localhost:8080/categories', { name }, {
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

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (openModal) {
            setOpen(true);
        } 
    }, [openModal])

    const handleCloseModal = () => {
        setOpen(false);
        closeModal(false);
    };

    return (
        <>
            <S.Snackbar open={notification.open} autoHideDuration={3000} onClose={handleClose}>
                <S.Alert onClose={handleClose} variant="filled" severity={notification.severity} sx={{width: '100%'}}>
                    {notification.message}
                </S.Alert>
            </S.Snackbar>

            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Nova categoria</DialogTitle>
                <DialogContent>
                <S.Form onSubmit={ onSubmit }>
                    <S.TextField onChange={onChangeValue} name= "name" label="Descrição" variant="outlined" color="primary" fullWidth/>
                </S.Form>
                </DialogContent>
                <DialogActions style={{display: 'flex', justifyContent: 'Center'}}>
                <S.Button variant="contained" color="success" type="submit" onClick={onSubmit}>Salvar</S.Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CategoriasCreate
