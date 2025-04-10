// User type (buyer/seller/both)
export const UserRoles = {
    BUYER: 'buyer',
    SELLER: 'seller',
    BOTH: 'both'
  };
  
  // Bread freshness states
  export const BreadStates = {
    FRESH: 'fresh',
    DAY_OLD: 'day_old',
    STALE: 'stale',
    TOASTABLE: 'toastable'
  };
  
  // API response format agreement
  export const mockUser = {
    id: '',
    name: '',
    email: '',
    role: UserRoles.BUYER // Default
  };
  
  export const mockBread = {
    _id: '', // ← MongoDB uses _id instead of id
    name: '',
    price: 0,
    state: 'day_old',
    sellerId: '' // This will also be _id in relations
  };