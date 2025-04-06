import { Button, Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

const Test = () => {
  const testRef = useRef()

  return (
    <>
    <Button onClick={() => {  console.log(testRef); testRef.current.handleOpen()}}>按钮</Button>
    <MyModal ref={testRef}></MyModal>
    </>
  )
}

const MyModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false)

  const handleCancel = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  
  useImperativeHandle(ref, () => ({
    handleOpen: handleOpen
  }))

  
  return <>
  <Button onClick={handleOpen}>点击</Button>
  <Modal open={open} onCancel={handleCancel}></Modal>
  </>
})

export default Test