/**
 * SmartCanteen - Initial Mock Data & Seed Values
 * Designed for intermediate coders: structured, intuitive, and realistic.
 */

const SEED_CATEGORIES = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'breakfast', name: 'Breakfast', icon: '🥞' },
    { id: 'lunch', name: 'Lunch & Meals', icon: '🍛' },
    { id: 'snacks', name: 'Snacks & Fast Food', icon: '🍔' },
    { id: 'beverages', name: 'Beverages', icon: '☕' },
    { id: 'desserts', name: 'Desserts & Sweets', icon: '🍨' }
];

const SEED_MENU_ITEMS = [
    {
        id: 'item-1',
        name: 'Classic Masala Dosa',
        category: 'breakfast',
        price: 60,
        isVeg: true,
        prepTime: 8,
        inStock: true,
        rating: 4.8,
        ratingCount: 142,
        description: 'Crispy fermented crepe stuffed with spiced potato masala, served with coconut chutney & sambar.',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
        calories: 320
    },
    {
        id: 'item-2',
        name: 'Paneer Stuffed Paratha',
        category: 'breakfast',
        price: 70,
        isVeg: true,
        prepTime: 10,
        inStock: true,
        rating: 4.7,
        ratingCount: 98,
        description: 'Whole wheat flatbread stuffed with spiced cottage cheese, served with fresh curd and mixed pickle.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
        calories: 380
    },
    {
        id: 'item-3',
        name: 'Hyderabadi Chicken Biryani',
        category: 'lunch',
        price: 150,
        isVeg: false,
        prepTime: 12,
        inStock: true,
        rating: 4.9,
        ratingCount: 310,
        description: 'Dum-cooked fragrant basmati rice layered with tender marinated chicken, saffron, and aromatic spices.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        calories: 550
    },
    {
        id: 'item-4',
        name: 'Executive Veg Thali',
        category: 'lunch',
        price: 110,
        isVeg: true,
        prepTime: 7,
        inStock: true,
        rating: 4.6,
        ratingCount: 220,
        description: 'Complete wholesome meal with Paneer curry, Dal Tadka, Seasonal Sabzi, 3 Rotis, Jeera Rice, and Gulab Jamun.',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
        calories: 620
    },
    {
        id: 'item-5',
        name: 'Crispy Veg Supreme Burger',
        category: 'snacks',
        price: 65,
        isVeg: true,
        prepTime: 6,
        inStock: true,
        rating: 4.5,
        ratingCount: 185,
        description: 'Herb potato and pea patty with fresh lettuce, sliced tomatoes, creamy chipotle mayo in a toasted sesame bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        calories: 410
    },
    {
        id: 'item-6',
        name: 'Grilled Chicken Cheese Burger',
        category: 'snacks',
        price: 95,
        isVeg: false,
        prepTime: 8,
        inStock: true,
        rating: 4.8,
        ratingCount: 195,
        description: 'Juicy grilled chicken patty topped with melted cheddar cheese, caramelized onions, and BBQ sauce.',
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
        calories: 490
    },
    {
        id: 'item-7',
        name: 'Peri Peri Loaded Fries',
        category: 'snacks',
        price: 55,
        isVeg: true,
        prepTime: 5,
        inStock: true,
        rating: 4.7,
        ratingCount: 260,
        description: 'Golden crunchy potato fries tossed in fiery peri peri seasoning, drizzled with cheesy garlic sauce.',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
        calories: 340
    },
    {
        id: 'item-8',
        name: 'Masala Samosa Chaat',
        category: 'snacks',
        price: 45,
        isVeg: true,
        prepTime: 5,
        inStock: true,
        rating: 4.6,
        ratingCount: 175,
        description: 'Crushed crisp samosas topped with tangy chole (chickpeas), sweet tamarind chutney, mint dip, and sev.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        calories: 310
    },
    {
        id: 'item-9',
        name: 'Kadak Masala Chai',
        category: 'beverages',
        price: 20,
        isVeg: true,
        prepTime: 3,
        inStock: true,
        rating: 4.9,
        ratingCount: 420,
        description: 'Traditional Indian milk tea brewed with crushed ginger, green cardamom, and special CTC tea blend.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
        calories: 90
    },
    {
        id: 'item-10',
        name: 'Cold Coffee with Vanilla Scoop',
        category: 'beverages',
        price: 60,
        isVeg: true,
        prepTime: 4,
        inStock: true,
        rating: 4.8,
        ratingCount: 280,
        description: 'Rich blended espresso, chilled milk, chocolate fudge swirl, crowned with a scoop of vanilla ice cream.',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
        calories: 220
    },
    {
        id: 'item-11',
        name: 'Fresh Mango Lassi',
        category: 'beverages',
        price: 45,
        isVeg: true,
        prepTime: 4,
        inStock: true,
        rating: 4.7,
        ratingCount: 160,
        description: 'Thick yogurt smoothie blended with sweet Alphonso mango pulp and cardamom garnish.',
        image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80',
        calories: 190
    },
    {
        id: 'item-12',
        name: 'Hot Gulab Jamun (2 Pcs)',
        category: 'desserts',
        price: 40,
        isVeg: true,
        prepTime: 2,
        inStock: true,
        rating: 4.8,
        ratingCount: 190,
        description: 'Soft melt-in-the-mouth fried milk dough dumplings soaked in fragrant rose and saffron sugar syrup.',
        image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=600&q=80',
        calories: 260
    }
];

