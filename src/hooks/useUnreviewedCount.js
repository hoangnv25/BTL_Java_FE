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

                    // Fetch all user's feedbacks at once (much more efficient)
                    let reviewedProductIds = new Set();
                    try {
                        // Try to get all user's feedbacks from a single endpoint
                        const userFeedbackRes = await axios.get(`${base}/reviews/user`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        
                        // Parse response (handle different formats)
                        let userFeedbacks = [];
                        if (userFeedbackRes.status === 200) {
                            if (Array.isArray(userFeedbackRes.data)) {
                                userFeedbacks = userFeedbackRes.data;
                            } else if (userFeedbackRes.data?.data) {
                                userFeedbacks = userFeedbackRes.data.data;
                            } else if (userFeedbackRes.data?.result) {
                                userFeedbacks = userFeedbackRes.data.result;
                            }
                        }

                        // Extract reviewed product IDs
                        userFeedbacks.forEach(feedback => {
                            if (feedback.productId) {
                                reviewedProductIds.add(feedback.productId);
                            }
                        });
                    } catch {
                        // If endpoint doesn't exist or error, skip
                        console.log('Could not fetch user feedbacks');
                    }

                    // Count unreviewed products
                    let unreviewed = 0;
                    for (const productId of productIds) {
                        if (!reviewedProductIds.has(productId)) {
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

