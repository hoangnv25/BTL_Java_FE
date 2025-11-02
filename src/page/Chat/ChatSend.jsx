import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { base } from '../../service/Base'
import './ChatSend.css'

export default function ChatSend({ conversationId, getMessages }) {
    const senderId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    const isAdmin = localStorage.getItem('isAdmin')
    const [message, setMessage] = useState('')
    const [receiverId, setReceiverId] = useState(null)
    const [sending, setSending] = useState(false)

    useEffect(() => {
        if (isAdmin === 'false') {
            setReceiverId(1)
        } else {
            const fetchReceiverId = async () => {
                if (!conversationId) {
                    console.log("conversationId is null/undefined")
                    return
                }
                try {
                    const response = await axios.get(`${base}/conversations?viewerId=${senderId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    const conversation = response.data.find(c => String(c.conversationId) === String(conversationId))
                    if (conversation && conversation.senderSummary) {
                        setReceiverId(conversation.senderSummary.senderId)
                    }
                } catch (error) {
                    console.error("Error fetching receiverId:", error)
                }
            }
            fetchReceiverId()
        }
    }, [conversationId, senderId, token])

    const handleSend = async () => {
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