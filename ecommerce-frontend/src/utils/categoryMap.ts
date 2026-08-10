const categoryMapping: Record<string, string> = {
  // Snacks
  Biscuits: 'Snacks',
  'Dark chocolates': 'Snacks',
  Chocolates: 'Snacks',
  Chips: 'Snacks',
  Namkeen: 'Snacks',
  Cookies: 'Snacks',
  Wafers: 'Snacks',
  Crackers: 'Snacks',
  Popcorn: 'Snacks',
  Nuts: 'Snacks',
  'Dry Fruits': 'Snacks',
  Sweets: 'Snacks',
  Candy: 'Snacks',
  Confectionery: 'Snacks',
  Munchies: 'Snacks',

  // Fruits & Vegetables
  Fruits: 'Fruits & Vegetables',
  Vegetables: 'Fruits & Vegetables',
  'Fresh Fruits': 'Fruits & Vegetables',
  'Fresh Vegetables': 'Fruits & Vegetables',
  'Organic Fruits': 'Fruits & Vegetables',
  'Organic Vegetables': 'Fruits & Vegetables',
  Produce: 'Fruits & Vegetables',

  // Groceries
  Groceries: 'Groceries',
  Grocery: 'Groceries',
  Rice: 'Groceries',
  Flour: 'Groceries',
  'Cooking Oil': 'Groceries',
  Oil: 'Groceries',
  Spices: 'Groceries',
  Masala: 'Groceries',
  Pulses: 'Groceries',
  Dal: 'Groceries',
  Lentils: 'Groceries',
  Sugar: 'Groceries',
  Salt: 'Groceries',
  Grains: 'Groceries',
  Cereals: 'Groceries',
  Atta: 'Groceries',

  // Beverages
  Beverages: 'Beverages',
  'Soft Drinks': 'Beverages',
  Juices: 'Beverages',
  Tea: 'Beverages',
  Coffee: 'Beverages',
  'Energy Drinks': 'Beverages',
  Water: 'Beverages',
  'Cold Drinks': 'Beverages',

  // Dairy
  Dairy: 'Dairy',
  Milk: 'Dairy',
  Cheese: 'Dairy',
  Butter: 'Dairy',
  Yogurt: 'Dairy',
  Curd: 'Dairy',
  Paneer: 'Dairy',
  'Ice Cream': 'Dairy',

  // Bakery
  Bakery: 'Bakery',
  Bread: 'Bakery',
  Cakes: 'Bakery',
  Pastry: 'Bakery',
  Pastries: 'Bakery',

  // Personal Care
  'Personal Care': 'Personal Care',
  Skincare: 'Personal Care',
  Haircare: 'Personal Care',
  Cosmetics: 'Personal Care',
  Beauty: 'Personal Care',
  Grooming: 'Personal Care',
  Perfume: 'Personal Care',

  // Household
  Household: 'Household',
  Cleaning: 'Household',
  Detergent: 'Household',
  'Home Care': 'Household',
  Kitchen: 'Household',

  // Food & Beverages (from barcode scanner)
  'Food & Beverages': 'Food & Beverages',
  Food: 'Food & Beverages',

  // Stationery → Office Supplies
  Stationery: 'Office Supplies',
}

export function mapCategory(raw: string): string {
  return categoryMapping[raw] || raw
}
