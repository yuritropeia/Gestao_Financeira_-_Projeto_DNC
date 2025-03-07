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

export const MetasCreate = ({openModal, closeModal}) => {
    const [description, setDescription] = useState();
    const [value, setValue] = useState();
    const [dateGoal, setDateGoal] = useState(new Date());
    const [open, setOpen] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'description') setDescription(value)
        if (name === 'value') setValue(value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('name: ', description)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:8080/goals', { description, value: value * 100, date: formatISO(dateGoal, {representation: 'date', locale: ptBR})}, {
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
                <DialogTitle>Nova meta</DialogTitle>
                <DialogContent>
                <S.Form onSubmit={ onSubmit }>
                    <S.TextField onChange={onChangeValue} name= "description" label="Descricao" variant="outlined" color="primary" fullWidth/>
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
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DatePicker onChange={(newValue) => setDateGoal(newValue)} fullWidth/>
                    </LocalizationProvider>
                </S.Form>
                </DialogContent>
                <DialogActions style={{display: 'flex', justifyContent: 'Center'}}>
                <S.Button variant="contained" color="success" type="submit" onClick={onSubmit}>Salvar</S.Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default MetasCreate
