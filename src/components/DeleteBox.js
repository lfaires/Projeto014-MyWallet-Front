import { useState } from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'

export default function DeleteBox({isOpen, setIsOpen}) {

    Modal.setAppElement('.root')

    function closeModal(){
        setIsOpen(false)
    }

    function deleteTransaction(e){
      e.preventDefault();
      alert("irrá")
    }

    return(
       <Modal
        isOpen={isOpen}
        //onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Title>Você deseja deletar esta transação?</Title>
        <Form onSubmit={deleteTransaction}>
          <Button>Deletar</Button>
        </Form>
      </Modal>
    )
}

const customStyles = {
  content: {
    backgroundColor: '#8c11be',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    borderRadius: '5px',
    transform: 'translate(-50%, -50%)',
  },
};

const Title = styled.h2`
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  padding-bottom: 30px;
`
const Form = styled.form`
    display: flex;
    justify-content: center;
`
const Button = styled.button`
    border-radius: 5px;
    border: none;
    background-color: #a328d6;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    height: 30px;
    width: 80px;
`