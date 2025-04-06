export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://witty-witti-backend.onrender.com/api';

export const UPLOAD_URL = `${API_BASE_URL}/uploads`;

export const DEFAULT_AVATAR = '/assets/default-avatar.png';

export const ITEMS_PER_PAGE = 12;

export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DEFAULT_PRODUCT_IMAGE = 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/placeholder/product';
// or
export const DEFAULT_PRODUCT_IMAGE = '/assets/placeholder-product.png'; // Local fallback
