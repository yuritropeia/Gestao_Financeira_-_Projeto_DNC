'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts';

export const Chart = () => {
const [transactions, setTransactions] = useState([]);
const [transactionsChart, setTransactionsChart] = useState([]);
const [anos, setAnos] = useState(['todos']);
const [ano, setAno] = useState('todos');
const [dataset, setDataset] = useState([]);

useEffect(() => {       
    const getTransactions = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:8080/transactions', {
                headers: {
                    Authorization: `Bearer ${ token}`
                }
            })

            const anos = response.data.data
                .map((transaction) => new Date(transaction.date).getFullYear())
                .filter((ano, index, anos) => anos.indexOf(ano) === index)
                .sort((a, b) => a - b);
            
            setAnos([
                'todos',
                ...anos
            ])

            setTransactions(response.data.data)
            setTransactionsChart(response.data.data)
            
            const somatorio = []

            for (const transaction of response.data.data) {
                
                const ano = new Date(transaction.date).getFullYear()
                
                somatorio[ano] = somatorio[ano] ?? {}
                
                if (transaction.type === 'Receita') {
                    somatorio[ano].receita = somatorio[ano].receita ? somatorio[ano].receita + transaction.value : transaction.value 
                }

                if (transaction.type === 'Despesa') {
                    somatorio[ano].despesa = somatorio[ano].despesa ? somatorio[ano].despesa + transaction.value : transaction.value 
                }
            }

            
            const dataset = []
            
            somatorio.forEach((item, index) => {
                dataset.push({
                    ano: index,
                    receita: item.receita ?? 0,
                    despesa: item.despesa ?? 0,
                })
            })

            setDataset(dataset)
                
        } catch (error) {
            console.log(error)
        }
    }
    
    getTransactions();

}, [])

const valueFormatter = (value) => `R$ ${value / 100}`;

const chartSetting = {
    width: 900,
    height: 400
}

    return (
    <>
        {dataset.length && <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: 'band', dataKey: 'ano' }]}
            series={[
                { dataKey: 'receita', label: 'Receita', valueFormatter },
                { dataKey: 'despesa', label: 'Despesa', valueFormatter },
            ]}
            {...chartSetting}
        />}
    </>
    
);
}

export default Chart
