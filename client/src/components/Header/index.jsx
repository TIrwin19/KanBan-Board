import React, { useState } from 'react'
//graphql CREATE_PROJECT , 
import { CREATE_PROJECT } from '../../graphql/mutations/projectMutations'
import { LOGOUT } from '../../graphql/mutations/authMutations'

import { useMutation } from '@apollo/client'


const Header = () => {
    const [logout] = useMutation(LOGOUT)

    const [isCreating, setIsCreating] = useState(false)
    const [projectName, setProjectName] = useState('')

    const [createProject] = useMutation(CREATE_PROJECT, {
        onCompleted: (data) => {
            console.log('Project created', data)
            setIsCreating(false)
            setProjectName('')
        }
    })

    const handleLogout = async () => {
        try {
            await logout()
            console.log('frontend logout')
        } catch (error) {
            console.log(error)
        }
    }

    const handleCreateProjectClick = () => {
        setIsCreating(true)
    } //this turns it into a form to type in the project name

    const handleCreateProject = () => {
        if (projectName.trim() !== '') {
            createProject({
                variable: {
                    title: projectName
                }
            })
        }
    }



    return (
        <>
            <header className="bg-gray-800 p-4 flex justify-between items-center text-white">
                {isCreating ? (
                    <div className="flex items-center gap-2 animate-slide-in">
                        <input
                            type="text"
                            placeholder="Enter project title"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="px-3 py-2 rounded-md text-gray-900 outline-none transition-all duration-300 ease-in-out"
                        />
                        <button
                            onClick={handleCreateProject}
                            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-all duration-300 ease-in-out"
                        >
                            Submit
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleCreateProjectClick}
                        className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-all duration-300 ease-in-out"
                    >
                        Create Project
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-all duration-300 ease-in-out"
                >
                    Logout
                </button>
            </header>

        </>

    )
}


export default Header