import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { base } from '../../service/Base'
import './ChatSend.css'
import { App } from 'antd'

export default function ChatSend({ receiverId: receiverIdProp, getMessages, onUnauthorized, conversationId }) {
    const senderId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    const isAdmin = localStorage.getItem('isAdmin')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [receiverId, setReceiverId] = useState(receiverIdProp)
    const { message: messageApi } = App.useApp()
    const navigate = useNavigate()
    const inputRef = useRef(null)

    
    useEffect(() => {
        if (isAdmin === 'false' && !receiverIdProp) {
            setReceiverId(1)
        } else if (receiverIdProp) {
            setReceiverId(receiverIdProp)
        }
    }, [receiverIdProp, isAdmin])

    // Tự động focus vào input khi component mount hoặc conversationId thay đổi
    useEffect(() => {
        if (inputRef.current && conversationId) {
            // Delay nhỏ để đảm bảo component đã render xong
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }, [conversationId])
    
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
            // Focus lại vào input sau khi gửi thành công
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        } catch (error) {
            console.error('Failed to send message:', error)
            if (error?.response?.status === 401) {
                if (typeof onUnauthorized === 'function') {
                    onUnauthorized()
                } else {
                    messageApi.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
                    localStorage.removeItem('token')
                    localStorage.removeItem('isAdmin')
                    localStorage.removeItem('userId')
                    navigate('/login', { replace: true })
                }
            }
            setSending(false)
            // Focus lại vào input ngay cả khi có lỗi
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
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
                ref={inputRef}
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