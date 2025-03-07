'use client';

import { Menu } from '../../../components/Menu'
import axios from "axios";
import { useEffect, useState } from "react";
import { CategoriasCreate } from '../../../components/Categorias/CategoriasCreate'
//import { CategoriasUpdate } from '../../../components/Categorias/CategoriasUpdate'
import Button from '@mui/material/Button'

export const ExtratoPage = () => {
    const [user, setUser] = useState({
        id: null
    });

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        }

        axios.get('http://localhost:8080/users/me', {
            headers: {
            'Authorization': `Bearer ${ token }`
            }
        }).then(response => {
            setUser(response.data.data)
        } ).catch(_ => {
            window.location.href = '/login';
        })

    }, [])

    return (
        <>
            <div style={{display: 'flex', gap: '15px'}}>
                <Button variant="contained" color="primary" type="submit" onClick={() => setOpenModal(true)}>Nova Categoria</Button>
                <Button variant="contained" color="primary" type="submit" >Nova Transação</Button>
                <Button variant="contained" color="primary" type="submit" >Nova Meta</Button>
            </div>
            <CategoriasCreate openModal={openModal} closeModal={setOpenModal} />
        </>
        
    );
};

export default ExtratoPage;