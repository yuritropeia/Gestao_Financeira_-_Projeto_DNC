import styled from '@emotion/styled'
import ButtonMui from "@mui/material/Button"
import  TextFieldMui from '@mui/material/TextField'
import AlertMui from "@mui/material/Alert"
import SnackbarMui from "@mui/material/Snackbar"
import TypographyMui from '@mui/material/Typography'
import LinkNEXT from 'next/link'
import FormControlMui from '@mui/material/FormControl'
import InputLabelMui from '@mui/material/InputLabel'
import OutlinedInputMui from '@mui/material/OutlinedInput'
import InputAdornmentMui  from '@mui/material/InputAdornment'
import IconButtonMui from '@mui/material/IconButton'
import VisibilityMui  from '@mui/icons-material/Visibility'
import VisibilityOffMui from '@mui/icons-material/VisibilityOff'

export const Button = styled(ButtonMui)`
    margin-bottom: 40px;
`

export const TextField = styled(TextFieldMui)`
    margin-bottom: 64px;
`

export const H1 = styled.h1`
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 400px;
`

export const Alert = styled(AlertMui)`
`

export const Snackbar = styled(SnackbarMui)`
`

export const Typography = styled(TypographyMui)`
`

export const Link = styled(LinkNEXT)`
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: none;
    
`

export const FormControl = styled(FormControlMui)``

export const InputLabel = styled(InputLabelMui)``

export const OutlinedInput = styled(OutlinedInputMui)``

export const InputAdornment = styled(InputAdornmentMui)``

export const IconButton = styled(IconButtonMui)``

export const Visibility = styled(VisibilityMui)``

export const VisibilityOff = styled(VisibilityOffMui)``