'use client'

import { useEffect, useState } from 'react'
import { Card } from '../Card'
import Grid from '@mui/material/Grid'
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import AdsClickIcon from '@mui/icons-material/AdsClick'
import axios from 'axios'

export const Panel = () => {
    const [ somatorio, setSomatorio] = useState({
        saldo: 0,
        receita: 0,
        despesa: 0,
    });

    const [goals, setGoals] = useState([])
    const [goal, setGoal] = useState({})
        
    useEffect(() => {
        const getTransactions = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('http://localhost:8080/transactions', {
                    headers: {
                        Authorization: `Bearer ${ token}`
                    }
                })
                    
                const somatorio = {}

                for (const transaction of response.data.data) {    
                    if (transaction.type === 'Receita') {
                        somatorio.receita = somatorio.receita ? somatorio.receita + transaction.value : transaction.value 
                    }

                    if (transaction.type === 'Despesa') {
                        somatorio.despesa = somatorio.despesa ? somatorio.despesa + transaction.value : transaction.value 
                    }
                }

                somatorio.saldo  = somatorio.receita - somatorio.despesa

                setSomatorio(somatorio)
                        
            } catch (error) {}
        }
            
        getTransactions();

    }, [])

    useEffect(() => {
        const getGoals = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('http://localhost:8080/goals', {
                    headers: {
                        Authorization: `Bearer ${ token}`
                    }
                })
                    
                setGoals(response.data.data)        
            } catch (error) {}
        }
            
        getGoals();

    }, [])
    

    return (
        <div>
            <Grid container spacing={8}>
                <Grid item xs={6}>
                    <Card label="Saldo Atual" valor={`R$ ${somatorio.saldo / 100}`}>
                        <AccountBalanceWallet />
                    </Card>
                    
                    <Card label="Receitas" valor={`R$ ${somatorio.receita / 100}`}>
                        <LocalAtmIcon />
                    </Card>
                    
                </Grid>
                <Grid item xs={6}>
                    <Card label="Despesas" valor={`R$ ${somatorio.despesa / 100}`}>
                        <SyncAltIcon />
                    </Card>
                    
                    <Card label="Metas" isGoal goals={goals} saldo={somatorio.saldo / 100}>
                        <AdsClickIcon/>
                    </Card>
                    
                    
                </Grid>
            </Grid>
        </div>
    )
}

export default Panel;