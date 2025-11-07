import { useState, useEffect } from 'react'
import axios from 'axios'
import { base } from '../../../service/Base'
import './Page.css'


export default function Page() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true)
                console.log('Fetching reviews from:', `${base}/reviews`)
                const response = await axios.get(`${base}/reviews`)
                
                console.log('Reviews API response:', response.data)
                
                if (response.status === 200) {
                    let reviewsData = []
                    
                    // Xử lý response có thể là { data: [...] } hoặc array trực tiếp
                    if (response.data?.data && Array.isArray(response.data.data)) {
                        reviewsData = response.data.data
                    } else if (Array.isArray(response.data)) {
                        reviewsData = response.data
                    }
                    
                    console.log('Parsed reviews data:', reviewsData)
                    
                    // Map dữ liệu từ API sang format component cần
                    const formattedReviews = reviewsData.map(review => ({
                        user_fullName: review.user_fullName || review.userName || 'Người dùng',
                        user_img: review.user_img || review.userImg || review.avatar || review.userAvatar || '/ava_user.webp',
                        comment: review.comment || '',
                        rating: review.rating || parseInt(review.rating) || 0
                    }))
                    
                    console.log('Formatted reviews:', formattedReviews)
                    setReviews(formattedReviews)
                }
            } catch (err) {
                console.error('Error fetching reviews:', err)
                console.error('Error details:', err.response?.data || err.message)
                // Không set mock data, để reviews = [] và hiển thị empty state
                setReviews([])
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [])

    // Reset currentIndex khi reviews thay đổi
    useEffect(() => {
        if (reviews.length > 0 && currentIndex >= reviews.length) {
            setCurrentIndex(0)
        }
    }, [reviews, currentIndex])

    // Sử dụng reviews từ API, không có mock data
    const response = reviews

    const goToNextReview = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === response.length - 1 ? 0 : prevIndex + 1
        )
    }

    const goToPrevReview = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? response.length - 1 : prevIndex - 1
        )
    }

    const getPrevIndex = () => currentIndex === 0 ? response.length - 1 : currentIndex - 1
    const getNextIndex = () => currentIndex === response.length - 1 ? 0 : currentIndex + 1

    if (loading) {
        return (
            <div className="review-container">
                <div className="review-loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải đánh giá...</p>
                </div>
            </div>
        )
    }

    if (response.length === 0) {
        return (
            <div className="review-container">
                <div className="review-header">
                    <h1>Đánh giá từ khách hàng</h1>
                    <p>Chưa có đánh giá nào</p>
                </div>
            </div>
        )
    }

    const prevReviewData = response[getPrevIndex()]
    const currentReviewData = response[currentIndex]
    const nextReviewData = response[getNextIndex()]

    return (
        <div className="review-container">
            <div className="review-header">
                <h1>Đánh giá từ khách hàng</h1>
                <p>Những gì khách hàng nói về chúng tôi</p>
            </div>
            
            <div className="review-carousel-container">
                <div className="review-stack">
                    {/* Previous review - left side, behind */}
                    <div className="review-item review-item-prev">
                        <div className="review-item-img">
                            <img src={prevReviewData.user_img} alt={prevReviewData.user_fullName} />
                        </div>
                        <div className="review-item-content">
                            <p>{prevReviewData.comment}</p>
                            <div className="review-separator"></div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">{prevReviewData.user_fullName}</div>
                            </div>
                        </div>
                    </div>

                    {/* Next review - right side, behind */}
                    <div className="review-item review-item-next">
                        <div className="review-item-img">
                            <img src={nextReviewData.user_img} alt={nextReviewData.user_fullName} />
                        </div>
                        <div className="review-item-content">
                            <p>{nextReviewData.comment}</p>
                            <div className="review-separator"></div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">{nextReviewData.user_fullName}</div>
                            </div>
                        </div>
                    </div>

                    {/* Current review - center, on top */}
                    <div className="review-item review-item-current">
                        <div className="review-item-img">
                            <img src={currentReviewData.user_img} alt={currentReviewData.user_fullName} />
                        </div>
                        <div className="review-item-content">
                            <p>{currentReviewData.comment}</p>
                            <div className="review-separator"></div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">{currentReviewData.user_fullName}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="carousel-nav">
                <button 
                    className="nav-btn" 
                    onClick={goToPrevReview}
                >
                    ‹
                </button>
                <button 
                    className="nav-btn" 
                    onClick={goToNextReview}
                >
                    ›
                </button>
            </div>
        </div>
    )
}