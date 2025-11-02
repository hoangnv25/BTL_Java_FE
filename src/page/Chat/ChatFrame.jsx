import './ChatFrame.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { base } from '../../service/Base'
import ChatSend from './ChatSend'

export default function ChatFrame() {
    const { conversationId: urlConversationId } = useParams()
    const isAdmin = localStorage.getItem('isAdmin')
    const [conversationId, setConversationId] = useState(urlConversationId)
    const [messagesData, setMessagesData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const viewerId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    const getMessages = async (showLoading = false) => {
        if (!conversationId) {
            setIsLoading(false)
            return
        }
        if (showLoading) {
            setIsLoading(true)
        }
        try {
            const response = await axios.get(`${base}/chat/messages?conversationId=${conversationId}&viewerId=${viewerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setMessagesData(response.data)
        } catch (error) {
            console.error('Failed to get messages:', error)
        } finally {
            if (showLoading) {
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        const fetchConversationId = async () => {
            if (isAdmin === 'false' && !urlConversationId) {
                try {
                    const form = new FormData()
                    form.append('userId', viewerId)
                    const response = await axios.post(`${base}/chat/conversations/ensure`, form, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    const cid = response.data.conversationId
                    setConversationId(cid)
                } catch (error) {
                    console.error('Failed to get conversationId:', error)
                }
            } else if (urlConversationId) {
                setConversationId(urlConversationId)
            }
        }
        fetchConversationId()
    }, [isAdmin, urlConversationId, viewerId, token])

    useEffect(() => {
        if (conversationId) {
            getMessages(true) // Hiển thị skeleton lần đầu
        }
    }, [conversationId, viewerId, token])


    // ////////////////////////////////////////
    useEffect(() => {
        if (!conversationId) return
        
        const intervalId = setInterval(() => {
            getMessages(false) // Không hiển thị skeleton khi polling
        }, 5000)

        return () => clearInterval(intervalId)
    }, [conversationId, viewerId, token])
    // ////////////////////////////////////////


    const messages = messagesData.filter(m => String(m.conversationId) === String(conversationId))

    const formatTime = (iso) => {
        try {
            // Parse ISO string (UTC) và cộng thêm 7 giờ (UTC+7 - múi giờ Việt Nam)
            const d = new Date(iso)
            const vietnamTime = new Date(d.getTime() + (7 * 60 * 60 * 1000))
            
            // Lấy thời gian hiện tại ở UTC và cộng thêm 7 giờ để so sánh
            const now = new Date()
            const nowUTC = Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            )
            const nowVietnam = new Date(nowUTC + (7 * 60 * 60 * 1000))
            
            // So sánh ngày theo múi giờ Việt Nam
            const vietnamDate = vietnamTime.getDate()
            const vietnamMonth = vietnamTime.getMonth()
            const vietnamYear = vietnamTime.getFullYear()
            const nowDate = nowVietnam.getDate()
            const nowMonth = nowVietnam.getMonth()
            const nowYear = nowVietnam.getFullYear()
            
            const isToday = vietnamDate === nowDate && 
                          vietnamMonth === nowMonth && 
                          vietnamYear === nowYear
            
            if (isToday) {
                // Hiển thị giờ:phút (24h format)
                const hours = String(vietnamTime.getHours()).padStart(2, '0')
                const minutes = String(vietnamTime.getMinutes()).padStart(2, '0')
                return `${hours}:${minutes}`
            }
            // Hiển thị ngày/tháng/năm
            const day = String(vietnamDate).padStart(2, '0')
            const month = String(vietnamMonth + 1).padStart(2, '0')
            const year = vietnamYear
            return `${day}/${month}/${year}`
        } catch {
            return ''
        }
    }

    const getInitials = (name) => {
        if (!name) return '?'
        const parts = String(name).trim().split(/\s+/)
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const headerTitle = messages.find(m => !m.me)?.senderSummary?.senderName || `Liên hệ trực tiếp với Admin Hoàng Culus`

    return (
        <div className="chat-frame">
            <div className="chat-frame__header">
                {isLoading && conversationId ? (
                    <>
                        <div className="chat-frame__title chat-skeleton-header-title"></div>
                        <div className="chat-frame__subtitle chat-skeleton-header-subtitle"></div>
                    </>
                ) : (
                    <>
                        <div className="chat-frame__title">{headerTitle}</div>
                        <div className="chat-frame__subtitle">{messages.length} tin nhắn</div>
                    </>
                )}
            </div>
            <div className="chat-frame__messages">
                {isLoading && conversationId ? (
                    <>
                        {[...Array(3)].map((_, index) => (
                            <div key={`skeleton-${index}`} className={`chat-message${index % 2 === 0 ? ' is-other' : ' is-me'}`}>
                                {index % 2 === 0 ? (
                                    <div className="chat-message__avatar chat-skeleton-avatar"></div>
                                ) : <div className="chat-message__avatar--spacer" />}
                                <div className={`chat-bubble${index % 2 === 0 ? ' chat-bubble--other' : ' chat-bubble--me'} chat-skeleton-bubble`}>
                                    <div className="chat-skeleton-line chat-skeleton-line--short"></div>
                                    <div className="chat-skeleton-line chat-skeleton-line--medium"></div>
                                    {index % 2 === 0 && <div className="chat-skeleton-line chat-skeleton-line--short"></div>}
                                </div>
                            </div>
                        ))}
                    </>
                ) : !conversationId ? null : messages.length === 0 ? (
                    <div className="chat-empty">Chưa có tin nhắn cho cuộc trò chuyện này.</div>
                ) : (
                    messages.map(m => (
                        <div key={m.messageId} className={`chat-message${m.me ? ' is-me' : ' is-other'}`}>
                            {!m.me ? (
                                <div className="chat-message__avatar">
                                    {m.senderSummary?.avatar ? (
                                        <img src={m.senderSummary.avatar} alt="avatar" />
                                    ) : (
                                        getInitials(m.senderSummary?.senderName)
                                    )}
                                </div>
                            ) : <div className="chat-message__avatar--spacer" />}
                            <div className={`chat-bubble${m.me ? ' chat-bubble--me' : ' chat-bubble--other'}`}>
                                <div className="chat-bubble__content">{m.content}</div>
                                <div className="chat-bubble__meta">
                                    {m.senderSummary?.senderName || 'Người dùng'} • {formatTime(m.createdAt)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {conversationId && <ChatSend key={conversationId} conversationId={conversationId} getMessages={getMessages} />}
        </div>
    )
}