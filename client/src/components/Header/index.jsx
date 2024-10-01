import React, { useState } from 'react'
//graphql CREATE_PROJECT , 
import { CREATE_PROJECT } from '../../graphql/mutations/projectMutations'
import { LOGOUT } from '../../graphql/mutations/authMutations'

import { useMutation } from '@apollo/client'


const Header = () => {
    const [logout] = useMutation(LOGOUT)
    const [createProject] = useMutation(CREATE_PROJECT)

    //Handlemethod
    const handleLogout = async () => {
        logout()
    }

    const

    return (
        <div>
            <h1>Header</h1>
        </div>

    )
}


export default Header