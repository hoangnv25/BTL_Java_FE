import axios from 'axios'
import { base } from '../../service/Base'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ChatSidebar.css'

export default function ChatSilebar() {
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    const [activeConversationId, setActiveConversationId] = useState(null)

    const [listChat, setListChat] = useState([])
    const [loading, setLoading] = useState(true)
    const getListChat = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${base}/conversations?viewerId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setListChat(response.data)
        } catch (error) {
            console.error('Failed to fetch chat list:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getListChat()
    }, [])

    const getInitials = (name) => {
        if (!name) return '?'
        const parts = String(name).trim().split(/\s+/)
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const formatTime = (iso) => {
        try {
            const d = new Date(iso)
            const now = new Date()
            const isToday = d.toDateString() === now.toDateString()
            if (isToday) {
                return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            return d.toLocaleDateString()
        } catch {
            return ''
        }
    }

    const navigate = useNavigate()
    const gotoChatDetail = (c) => {
        setActiveConversationId(c.conversationId)
        navigate(`/chat/${c.conversationId}`)
    }


    const renderSkeleton = () => {
        return Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="chat-item-skeleton">
                <div className="chat-item-skeleton__avatar"></div>
                <div className="chat-item-skeleton__content">
                    <div className="chat-item-skeleton__top">
                        <div className="chat-item-skeleton__name"></div>
                        <div className="chat-item-skeleton__time"></div>
                    </div>
                    <div className="chat-item-skeleton__last"></div>
                </div>
            </div>
        ))
    }

    return (
        <div className="chat-sidebar">
            <div className="chat-sidebar__header">Hộp thoại</div>
            <div className="chat-sidebar__list">
                {loading ? (
                    renderSkeleton()
                ) : (
                    listChat.map((c) => {
                        const isActive = activeConversationId === c.conversationId
                        return (
                            <button
                                key={c.conversationId}
                                className={`chat-item${isActive ? ' is-active' : ''}`}
                                onClick={() => gotoChatDetail(c)}
                            >
                                <div className="chat-item__avatar">
                                    {c.senderSummary?.avatar ? (
                                        <img src={c.senderSummary.avatar} alt="avatar" />
                                    ) : (
                                        getInitials(c.senderSummary?.senderName)
                                    )}
                                </div>
                                <div className="chat-item__content">
                                    <div className="chat-item__top">
                                        <span className="chat-item__name">{c.senderSummary?.senderName || 'Người dùng'}</span>
                                        <span className="chat-item__time">{formatTime(c.updatedAt)}</span>
                                    </div>
                                    <div className="chat-item__last" title={c.lastMessage}>
                                        {c.lastMessage}
                                    </div>
                                </div>
                            </button>
                        )
                    })
                )}
            </div>
        </div>
    )
}