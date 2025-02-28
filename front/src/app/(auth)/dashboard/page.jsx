'use client';

import axios from "axios";
import { useEffect, useState } from "react";
//import { CategoriasCreate } from '../../../components/Categorias/CategoriasCreate'
//import { CategoriasUpdate } from '../../../components/Categorias/CategoriasUpdate'
//import { MetasCreate } from '../../../components/Metas/MetasCreate'
//import { MetasUpdate } from '../../../components/Metas/MetasUpdate'
//import { TransacoesCreate } from '../../../components/Transacoes/TransacoesCreate'
import { TransacoesUpdate } from '../../../components/Transacoes/TransacoesUpdate'

export const DashboardPage = () => {
    
    const [user, setUser] = useState({
        id: null
    });

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
        <div>
            <h1>Dashboard</h1>
            <TransacoesUpdate transacaoId={1}></TransacoesUpdate>
        </div>
    );
};

export default DashboardPage;