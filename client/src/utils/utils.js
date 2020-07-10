import moment from 'moment-timezone';
moment().tz("America/Los_Angeles").format();

export function formatTime(date){
    let millis = Date.parse(date);
    return moment(millis).tz("America/Los_Angeles").format("ddd, MMM Do, h:mm a")
}

export const groceryCategories = [
    "Uncategorized",
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
    "Other",
]

export const tips = [
    'Lists will expire in 30 days if not used',
    'Add this app to your phone homescreen from the browser menu',
    'Share a 6 letter code to invite someone to your list',
    'Adding a grocery category to list items makes shopping easier!',
    'You can print your lists - this will organize all items by category',
    'Careful: deleting a list also deletes the list for anyone who has access',
    'Copy a list link and send it to friends.  They will automatically have access.',
    '*New: Clear all checked items from list from the list trash can button',
    '*New: Unsubscribe from list, but leave active for other members, from list delete icon',

]

export default {
    tips,
}