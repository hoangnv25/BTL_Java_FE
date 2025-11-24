import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import '../assets/style/FloatingCart.css';

function FloatingChatLink() {
	const location = useLocation();
	const currentPath = location.pathname;

	const allowedStatic = new Set(['/', '/newArrivals', '/user']);
	const allowedPatterns = [/^\/category\/[^/]+$/, /^\/product\/[^/]+$/];

	const shouldShow =
		currentPath !== '/chat' &&
		(allowedStatic.has(currentPath) || allowedPatterns.some((pattern) => pattern.test(currentPath)));

	if (!shouldShow) return null;

	return (
		<Link to="/chat" className="floating-chat" aria-label="Mở chat" title="Chat ngay">
			<MessageCircle size={24} strokeWidth={2.5} />
		</Link>
	);
}

export default FloatingChatLink;

