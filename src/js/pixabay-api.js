export const BASE_URL ="https://pixabay.com/api/";
const API_KEY ="44687970-b5fa7ba4f7450f8a1c5a71874";

export const options = {
    params: {
        key: API_KEY,
        q: "",
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: 1,
        per_page: 40,
    },
};