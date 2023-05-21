import Notiflix from 'notiflix';
import ImageService from './js/ImageService.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const imageService = new ImageService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.form.addEventListener('submit', onSubmitForm);
loadMoreBtn.btn.addEventListener('click', onLoadMore);

async function onSubmitForm(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  if (value === "") Notiflix.Notify.failure('No query!');
  else {
    imageService.searchQuery = value;
    imageService.resetPage();
    loadMoreBtn.show();
    clearMarkup();
    onLoadMore();
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a class="gallery__link" href="${largeImageURL}">
   <img src="${webformatURL}" alt="${tags}" width='300' height='220' loading="lazy" /> </a>
   <div class="info">
     <p class="info-item">
       <b>Likes</b>
       ${likes}
     </p>
     <p class="info-item">
       <b>Views</b>
       ${views}
     </p>
     <p class="info-item">
       <b>Comments</b>
       ${comments}
     </p>
     <p class="info-item">
       <b>Downloads</b>
       ${downloads}
     </p>
   </div>
 </div>`;
}

const lightbox = new SimpleLightbox('.gallery__link', { captionDelay: 250,
   scrollZoom: false });

function updateMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}
async function onLoadMore() {
  loadMoreBtn.disable();
  await loadMoreBtn.enable();

  return getImage();
}


async function getImage() {
  try {
   const search = await imageService.searchImage();
    const hits = await search.hits;
    if(!hits){
      loadMoreBtn.end();
      return
    }
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      throw new Error('no data')
    }

    const markupCard = await hits.reduce(
      (markup, hit) => markup + createMarkup(hit),
      ''
    );
    return updateMarkup(markupCard);
    
  } catch (error) {
    console.log(error);
    loadMoreBtn.hide();
  }
}
