import Notiflix from "notiflix";

export default class LoadMoreBtn {
   static classes = {
     hidden: 'hidden',
   };
   constructor({ selector, isHidden = false }) {
     this.btn = document.querySelector(selector);
     if (isHidden) this.hide();
   }
 
   hide() {
     this.btn.classList.add(LoadMoreBtn.classes.hidden);
   }
 
   show() {
     this.btn.classList.remove(LoadMoreBtn.classes.hidden);
   }
 
   disable() {
     this.btn.disabled = true;
     this.btn.textContent = 'Loading...';
   }
 
   enable() {
     this.btn.disabled = false;
     this.btn.textContent = 'Load More';
   }
 
   end() {
    this.button.disabled = true;
    this.button.textContent = "The end!";
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
 }
};