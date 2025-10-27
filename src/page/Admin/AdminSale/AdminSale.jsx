import axios from 'axios'
import { base } from '../../../service/Base'
import { useEffect, useState } from 'react'
import { App } from 'antd';
import ModalSale from './Modal'


export default function AdminSale() {
    const { message } = App.useApp();

    const [data_sales, setDataSales] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchSales = async () => {
        try {
            const response = await axios.get(`${base}/sales`)
            if (response.status === 200) {
                console.log(response.data.result)
                setDataSales(response.data.result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSales()
    }, [])


    const openModal = () => {
        setIsModalOpen(true)
    }

    const handleDelete = async (sale) => {
        try {
            const response = await axios.delete(`${base}/sales/${sale.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }   
            })
            if (response.status === 200) {
                message.success(response.data?.message || 'Xóa khuyến mãi thành công')
                fetchSales()
                return
            }
            message.error(response.data?.message || 'Xóa khuyến mãi thất bại')
        } catch (error) {
            message.error(error?.response?.data?.message || 'Xóa khuyến mãi thất bại')
        }
    }

    return (
        <div>
            <button className="btn btn-primary" onClick={openModal}>Thêm khuyến mãi</button>
            <h1>Admin Sale</h1>
            {data_sales.map((sale) => (
                <div key={sale.id}>
                    <h2>{sale.name}</h2>
                    <p>{sale.description}</p>
                    <p>{sale.stDate}</p>
                    <p>{sale.endDate}</p>
                    <p>{sale.active}</p>
                    <button onClick={() => handleDelete(sale)}>Xóa</button>
                </div>
            ))}
            <ModalSale
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fetchSales={fetchSales}
            />
        </div>
    )
}