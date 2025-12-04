import React, { useState, useEffect } from 'react'
import { Star, ThumbsUp, Trash2, CheckCircle, User } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Reviews = ({ movieId }) => {
  const { axios, getToken, user } = useAppContext()
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchReviews()
    if (user) {
      fetchUserReview()
    }
  }, [movieId, user, sortBy])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/reviews/movie/${movieId}?sort=${sortBy}`)
      if (data.success) {
        setReviews(data.reviews)
        setAverageRating(data.averageRating || 0)
        setTotalReviews(data.totalReviews || 0)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserReview = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/movie/${movieId}/user`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success && data.review) {
        setUserReview(data.review)
        setRating(data.review.rating)
        setReviewText(data.review.review || '')
        setShowForm(false)
      } else {
        setShowForm(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to write a review')
      return
    }
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      const { data } = await axios.post(
        '/api/reviews',
        { movieId, rating, review: reviewText },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      if (data.success) {
        toast.success(data.message)
        setUserReview(data.review)
        setShowForm(false)
        fetchReviews()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      const { data } = await axios.delete(`/api/reviews/${userReview._id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success('Review deleted')
        setUserReview(null)
        setRating(0)
        setReviewText('')
        setShowForm(true)
        fetchReviews()
      }
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const handleHelpful = async (reviewId) => {
    if (!user) {
      toast.error('Please login to mark as helpful')
      return
    }

    try {
      const { data } = await axios.post(
        `/api/reviews/${reviewId}/helpful`,
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      if (data.success) {
        fetchReviews()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderStars = (value, interactive = false, onStarClick = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onStarClick && onStarClick(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= value
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-12 sm:mt-16 md:mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Reviews & Ratings</h2>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        {totalReviews > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        )}
      </div>

      {/* User Review Form */}
      {user && (showForm || !userReview) && (
        <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 mb-6 border border-gray-700">
          <h3 className="text-lg font-medium mb-4">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating *</label>
              {renderStars(rating, true, setRating)}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows="4"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{reviewText.length}/1000</p>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-md text-sm font-medium transition"
              >
                {submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
              </button>
              {userReview && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setRating(userReview.rating)
                    setReviewText(userReview.review || '')
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* User's Existing Review */}
      {user && userReview && !showForm && (
        <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 mb-6 border border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">You</span>
                    {userReview.isVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500" title="Verified Purchase" />
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(userReview.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mb-2">{renderStars(userReview.rating)}</div>
              {userReview.review && (
                <p className="text-gray-300 text-sm mt-2">{userReview.review}</p>
              )}
            </div>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-gray-700 rounded-md transition"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-sm text-red-400 hover:text-red-300"
          >
            Edit Review
          </button>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {user ? 'No reviews yet. Be the first to review!' : 'No reviews yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.isVerified && (
                          <CheckCircle
                            className="w-4 h-4 text-green-500"
                            title="Verified Purchase"
                          />
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  {review.review && (
                    <p className="text-gray-300 text-sm mt-2">{review.review}</p>
                  )}
                </div>
                <button
                  onClick={() => handleHelpful(review._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpful || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reviews

