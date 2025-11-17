import { useEffect, useState } from 'react'
import NotLoggedIn from '../../components/NotLoggedIn'
import ChatSilebar from './ChatSidebar'
import ChatFrame from './ChatFrame'
import './Chat.css'
import { Routes, Route } from 'react-router-dom'

export default function Chat() {
    const token = localStorage.getItem('token')
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    const [isCompact, setIsCompact] = useState(typeof window !== 'undefined' ? window.innerWidth <= 740 : false)

    useEffect(() => {
        const handleResize = () => setIsCompact(window.innerWidth <= 740)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (!token) {
        return <NotLoggedIn />
    }

    if (!isAdmin) {
        return (
            <div className="chat-container">
                <ChatFrame />
            </div>
        )
    }

    return (
        <div className={`chat-container${isCompact ? ' chat-container--compact' : ''}`}>
            {isCompact ? (
                <Routes>
                    <Route index element={<ChatSilebar />} />
                    <Route path=":senderId" element={<ChatFrame />} />
                </Routes>
            ) : (
                <>
                    <ChatSilebar />
                    <Routes>
                        <Route path=":senderId" element={<ChatFrame />} />
                        <Route index element={<div className="chat-frame chat-frame--placeholder">Chọn một cuộc trò chuyện</div>} />
                    </Routes>
                </>
            )}
        </div>
    )
}