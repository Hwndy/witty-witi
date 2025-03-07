import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight, Star, Truck, Shield, RotateCcw, AlertCircle } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useProductStore from '../store/productStore';
import useReviewStore from '../store/reviewStore';
import useAuthStore from '../store/authStore';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { currentProduct, fetchProductById, isLoading: productLoading, error: productError } = useProductStore();
  const { productReviews, fetchProductReviews, addReview, isLoading: reviewsLoading, error: reviewsError } = useReviewStore();
  const { isAuthenticated, user } = useAuthStore();
  const addToCart = useCartStore(state => state.addItem);
  
  useEffect(() => {
    if (id) {
      fetchProductById(id);
      fetchProductReviews(id);
    }
  }, [id, fetchProductById, fetchProductReviews]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && currentProduct && value <= currentProduct.stock) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    if (currentProduct && quantity < currentProduct.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (currentProduct) {
      addToCart(currentProduct, quantity);
    }
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        await addReview({
          productId: id,
          rating: reviewRating,
          comment: reviewComment
        });
        setReviewComment('');
        setReviewRating(5);
        setShowReviewForm(false);
      } catch (error) {
        // Error is handled in the store
      }
    }
  };
  
  if (productLoading) {
    return (
      <div className="container py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }
  
  if (productError) {
    return (
      <div className="container py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{productError}</p>
        </div>
        <div className="text-center mt-8">
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  if (!currentProduct) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to={`/products/${currentProduct.category}`} className="hover:text-primary capitalize">
            {currentProduct.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700 font-medium truncate">{currentProduct.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={currentProduct.image.startsWith('http') ? currentProduct.image : `http://localhost:5000${currentProduct.image}`}
              alt={currentProduct.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentProduct.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < (currentProduct.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {currentProduct.rating?.toFixed(1) || '0.0'} ({currentProduct.numReviews || 0} reviews)
              </span>
            </div>
            
            <div className="text-2xl font-bold text-primary mb-6">
              ${currentProduct.price.toFixed(2)}
            </div>
            
            <p className="text-gray-700 mb-6">
              {currentProduct.description}
            </p>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${currentProduct.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`${currentProduct.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {currentProduct.stock > 0 ? `In Stock (${currentProduct.stock} available)` : 'Out of Stock'}
                </span>
              </div>
              <div className="text-sm text-gray-500">SKU: WITI-{currentProduct.id.padStart(6, '0')}</div>
            </div>
            
            {currentProduct.stock > 0 && (
              <div className="mb-8">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex">
                  <button 
                    onClick={decrementQuantity}
                    className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={currentProduct.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={currentProduct.stock === 0}
                className={`btn flex items-center justify-center ${
                  currentProduct.stock > 0 
                    ? 'btn-primary' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              <Link 
                to="/cart"
                className="btn btn-outline flex items-center justify-center"
              >
                View Cart
              </Link>
            </div>
            
            {/* Features */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">Free shipping</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">1 Year warranty</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">30-day returns</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            {isAuthenticated && (
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn btn-primary"
              >
                Write a Review
              </button>
            )}
          </div>
          
          {reviewsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{reviewsError}</p>
            </div>
          )}
          
          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">Write Your Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`h-6 w-6 ${
                            star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="input"
                    placeholder="Share your experience with this product..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowReviewForm(false)}
                    className="btn btn-outline mr-2"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={reviewsLoading}
                  >
                    {reviewsLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : productReviews.length > 0 ? (
            <div className="space-y-6">
              {productReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-bold">{review.userName}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              {!isAuthenticated && (
                <p className="mt-2 text-sm">
                  <Link to="/login" className="text-primary hover:underline">Sign in</Link> to leave a review.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;