/**
 * @typedef {Object} BreadProduct
 * @property {string} _id
 * @property {string} name
 * @property {'baguette' | 'sourdough' | 'ciabatta'} type
 * @property {number} price
 * @property {'fresh' | 'day_old' | 'stale'} state
 * @property {string} sellerId
 * @property {string} createdAt - ISO date string
 * @property {string[]} [images]
 */

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {'buyer' | 'seller' | 'both'} role
 * @property {string} createdAt
 */