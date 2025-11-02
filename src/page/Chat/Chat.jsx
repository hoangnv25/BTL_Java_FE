import NotLoggedIn from '../../components/NotLoggedIn'
import ChatSilebar from './ChatSidebar'
import ChatFrame from './ChatFrame'
import './Chat.css'
import { Routes, Route } from 'react-router-dom'


export default function Chat() {
    const token = localStorage.getItem('token')
    const isAdmin = localStorage.getItem('isAdmin')


    if (!token) {
        return <NotLoggedIn />
    }
    return (
        <div className="chat-container">
            {isAdmin === 'true' ? <ChatSilebar /> : null}
            {isAdmin === 'true' ? (
                <Routes>
                    <Route path=":conversationId" element={<ChatFrame />} />
                </Routes>
                ) : (
                <ChatFrame />
                )}
        </div>
    )
}