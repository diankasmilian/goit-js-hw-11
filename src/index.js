import Notiflix from 'notiflix';
// import { searchImage } from './js/api';
import ImageService from './js/ImageService.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';

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

console.log(loadMoreBtn.btn);

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
    getImage();
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
   <img src="${webformatURL}" alt="${tags}" width='300' height='220' loading="lazy" />
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

function updateMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}
function onLoadMore() {
  loadMoreBtn.disable();

  return getImage();
}

async function getImage() {
  try {
    loadMoreBtn.disable();
    const search = await imageService.searchImage();
    const hits = await search.hits;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    const markupCard = await hits.reduce(
      (markup, hit) => markup + createMarkup(hit),
      ''
    );

    return updateMarkup(markupCard);
  } catch (error) {
    console.log(error);
  }
}
