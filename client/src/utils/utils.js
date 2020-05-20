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
    "Meats",
    "Non-Food Items",
    "Pasta/Rice",
    "Produce",
    "Snacks",
    "Sweets/Desserts",
    "Spices",
    "Other",
]