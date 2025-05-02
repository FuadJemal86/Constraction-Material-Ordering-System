import React, { useEffect, useState } from 'react'
import api from '../../api'

function DonePayment() {

    const [donePayment, setDonePayment] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-completed-payment')

                if (result.data.status) {
                    setDonePayment(result.data.completed)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }

        }
        fetchData()
    }, [])
    return (
        <div>

        </div>
    )
}

export default DonePayment
