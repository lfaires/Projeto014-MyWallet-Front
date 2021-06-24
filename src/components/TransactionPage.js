import axios from 'axios'
import styled from 'styled-components'
import { BiExit } from 'react-icons/bi'
import {IoAddCircleOutline, IoRemoveCircleOutline} from 'react-icons/io5'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useHistory } from 'react-router-dom'
import DeleteBox from './DeleteBox'

export default function TransactionPage() {
    const [transactions, setTransactions] = useState([])
    const [total, setTotal] = useState(0)
    const [user, setUser] = useState("")
    const [openDeleteBox, setOpenDeleteBox] = useState(false)
    const history = useHistory();
    const { token } = localStorage
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => getTransactions(),[])

    function getTransactions(){
        const request = axios.get('http://localhost:4000/transactions', config)

        request.then( response => {
            if(response.data.name){
                setUser(response.data.name)
                return
            }
            setTransactions(response.data)
            const values = response.data.map( item => {
                if(item.category === 'expense'){
                    item.value = -item.value
                } 
                return item.value
            })

            if( values.length === 0) return
            setTotal(values.reduce( (acc,item) => acc+item)/100)
            setUser(response.data[0].username)
        })

        request.catch((error) => console.log(error))
    }

    function logout() {
        const request = axios.post('http://localhost:4000/sign-out',{}, config)
 
        request.then( () => {
            localStorage.removeItem('token');
            history.push("/")
        })
        
    }

    return (
        <Container>
            {openDeleteBox ? <DeleteBox isOpen={openDeleteBox} setIsOpen={setOpenDeleteBox}/> : null}
            <Header>
                <Greeting>Olá, {user}</Greeting>
                <ExitIcon onClick={logout}/> 
            </Header>
            <Body noTransactions={transactions.length === 0 ? true : false}>
            {transactions.length ===0 ? <Text >Não há registros de <br/> entrada ou saída</Text> : <>
            <ContainerTransactions >
                    {transactions.map( transaction => { 
                    return <Transaction key={transaction.id} onClick={() => setOpenDeleteBox(true)}>
                        <DateDescription>
                            <Date>{dayjs(transaction.created_at).format("DD/MM")}</Date>
                            <Description>{transaction.description}</Description>
                        </DateDescription>
                        <Value type={transaction.category}>{((Math.abs(transaction.value)/100).toFixed(2)).toString().replace(".",",")}</Value>
                    </Transaction>
                    })}
                </ContainerTransactions>
                <ContainerBalance>
                    <Balance>SALDO</Balance>
                    <Total type={total >= 0 ? 'revenue' : ""}>{((Math.abs(total)).toFixed(2)).toString().replace(".",",")}</Total>
                </ContainerBalance>
                </>}
            </Body>
            <Footer>
                <AddRevenue onClick={() => history.push('/add-transaction/revenue')}>
                    <AddIcon />
                    <Title>Nova <br/> entrada</Title>
                </AddRevenue>
                <AddExpense onClick={() => history.push('/add-transaction/expense')}>
                    <RemoveIcon />
                    <Title>Nova <br/> saída</Title>
                </AddExpense>
            </Footer>
        </Container>
    )
}

const Container = styled.div`
    margin: 25px;
`
const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;
`
const Greeting = styled.p`
    font-weight: 700;
    font-size: 26px;
`
const ExitIcon = styled(BiExit)`
    color: #fff;
    font-size: 30px;
    cursor: pointer;
`
const Body = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.noTransactions ? 'center' : 'space-between'};
    text-align: center;
    background-color: #fff;
    margin-top: 22px;
    margin-bottom: 13px;
    border-radius: 5px;
    height: 67vh;
    padding: 23px 12px 12px 12px;
`
const Text = styled.p`
    text-align: center;
    color: #868686;
    font-size: 20px;
`
const ContainerTransactions = styled.ul`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    overflow-y: scroll;
`
const ContainerBalance = styled.div`
    display: flex;
    justify-content: space-between;
`
const Balance = styled.div`
    color: #000;
    font-weight: 700;
    font-size: 17px;
`
const Total = styled.div`
    color: ${props => props.type === 'revenue' ? '#03ac00' : '#c70000'};
`
const DateDescription = styled.div`
    display: flex;
    justify-content: space-between;
`
const Transaction = styled.li`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    font-size: 16px;
    cursor: pointer;
`
const Date = styled.div`
    color: #c6c6c6;
`
const Description = styled.div`
    margin: 0 10px;
    color:#000;
`
const Value = styled.div`
    color: ${props => props.type === 'revenue' ? '#03ac00' : '#c70000'};
`
const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const AddRevenue = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 48%;
    height: 114px;
    background-color: #a328d6;
    border-radius: 5px;
    padding: 10px;
    cursor:pointer;
`
const AddExpense = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 48%;
    height: 114px;
    background-color: #a328d6;
    border-radius: 5px;
    padding: 10px;
    cursor:pointer;
`
const AddIcon = styled(IoAddCircleOutline)`
    color: #fff;
    font-size: 22px;
`
const RemoveIcon = styled(IoRemoveCircleOutline)`
    color: #fff;
    font-size: 22px;
`
const Title = styled.p`
    font-weight: 700;
    font-size: 17px;
    line-height: 20px;
`