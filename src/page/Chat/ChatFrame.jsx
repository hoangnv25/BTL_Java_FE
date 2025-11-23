import './ChatFrame.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { base } from '../../service/Base'
import ChatSend from './ChatSend'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { ArrowLeft } from 'lucide-react'
import { App } from 'antd'

export default function ChatFrame() {
    let { senderId } = useParams()
  const navigate = useNavigate()
    const { message } = App.useApp()
    const isAdmin = localStorage.getItem('isAdmin')
    const [conversationId, setConversationId] = useState('')
    const [messagesData, setMessagesData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const viewerId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    const messagesEndRef = useRef(null)
    const unauthorizedRef = useRef(false)
    let id_to_get_conversation = viewerId
    let receiverId = null
    if (isAdmin === 'true' && senderId) {
        id_to_get_conversation = senderId
        receiverId = senderId
    } else {
        receiverId = 1 // Admin ID
    }

    const stompClientRef = useRef(null)

    const handleUnauthorized = () => {
        if (unauthorizedRef.current) return
        unauthorizedRef.current = true
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
        localStorage.clear()
        navigate('/login', { replace: true })
    }

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
            if (error?.response?.status === 401) {
                handleUnauthorized()
            }
        } finally {
            if (showLoading) {
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        const fetchConversationId = async () => {
            try {
                const form = new FormData()
                form.append('userId', id_to_get_conversation)
                const response = await axios.post(`${base}/chat/conversations/ensure`, form, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const cid = response.data.conversationId
                setConversationId(cid)
            } catch (error) {
                console.error('Failed to get conversationId:', error)
                if (error?.response?.status === 401) {
                    handleUnauthorized()
                }
            }
            
        }
        fetchConversationId()
    }, [id_to_get_conversation, token])

    useEffect(() => {
        if (conversationId) {
            getMessages(true) // Hiển thị skeleton lần đầu
        }
    }, [conversationId, token])


    // //////////////////////////////////////// load 5 giây 1 lần
    // useEffect(() => {
    //     if (!conversationId) return
        
    //     const intervalId = setInterval(() => {
    //         getMessages(false) // Không hiển thị skeleton khi polling
    //     }, 5000)

    //     return () => clearInterval(intervalId)
    // }, [conversationId, id_to_get_conversation, token])
    // ////////////////////////////////////////

    const handleNewMessage = (message) => {
        console.log('Hàm lấy tin nhắn mới đã được gọi')
        // Gọi getMessages để cập nhật danh sách tin nhắn
        getMessages(false)
    }



    useEffect(() => {
        if (!conversationId) return;
    
        const socket = new SockJS(`${base}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}` // thêm token
            }
        });
    
        client.onConnect = () => {
            console.log("✅ STOMP connected");
            client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
                const body = JSON.parse(message.body);
                handleNewMessage(body);
            });
        };
    
        client.onWebSocketClose = () => {
            console.log("❌ WebSocket closed");
        };
    
        client.activate();
        stompClientRef.current = client;
    
        return () => {
            client.deactivate();
        };
    }, [conversationId]);
    
    
    const messages = messagesData.filter(m => String(m.conversationId) === String(conversationId))

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages.length, conversationId])

    const formatTime = (iso) => {
        try {
            const d = new Date(iso)
            d.setHours(d.getHours())
            const now = new Date()
            now.setHours(now.getHours())
            
            // So sánh ngày
            const date = d.getDate()
            const month = d.getMonth()
            const year = d.getFullYear()
            const nowDate = now.getDate()
            const nowMonth = now.getMonth()
            const nowYear = now.getFullYear()
            
            const isToday = date === nowDate && 
                          month === nowMonth && 
                          year === nowYear
            
            if (isToday) {
                return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            }
            // Hiển thị ngày/tháng/năm
            return d.toLocaleDateString('vi-VN')
        } catch {
            return ''
        }
    }

    const getInitials = (name) => {
        if (!name) return '?'
        return String(name).trim().slice(0, 2).toUpperCase()
    }

    const headerTitle = messages.find(m => !m.me)?.senderSummary?.displayName || `Liên hệ trực tiếp với Admin Hoàng Culus`

    return (
        <div className="chat-frame">
            <div className="chat-frame__header">
                <button className="chat-frame__back" type="button" onClick={() => navigate(-1)} aria-label="Quay lại">
                    <ArrowLeft size={18} />
                </button>
                <div className="chat-frame__header-text">
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
                                    {formatTime(m.createdAt)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <ChatSend receiverId={receiverId} getMessages={getMessages} onUnauthorized={handleUnauthorized} conversationId={conversationId} />
        </div>
    )
}