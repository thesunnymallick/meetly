import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='NotFound'>
        <div>
            <h1>No meeting Found</h1>
             <p>Click link below and back to home</p>
              <Link to="/"><Button variant='contained' color='secondary'>BACK TO HOME</Button></Link>
        </div>
    </div>
  )
}
export default NotFound