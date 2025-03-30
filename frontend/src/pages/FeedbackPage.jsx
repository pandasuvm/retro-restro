// pages/FeedbackPage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import axios from 'axios';

const FeedbackPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // This is a mock implementation - replace with actual API call
      // await axios.post('/api/feedback', { orderId, rating, comment });
      
      // For now, just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification('Thank you for your feedback!', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      addNotification('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Rate Your Experience</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`w-10 h-10 rounded-full ${
                    rating >= value ? 'bg-yellow-400' : 'bg-gray-200'
                  } flex items-center justify-center transition-colors`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 mb-2">
              Comments (optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Tell us about your experience..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
