/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} username
 * @property {string} email
 * @property {string} [photo_url]
 * @property {string} [phone_number]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} BreadPost
 * @property {string} _id
 * @property {User} user
 * @property {string} description
 * @property {number} quantity
 * @property {string} quantity_unit
 * @property {'fresh'|'day_old'|'expired'} status
 * @property {'sell'|'request'} post_type
 * @property {string[]} [images]
 * @property {Object} location
 * @property {string} location.type
 * @property {[number, number]} location.coordinates
 * @property {string} [reserved_by]
 * @property {boolean} [reserved]
 * @property {number} [distance]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Message
 * @property {string} _id
 * @property {string} sender
 * @property {string} recipient
 * @property {string} content
 * @property {boolean} read
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Chat
 * @property {string} _id
 * @property {User[]} participants
 * @property {Message} lastMessage
 * @property {number} unreadCount
 */

/**
 * @typedef {Object} Notification
 * @property {string} _id
 * @property {string} user
 * @property {'post_reserved'|'reservation_cancelled'|'new_message'} type
 * @property {string} message
 * @property {boolean} read
 * @property {BreadPost} [post]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {number} [status]
 * @property {Object} [errors]
 * @property {string} [conflictField]
 * @property {boolean} [isNetworkError]
 */

export {};
