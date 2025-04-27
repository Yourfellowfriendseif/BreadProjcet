/**
 * @typedef {Object} User
 * @property {string} _id - MongoDB ID
 * @property {string} username - Unique username
 * @property {string} email - Unique email
 * @property {string} [phone_number] - Optional phone number
 * @property {string} [photo_url] - Profile picture URL
 * @property {'buyer' | 'seller' | 'both'} role - User role
 * @property {string} createdAt - ISO creation date
 * @property {string} [updatedAt] - ISO update date
 */

/**
 * @typedef {Object} BreadPost
 * @property {string} _id - MongoDB ID
 * @property {'sell' | 'request'} post_type - Listing type
 * @property {'fresh' | 'day_old' | 'stale'} status - Condition (changed from bread_status)
 * @property {string} category - Food category (new)
 * @property {string} description - Detailed description (new)
 * @property {string[]} imageIds - Array of image IDs (changed from photo_url)
 * @property {number} quantity - Available quantity
 * @property {Object} location - GeoJSON location
 * @property {'Point'} location.type - Always 'Point'
 * @property {[number, number]} location.coordinates - [longitude, latitude]
 * @property {string} sellerId - Reference to User._id
 * @property {string} createdAt - ISO creation date
 * @property {User} [user] - Populated user data
 * @property {boolean} [reserved] - Reservation status (new)
 * @property {string} [reservedBy] - User ID who reserved (new)
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {number} [status] - HTTP status code
 * @property {Array<{field: string, message: string}>} [errors] - Validation errors
 * @property {string} [conflictField] - 'email' or 'username' for 409 errors
 * @property {boolean} [isNetworkError] - True for network errors
 */

/**
 * @typedef {Object} RegisterFormData
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} [phone_number]
 * @property {string} [photo_url]
 */

/**
 * @typedef {Object} BreadPostFormData
 * @property {'sell'|'request'} post_type
 * @property {'fresh'|'day_old'|'stale'} bread_status
 * @property {string} photo_url
 * @property {number} quantity
 * @property {Object} location
 * @property {'Point'} location.type
 * @property {[number, number]} location.coordinates [lng, lat]
 */