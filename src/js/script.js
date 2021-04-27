const select = {
  booksWrapper: '.books-list',
  bookTemlate: '#template-book',
  filters: '.filters',
  bookClickable: '.book__image'
};
const classNames = {
  favorite: 'favorite',
  hidden: 'hidden'
};
const atribute = {
  dataId: 'data-id'
};

const templates = {
  booksTemplate: Handlebars.compile(document.querySelector(select.bookTemlate).innerHTML)
};

const settings = {
  ratingLowestBg: 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)',
  ratingLowBg: 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)',
  ratingMiddleBg: 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)',
  ratingHightBg: 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)'
};

class BooksList {
  constructor() {
    const thisBook = this;

    thisBook.initData();
    thisBook.getElements();
    thisBook.renderInMenu();
    thisBook.initData();
    thisBook.initActions();
  }

  initData() {
    const thisBook = this;
    thisBook.data = dataSource.books;


  }

  getElements() {
    const thisBook = this;
    thisBook.dom = {};
    thisBook.dom.bookList = document.querySelector(select.booksWrapper);
    thisBook.dom.filters = document.querySelector(select.filters);
    thisBook.filters = [];
    thisBook.favoriteBooks = [];
  }



  renderInMenu() {
    const thisBook = this;

    for(let book of thisBook.data) {
      book.ratingBgc = thisBook.determineRatingBgc(book.rating);
      book.ratingWidth = book.rating * 10;
      console.log(book);
      const generatedHTML = templates.booksTemplate(book);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisBook.dom.bookList.appendChild(generatedDOM);
    } 
  }
  

  initActions() {
    const thisBook = this;
    const favoriteBooks = [];
    thisBook.dom.bookList.addEventListener('dblclick', (event) => {
      event.preventDefault();
      let clickedBook = event.target.parentElement.parentElement;
      let dataId = clickedBook.getAttribute(atribute.dataId);
      if (!clickedBook.classList.contains(classNames.favorite)) {
        clickedBook.classList.add(classNames.favorite);
        favoriteBooks.push(dataId);
        console.log(favoriteBooks);

      } else {
        clickedBook.classList.remove(classNames.favorite);
        favoriteBooks.splice(favoriteBooks.indexOf(dataId), 1);
        console.log(favoriteBooks);
      }
    });

    thisBook.dom.filters.addEventListener('change', (event) => {
      event.preventDefault();
      const clickedForm = event.target;
      const bookIndex = thisBook.filters.indexOf(clickedForm.value);
      if (event.target.tagName == 'INPUT', event.target.name == 'filter', event.target.type == 'checkbox') {
        if (event.target.checked) {
          thisBook.filters.push(clickedForm.value);
        } else {
          thisBook.filters.splice(bookIndex, 1);
        }
      }
      thisBook.filterBooks();
    });
  }

  filterBooks() {
    const thisBook = this;

    for (let book of thisBook.data) {
      const bookCover = document.querySelector(`.book__image[data-id="${book.id}"]`);  

      let shouldBeHidden = false;
      for (const filter of thisBook.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }
      if (shouldBeHidden) {
        bookCover.classList.add('hidden');
      } else {
        bookCover.classList.remove('hidden');
      }
    }
  }

  determineRatingBgc(rating) {
    let background = '';
    if (rating < 6) {
      background = settings.ratingLowestBg;
    } else if (rating > 6 && rating <= 8) {
      background = settings.ratingLowBg;
    } else if (rating > 8 && rating <= 9) {
      background = settings.ratingMiddleBg;
    } else if (rating > 9) {
      background = settings.ratingHightBg;
    }
    return background;
  }

}

const app = {
  init: function() {
    new BooksList();
  }
};

app.init();