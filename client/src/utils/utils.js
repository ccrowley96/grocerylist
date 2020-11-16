import moment from 'moment-timezone';

export function formatTime(date){
    let millis = Date.parse(date);
    return moment(millis).format("ddd, MMM Do, h:mm a")
}

export const groceryCategories = [
    "Baking",
    "Beverages",
    "Bread/Bakery",
    "Canned Goods",
    "Cereal/Breakfast",
    "Condiments",
    "Dairy/Dairy Free",
    "Deli",
    "Frozen Foods",
    "Fruits & Vegetables",
    "Meat & Seafood",
    "Non-Food Items",
    "Pasta/Rice",
    "Personal Care",
    "Snacks",
    "Sweets/Desserts",
    "Spices",
].map(cat => cat.toUpperCase())

export const tips = [
    'Lists will expire in 6 months if not used',
    'Add this app to your phone home screen from the browser menu',
    'Share a 6 letter code to invite someone to your list',
    'Adding a grocery category to list items makes shopping easier!',
    'You can print your lists - this will organize all items by category',
    'Careful: deleting a list also deletes the list for anyone who has access',
    'Copy a list link and send it to friends.  They will automatically have access.',
    'Clear all checked items from list using the list trash can button',
    'Unsubscribe from list, but leave active for other members, from list delete icon',
    "Backup your list codes!  Make sure to save your codes so you don't access to your lists."
]

export default {
    tips,
}