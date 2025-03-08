'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { forwardRef, useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { NumericFormat } from 'react-number-format';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NumericFormatCustom = forwardRef(function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator="."
            decimalSeparator=','
            valueIsNumericString
            prefix='R$'
        />
    );
})

export const TransacoesCreate = ({openModal, closeModal}) => {
    const [description, setDescription] = useState();
    const [value, setValue] = useState();
    const [type, setType] = useState('Receita');
    const [dateTransaction, setDateTransaction] = useState(new Date());
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);

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
        if (name === 'category') setCategory(value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('name: ', description)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:8080/transactions', { description, value: value * 100, date: formatISO(dateTransaction, {representation: 'date', locale: ptBR}), type, category_id: category}, {
                headers: {
                    Authorization: `Bearer ${ token }`
                }
            })
            
            setNotification({
                open: true,
                message: `Transação ${description} criada com sucesso!`,
                severity: 'success'
            })

            handleCloseModal();
            
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
                <DialogTitle>Nova transação</DialogTitle>
                <DialogContent>
                    <S.Form onSubmit={ onSubmit }>
                        <S.TextField onChange={onChangeValue} name= "description" label="Descrição" variant="outlined" color="primary" fullWidth/>
                        
                        <S.TextField
                            name="value"
                            label="Valor"
                            onChange={onChangeValue}
                            id="formatted-numberformat-input"
                            InputProps={{ inputComponent: NumericFormatCustom }}
                            variant="outlined"
                            color="primary"
                            fullWidth
                        />
                        
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
                            <S.InputLabel id="category">Categoria</S.InputLabel>
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
                            
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                <DatePicker onChange={(newValue) => setDateTransaction(newValue)} fullWidth/>
                        </LocalizationProvider>
                    </S.Form>
                </DialogContent>
                
                <DialogActions style={{ display: 'flex', justifyContent: 'Center' }}>
                    <S.Button variant="contained" color="success" type="submit" onClick={onSubmit}>Salvar</S.Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TransacoesCreate
