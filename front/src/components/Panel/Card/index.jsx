'use client'

import * as S from './style'
import Icon from '@mui/material/Icon'
import { useEffect, useState } from 'react'

export const Card = ({ children, label, valor, isGoal, goals = [], saldo = 0 }) => {
    const [goal, setGoal] = useState(null)
    const [ goalCalc, setGoalCalc ] = useState(0)
    
    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'goal') setGoal(value)
    }
    


    return (
        <S.ChartContainer>
            <S.IconWraper>
                <Icon sx={{color: '#fff'}}>{children}</Icon>
            </S.IconWraper>
            <S.Content>
                <S.Content>{label}</S.Content>
                {!isGoal && <S.Content style={{ fontWeight: 600 }}>{valor}</S.Content>}
                {isGoal && saldo > 0 && <S.Content style={{ fontWeight: 600 }}>{`${(((goal - saldo) / goal) * 100).toFixed(0)}%`}</S.Content>}
                {isGoal && saldo<0 && <S.Content style={{ fontWeight: 600 }}>{`Saldo negativo. Meta: ${(((saldo) / goal) * 100).toFixed(0)}%`}</S.Content>}
            </S.Content>
            {isGoal &&
                <S.FormControl fullWidth>
                    <S.InputLabel id="goal">Meta</S.InputLabel>
                        <S.Select
                            labelId='Meta'
                            id='goal_select'
                            name="goal"
                            value={goal}
                            label="Meta"
                            onChange={onChangeValue}
                        >
                        {goals.map(goal =>
                            <S.MenuItem key={goal.id} value={goal.value}>{goal.description}</S.MenuItem>
                        )}
                    </S.Select>
                </S.FormControl>}
        </S.ChartContainer>
    )
}

export default Card;