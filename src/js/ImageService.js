import axios from 'axios';

const API_KEY = '36494115-429f42e0991e0d4dcacf7517d';
const URL = 'https://pixabay.com/api/';

export default class ImageService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async searchImage() {
    try {
      const response = await axios.get(
         `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
       );
   
       this.incrementPage();
   
       return await response.data;
    } catch (error) {
      console.log(error)
    }
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
