export const mockUsers = [
    {
      _id: '507f1f77bcf86cd799439012', // MongoDB ObjectID format
      name: 'Bakery King',
      email: 'bakery@example.com',
      password: '$2a$10$hashedPassword', // Simulate hashed password
      role: 'seller',
      createdAt: new Date('2023-05-15T10:00:00Z').toISOString(), // MongoDB stores dates as ISO strings
      updatedAt: new Date('2023-05-15T10:00:00Z').toISOString()
    },
    {
      _id: '507f1f77bcf86cd799439013',
      name: 'Bread Lover',
      email: 'customer@example.com',
      password: '$2a$10$hashedPassword',
      role: 'buyer',
      createdAt: new Date('2023-05-16T11:30:00Z').toISOString(),
      updatedAt: new Date('2023-05-16T11:30:00Z').toISOString()
    }
  ];
  
  export const mockBreads = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Artisan Baguette',
      type: 'baguette',
      price: 3.50,
      state: 'day_old',
      sellerId: '507f1f77bcf86cd799439012', // References user._id
      createdAt: new Date('2023-05-20T08:15:00Z').toISOString(),
      images: ['baguette.jpg'] // Array of strings - common in MongoDB
    },
    {
      _id: '507f1f77bcf86cd799439014',
      name: 'Sourdough Loaf',
      type: 'sourdough',
      price: 5.99,
      state: 'fresh',
      sellerId: '507f1f77bcf86cd799439012',
      createdAt: new Date('2023-05-21T09:00:00Z').toISOString(),
      images: ['sourdough.jpg']
    }
  ];