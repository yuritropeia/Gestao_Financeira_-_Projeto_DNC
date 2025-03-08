'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import compareAsc from 'date-fns/compareAsc';

export const TransacoesList = () => {
    const [transactions, setTransactions] = useState([]);
    const [transactionsTable, setTransactionsTable] = useState([]);
    const [tipo, setTipo] = useState('Todas');
    const [anos, setAnos] = useState(['todos']);
    const [ano, setAno] = useState('todos');

    useEffect(() => {
        
        const getTransactions = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('http://localhost:8080/transactions', {
                    headers: {
                        Authorization: `Bearer ${ token}`
                    }
                })

                setTransactions(response.data.data)
                setTransactionsTable(response.data.data)

                const anos = response.data.data
                    .map((transaction) => new Date(transaction.date).getFullYear())
                    .filter((ano, index, anos) => anos.indexOf(ano) === index)
                    .sort((a, b) => a - b);
                
                setAnos([
                    'todos',
                    ...anos
                ])
                
            } catch (error) {
                setNotification({
                    open: true,
                    message: error.response.data.message,
                    severity: 'error'
                })
            }
        }
        getTransactions();
    }, [])

    useEffect(() => {
        if (ano === 'todos') {
            if (tipo === 'Todas') {
                setTransactionsTable(transactions)
            }

            if (tipo === 'Receitas') {
                const receitas = transactions.filter(transacao => transacao.type === 'Receita')
                setTransactionsTable(receitas)
            }

            if (tipo === 'Despesas') {
            const despesas = transactions.filter(transacao => transacao.type === 'Despesa')
                setTransactionsTable(despesas)
            }
        }
        else {
            if (tipo === 'Todas') {
                const todas = transactions.filter(transacao => new Date(transacao.date).getFullYear() === Number(ano))
                setTransactionsTable(todas)
            }

            if (tipo === 'Receitas') {
                const receitas = transactions.filter(transacao => transacao.type === 'Receita' && new Date(transacao.date).getFullYear() === Number(ano))
                setTransactionsTable(receitas)
            }

            if (tipo === 'Despesas') {
            const despesas = transactions.filter(transacao => transacao.type === 'Despesa' && new Date(transacao.date).getFullYear() === Number(ano))
                setTransactionsTable(despesas)
            }
        }

    }, [tipo, transactions, ano])

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'ano') setAno(value)
    }

    return (
        <>
            <S.FormControl>
                <S.InputLabel id="ano_select">Anos</S.InputLabel>
                <S.Select
                    labelId='anos'
                    name="ano"
                    value={ano}
                    label="Anos"
                    onChange={onChangeValue}
                >
                    
                    {anos.map(anoDisponivel => <S.MenuItem key={anoDisponivel} value={anoDisponivel}>{anoDisponivel}</S.MenuItem>)}
                </S.Select>
            </S.FormControl>
            
            <div style={{ display: 'flex', gap: '15px', margin: '30px 0' }}>
                <div onClick={() => setTipo('Todas')}>Todas transações</div>
                <div onClick={() => setTipo('Receitas')}>Receitas</div>
                <div onClick={() => setTipo('Despesas')}>Despesas</div>
            </div>
                <S.TableContainer component={S.Paper}>
                    <S.Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <S.TableHead>
                        <S.TableRow>
                            <S.TableCell>Descrição</S.TableCell>
                            <S.TableCell align="right">Transação</S.TableCell>
                            <S.TableCell align="right">Data</S.TableCell>
                            <S.TableCell align="right">Situação</S.TableCell>
                            <S.TableCell align="right">Valor</S.TableCell>
                        </S.TableRow>
                        </S.TableHead>
                        <S.TableBody>
                        {transactionsTable.map((transaction) => (
                            <S.TableRow
                            key={transaction.description}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <S.TableCell component="th" scope="row">
                                {transaction.description}
                            </S.TableCell>
                            <S.TableCell align="right">{transaction.type}</S.TableCell>
                            <S.TableCell align="right">{format(new Date(transaction.date), 'd MMM, yyyy', {locale: ptBR})}</S.TableCell>
                                <S.TableCell align="right">{ compareAsc( new Date(), new Date(transaction.date)) === 1 ? 'Realizada':'Planejada' }</S.TableCell>
                            <S.TableCell align="right">R$ {transaction.value / 100}</S.TableCell>
                            </S.TableRow>
                        ))}
                        </S.TableBody>
                    </S.Table>
                </S.TableContainer>
            
        </>

    )
}

export default TransacoesList
