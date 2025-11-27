import { useState, useEffect } from 'react';
import axios from 'axios';
import { base } from '../service/Base';

export function useUnreviewedCount() {
    const [unreviewedCount, setUnreviewedCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnreviewedCount = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUnreviewedCount(0);
                setLoading(false);
                return;
            }

            try {
                // Fetch orders
                const ordersRes = await axios.get(`${base}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (ordersRes.status === 200 && ordersRes.data?.result) {
                    const completedOrders = ordersRes.data.result.filter(o => o.status === 'COMPLETED');
                    
                    // Get unique product IDs from completed orders
                    const productIds = new Set();
                    completedOrders.forEach(order => {
                        (order.orderDetails || []).forEach(detail => {
                            if (detail.productId) {
                                productIds.add(detail.productId);
                            }
                        });
                    });

                    if (productIds.size === 0) {
                        setUnreviewedCount(0);
                        setLoading(false);
                        return;
                    }

                    // Get user ID from token
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    const currentUserId = String(decodedToken.sub || decodedToken.userId || decodedToken.id);

                    // Check which products have been reviewed by current user
                    let unreviewed = 0;
                    for (const productId of productIds) {
                        try {
                            const feedbackRes = await axios.get(`${base}/feedback/${productId}`);
                            if (feedbackRes.status === 200 && feedbackRes.data?.result?.feedbacks) {
                                const feedbacks = feedbackRes.data.result.feedbacks;
                                const hasReviewed = feedbacks.some(fb => String(fb.userId) === String(currentUserId));
                                if (!hasReviewed) {
                                    unreviewed++;
                                }
                            } else {
                                // If no feedbacks data, assume not reviewed
                                unreviewed++;
                            }
                        } catch {
                            // If error fetching feedback, assume not reviewed
                            unreviewed++;
                        }
                    }

                    setUnreviewedCount(unreviewed);
                }
            } catch (err) {
                console.error('Error fetching unreviewed count:', err);
                setUnreviewedCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchUnreviewedCount();

        // Refetch khi có sự thay đổi token hoặc khi có feedback mới
        const handleTokenChange = () => {
            fetchUnreviewedCount();
        };
        
        const handleFeedbackChange = () => {
            fetchUnreviewedCount();
        };
        
        window.addEventListener('tokenChanged', handleTokenChange);
        window.addEventListener('feedbackChanged', handleFeedbackChange);

        return () => {
            window.removeEventListener('tokenChanged', handleTokenChange);
            window.removeEventListener('feedbackChanged', handleFeedbackChange);
        };
    }, []);

    return { unreviewedCount, loading };
}

