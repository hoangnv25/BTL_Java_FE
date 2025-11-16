import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { base } from '../../service/Base'
import './ChatSend.css'

export default function ChatSend({ receiverId: receiverIdProp, getMessages }) {
    const senderId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    const isAdmin = localStorage.getItem('isAdmin')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [receiverId, setReceiverId] = useState(receiverIdProp)

    
    useEffect(() => {
        if (isAdmin === 'false' && !receiverIdProp) {
            setReceiverId(1)
        } else if (receiverIdProp) {
            setReceiverId(receiverIdProp)
        }
    }, [receiverIdProp, isAdmin])
    
    const handleSend = async () => {
        console.log(receiverId)
        if (!message.trim() || !receiverId || sending) return
        try {
            setSending(true)
            await axios.post(`${base}/chat/messages`, {
                senderId: parseInt(senderId),
                receiverId: parseInt(receiverId),
                content: message
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setMessage('')
            await getMessages()
            setSending(false)
        } catch (error) {
            console.error('Failed to send message:', error)
            setSending(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="chat-send">
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                disabled={sending}
            />
            <button onClick={handleSend} disabled={sending} className={sending ? 'is-loading' : ''}>
                {sending ? (
                    <>
                        <span className="spinner"></span>
                        <span>Đang gửi...</span>
                    </>
                ) : (
                    'Gửi'
                )}
            </button>
        </div>
    )
}