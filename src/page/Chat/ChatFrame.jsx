import './ChatFrame.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { base, baseSocket } from '../../service/Base'
import ChatSend from './ChatSend'

// import { io } from "socket.io-client";
import io from "socket.io-client";

export default function ChatFrame() {
    let { senderId } = useParams()
    const isAdmin = localStorage.getItem('isAdmin')
    const [conversationId, setConversationId] = useState('')
    const [messagesData, setMessagesData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const viewerId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    const messagesEndRef = useRef(null)
    let id_to_get_conversation = viewerId
    let receiverId = null
    if (isAdmin === 'true' && senderId) {
        id_to_get_conversation = senderId
        receiverId = senderId
    } else {
        receiverId = 1 // Admin ID
    }

    const socketRef = useRef(null)

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
        if (!token) return;
        if (socketRef.current) return; // chỉ tạo 1 lần
    
        const socket = io("wss://besocket.up.railway.app", {
            path: "/socket.io/",
            query: { token },
            transports: ["websocket"],
        });

        
    
        socket.on("connect", () => {
            console.log("✅ Socket connected");
        });
    
        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });
    
        // Khi nhận tin nhắn mới
        socket.on("message", (message) => {
            console.log("💬 Có message: " + message.content);
            handleNewMessage(message);
        });

        // socket.onAny((event, ...args) => {
        //     console.log("📡 Received:", event, args);
        // });
    
        socketRef.current = socket;
    
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [token, conversationId]);
    
    // Khi conversationId thay đổi -> join đúng room
    useEffect(() => {
        if (socketRef.current && conversationId) {
            const room = "conversation_" + conversationId;
            console.log("📡 Join room:", room);
            socketRef.current.emit("join_room", room);
        }
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
            const now = new Date()
            
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
                // Hiển thị giờ:phút (24h format)
                const hours = String(d.getHours()).padStart(2, '0')
                const minutes = String(d.getMinutes()).padStart(2, '0')
                return `${hours}:${minutes}`
            }
            // Hiển thị ngày/tháng/năm
            const day = String(date).padStart(2, '0')
            const monthStr = String(month + 1).padStart(2, '0')
            return `${day}/${monthStr}/${year}`
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
                <div ref={messagesEndRef} />
            </div>
            <ChatSend receiverId={receiverId} getMessages={getMessages} />
        </div>
    )
}