const SEED_PICKUP_SLOTS = [
    { id: 'asap', label: 'ASAP / Immediate (~10-15 mins)', value: 'ASAP' },
    { id: 'in-30', label: 'In 30 Minutes', value: '+30m' },
    { id: 'lunch-1', label: 'Lunch Recess (1:15 PM)', value: '1:15 PM' },
    { id: 'lunch-2', label: 'Lunch Recess (1:45 PM)', value: '1:45 PM' },
    { id: 'tea-break', label: 'Evening Tea Break (4:30 PM)', value: '4:30 PM' },
    { id: 'custom', label: 'Custom Time Slot', value: 'custom' }
];

const SEED_DEFAULT_STUDENT = {
    id: 'std-101',
    name: 'Arjun Sharma',
    email: 'student@campus.edu',
    password: 'student123',
    role: 'student',
    studentId: 'CS-2024-042',
    phone: '+91 98765 43210',
    walletBalance: 450.00
};

const SEED_DEFAULT_ADMIN = {
    id: 'adm-001',
    name: 'Chef Rajesh',
    email: 'admin@canteen.edu',
    password: 'admin123',
    role: 'admin',
    canteenName: 'Central Campus Food Court'
};

// Seed realistic orders showcasing the 5 flowchart status stages:
// PENDING -> CONFIRMED -> PREPARING -> READY -> COMPLETED
const SEED_ORDERS = [
    {
        id: 'ORD-9021',
        token: 'T-101',
        studentId: 'std-101',
        studentName: 'Arjun Sharma',
        studentRoll: 'CS-2024-042',
        status: 'READY', // Stage 4: Ready for pickup!
        pickupTime: '1:15 PM',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        paymentMethod: 'UPI (Google Pay)',
        paymentStatus: 'PAID',
        items: [
            { id: 'item-3', name: 'Hyderabadi Chicken Biryani', price: 150, qty: 1 },
            { id: 'item-10', name: 'Cold Coffee with Vanilla Scoop', price: 60, qty: 1 }
        ],
        subtotal: 210,
        tax: 10.50,
        total: 220.50,
        specialNotes: 'Extra raita please',
        feedback: null
    },
    {
        id: 'ORD-9022',
        token: 'T-102',
        studentId: 'std-102',
        studentName: 'Priya Verma',
        studentRoll: 'EC-2023-018',
        status: 'PREPARING', // Stage 3: Being cooked
        pickupTime: '1:30 PM',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        paymentMethod: 'Campus Digital Wallet',
        paymentStatus: 'PAID',
        items: [
            { id: 'item-1', name: 'Classic Masala Dosa', price: 60, qty: 1 },
            { id: 'item-9', name: 'Kadak Masala Chai', price: 20, qty: 2 }
        ],
        subtotal: 100,
        tax: 5.00,
        total: 105.00,
        specialNotes: 'Make dosa extra crispy',
        feedback: null
    },
    {
        id: 'ORD-9023',
        token: 'T-103',
        studentId: 'std-103',
        studentName: 'Rohan Gupta',
        studentRoll: 'ME-2024-110',
        status: 'CONFIRMED', // Stage 2: Canteen accepted
        pickupTime: 'ASAP (~10-15 mins)',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        paymentMethod: 'UPI (PhonePe)',
        paymentStatus: 'PAID',
        items: [
            { id: 'item-6', name: 'Grilled Chicken Cheese Burger', price: 95, qty: 1 },
            { id: 'item-7', name: 'Peri Peri Loaded Fries', price: 55, qty: 1 }
        ],
        subtotal: 150,
        tax: 7.50,
        total: 157.50,
        specialNotes: 'Less spice on fries',
        feedback: null
    },
    {
        id: 'ORD-9024',
        token: 'T-104',
        studentId: 'std-104',
        studentName: 'Ananya Sen',
        studentRoll: 'BT-2024-009',
        status: 'PENDING', // Stage 1: Just arrived, needs kitchen acceptance
        pickupTime: '1:45 PM',
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        paymentMethod: 'Campus Digital Wallet',
        paymentStatus: 'PAID',
        items: [
            { id: 'item-4', name: 'Executive Veg Thali', price: 110, qty: 1 },
            { id: 'item-11', name: 'Fresh Mango Lassi', price: 45, qty: 1 }
        ],
        subtotal: 155,
        tax: 7.75,
        total: 162.75,
        specialNotes: '',
        feedback: null
    },
    {
        id: 'ORD-9018',
        token: 'T-098',
        studentId: 'std-101',
        studentName: 'Arjun Sharma',
        studentRoll: 'CS-2024-042',
        status: 'COMPLETED', // Stage 5: Collected and finished
        pickupTime: '12:30 PM',
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        paymentMethod: 'Campus Digital Wallet',
        paymentStatus: 'PAID',
        items: [
            { id: 'item-5', name: 'Crispy Veg Supreme Burger', price: 65, qty: 1 },
            { id: 'item-10', name: 'Cold Coffee with Vanilla Scoop', price: 60, qty: 1 }
        ],
        subtotal: 125,
        tax: 6.25,
        total: 131.25,
        specialNotes: '',
        feedback: {
            rating: 5,
            review: 'Food was blazing hot and ready exactly on time! Loved the coffee.',
            tags: ['Hot & Fresh', 'Quick Service', 'Delicious'],
            submittedAt: new Date(Date.now() - 70 * 60 * 1000).toISOString()
        }
    }
];
