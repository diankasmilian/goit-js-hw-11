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

  if (value === "") {
    Notiflix.Notify.failure('No query!');
    return
  }
    loadMoreBtn.hide();
    imageService.searchQuery = value;
    imageService.resetPage();
    clearMarkup();
    await getImage();

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
  await getImage();
  await loadMoreBtn.enable();
}


async function getImage() {
  try {
    const search = await imageService.searchImage();
    const hits = await search.hits;
    const total = await search.totalHits;
    // const numberPage = Math.ceil(total / 40);
    const numberPage = (imageService.page - 1) * 40;

      if(hits.length === 0){
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.hide();
        return
      } 

      if (imageService.page === 2) {
        Notiflix.Notify.success(`Hooray! We found ${total} images.`)
      }
  
      const markupCard = await hits.reduce(
          (markup, hit) => markup + createMarkup(hit),
          ''
        );
  
        loadMoreBtn.show();

        if (numberPage >= total) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          loadMoreBtn.hide();
        } 

        return updateMarkup(markupCard);
    

    
        
  } catch (error) {
    console.log(error);
    loadMoreBtn.hide();
  }
};

