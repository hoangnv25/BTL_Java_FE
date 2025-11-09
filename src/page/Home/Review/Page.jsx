import { useState, useEffect } from 'react'
import axios from 'axios'
import { base } from '../../../service/Base'
import { Star } from 'lucide-react'
import './Page.css'


export default function Page() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true)
                
                // Fetch reviews 4 sao và 5 sao từ API endpoint mới
                const [reviews4Response, reviews5Response] = await Promise.all([
                    axios.get(`${base}/reviews/rating/4`).catch(() => ({ data: { result: [] } })),
                    axios.get(`${base}/reviews/rating/5`).catch(() => ({ data: { result: [] } }))
                ])
                
                // Parse reviews data - handle multiple formats
                let reviews4 = reviews4Response.data?.result || reviews4Response.data?.data || []
                let reviews5 = reviews5Response.data?.result || reviews5Response.data?.data || []
                
                // Merge tất cả reviews 4-5 sao
                let reviewsData = [...reviews4, ...reviews5]
                
                if (reviewsData.length > 0) {
                    // Thử fetch users để lấy avatar
                    let usersMap = new Map()
                    try {
                        const usersResponse = await axios.get(`${base}/users`)
                        
                        const usersArray = usersResponse.data?.result || usersResponse.data?.data || usersResponse.data || []
                        usersArray.forEach(user => {
                            if (user.userName) {
                                usersMap.set(user.userName, user)
                            }
                        })
                    } catch (userErr) {
                        // Ignore error, use default avatars
                    }
                    
                    // Map reviews với user data
                    const formattedReviews = reviewsData.map(review => {
                        const fullName = review.fullName || review.user_fullName || review.userName || review.name || 'Người dùng'
                        
                        // Tìm user theo userName (fullName của review = userName của user)
                        const user = usersMap.get(fullName)
                        
                        let avatarUrl = '/ava_user.webp' // Default avatar
                        
                        if (user && user.avatar) {
                            // Xử lý URL avatar
                            if (user.avatar.startsWith('http') || user.avatar.startsWith('/') || user.avatar.startsWith('data:')) {
                                avatarUrl = user.avatar
                            } else {
                                avatarUrl = `${base}/${user.avatar}`
                            }
                        }
                        
                        return {
                            user_fullName: fullName,
                            user_img: avatarUrl,
                            comment: review.comment || review.content || '',
                            rating: Number(review.rating) || 0,
                            reviewId: review.id || review.reviewId || review.review_id
                        }
                    })
                    
                    // Sort by rating (cao -> thấp) và createdAt (mới -> cũ)
                    formattedReviews.sort((a, b) => {
                        if (b.rating !== a.rating) {
                            return b.rating - a.rating
                        }
                        return 0
                    })
                    
                    setReviews(formattedReviews)
                }
            } catch (err) {
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

    const [isTransitioning, setIsTransitioning] = useState(false)

    const goToNextReview = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === response.length - 1 ? 0 : prevIndex + 1
            )
            setTimeout(() => setIsTransitioning(false), 100)
        }, 50)
    }

    const goToPrevReview = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === 0 ? response.length - 1 : prevIndex - 1
            )
            setTimeout(() => setIsTransitioning(false), 100)
        }, 50)
    }

    const getPrevIndex = () => currentIndex === 0 ? response.length - 1 : currentIndex - 1
    const getNextIndex = () => currentIndex === response.length - 1 ? 0 : currentIndex + 1

    // Component để hiển thị rating bằng ngôi sao
    const renderStars = (rating) => {
        const stars = []
        const numRating = Number(rating) || 0
        const fullStars = Math.floor(numRating)
        const hasHalfStar = numRating % 1 !== 0
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                // Ngôi sao đầy - màu vàng
                stars.push(
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" className="star star-filled" strokeWidth={1} />
                )
            } else if (i === fullStars && hasHalfStar) {
                // Ngôi sao nửa - clipPath
                stars.push(
                    <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                        <Star size={16} fill="none" color="#d1d5db" strokeWidth={1} className="star star-empty" />
                        <Star 
                            size={16} 
                            fill="#fbbf24" 
                            color="#fbbf24"
                            strokeWidth={1}
                            className="star star-half"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                            }}
                        />
                    </div>
                )
            } else {
                // Ngôi sao rỗng - màu xám nhạt
                stars.push(
                    <Star key={i} size={16} fill="none" strokeWidth={1} color="#d1d5db" className="star star-empty" />
                )
            }
        }
        return stars
    }

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
                    <div key={`prev-${getPrevIndex()}`} className="review-item review-item-prev">
                        <div className="review-item-img">
                            <img 
                                src={prevReviewData.user_img} 
                                alt={prevReviewData.user_fullName}
                                onError={(e) => {
                                    console.error('Image load error for prev:', prevReviewData.user_img)
                                    e.target.src = '/ava_user.webp'
                                }}
                            />
                        </div>
                        <div className="review-item-content">
                            <p>"{prevReviewData.comment}"</p>
                            <div className="review-rating">
                                {renderStars(prevReviewData.rating)}
                            </div>
                            <div className="review-separator"></div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">{prevReviewData.user_fullName}</div>
                                <div className="reviewer-role">Customer</div>
                            </div>
                        </div>
                    </div>

                    {/* Next review - right side, behind */}
                    <div key={`next-${getNextIndex()}`} className="review-item review-item-next">
                        <div className="review-item-img">
                            <img 
                                src={nextReviewData.user_img} 
                                alt={nextReviewData.user_fullName}
                                onError={(e) => {
                                    console.error('Image load error for next:', nextReviewData.user_img)
                                    e.target.src = '/ava_user.webp'
                                }}
                            />
                        </div>
                        <div className="review-item-content">
                            <p>"{nextReviewData.comment}"</p>
                            <div className="review-rating">
                                {renderStars(nextReviewData.rating)}
                            </div>
                            <div className="review-separator"></div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">{nextReviewData.user_fullName}</div>
                                <div className="reviewer-role">Customer</div>
                            </div>
                        </div>
                    </div>

                    {/* Current review - center, on top */}
                    <div key={`current-${currentIndex}`} className="review-item review-item-current">
                        <div className="review-item-img">
                            <img 
                                src={currentReviewData.user_img} 
                                alt={currentReviewData.user_fullName}
                                onError={(e) => {
                                    console.error('Image load error for current:', currentReviewData.user_img)
                                    e.target.src = '/ava_user.webp'
                                }}
                            />
                        </div>
                        <div className="review-item-content">
                            <p>"{currentReviewData.comment}"</p>
                            <div className="review-rating">
                                {renderStars(currentReviewData.rating)}
                            </div>
                            <div className="review-separator"></div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">{currentReviewData.user_fullName}</div>
                                <div className="reviewer-role">Customer</div>
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