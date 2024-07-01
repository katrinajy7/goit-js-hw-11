import { BASE_URL, options } from "./pixabay-api.js";
import axios from "axios";
import { Notify } from "notiflix/build/notiflix-notify-aio.js";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// ELEMENTS
const galleryEl = document.querySelector(".gallery");
const searchInputEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.getElementById("search-form");

let reachEnd = false;
let totalHits = 0;

const lightbox = new simpleLightbox('.lightbox', {
    captionsData: "alt",
    captionDelay: 250,  

});

function renderGallery(hits) {
    const markup = hits.map(
        ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads
        }) => {
            return `
                <a href="${largeImageURL}" class='lightbox'>
                    <div class="photo-card">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                        <div class="info">
                            <p class="info-item">
                            <b>Likes</b></p>
                               ${likes}
                            <p class="info-item">
                            <b>View</b></p>
                               ${views}
                            <p class="info-item">
                            <b>Comments</b></p>
                               ${comments}
                            <p class="info-item">
                            <b>Downloads</b></p>
                               ${downloads}
                        </div>
                    </div>
                </a>
            `;
        }
    ).join(""); // Join the array into a single string
    
    galleryEl.insertAdjacentHTML("beforeend", markup);

    // IF THE USER HAS REACHED THE END OF THE COLLECTION
    if(options.params.page * options.params.per_page >=totalHits) {
        if(!reachEnd) {
            Notify.info("We are sorry but you've reached the end of the search result");
            reachEnd = true;
        }
    }
    lightbox.refresh();
}

async function handleSubmit(e) {
    e.preventDefault();

    options.params = { ...options.params }; // Create a copy to avoid modifying original
    options.params.q = searchInputEl.value.trim();

    if (options.params.q === "") return;
    options.params.page = 1;
    galleryEl.innerHTML = "";
    reachEnd = false;

    try {
        const res = await axios.get(BASE_URL, options);
        totalHits = res.data.totalHits;

        const { hits } = res.data;

        if (hits.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query.");
        } else {
            Notify.success(`Hooray! We found ${totalHits} images.`);
            renderGallery(hits); // Render the gallery with retrieved images
        }

        searchInputEl.value = "";

    } catch (e) {
        Notify.failure(e.message); // Display error message
    }
}

async function loadmore() {
    options.params.page +=1;
    try {
        const res = await axios.get(BASE_URL, options);
        const hits = res.data.hits;
        renderGallery(hits);
    } catch (e) {
        Notify/failure(e);   
    } 
}

function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >=scrollHeight) {
        loadmore();
    }
}

searchFormEl.addEventListener("submit", handleSubmit);
window.addEventListener("scroll", handleScroll);
