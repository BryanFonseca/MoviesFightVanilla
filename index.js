//API key: fd6fe8b7
let request = async (searchTerm) =>
{
  let config = 
    {
      params: 
      {
	apikey: 'fd6fe8b7',
	s: searchTerm 
      }
    };
  //posiblemente añadir try-catch para eliminar el error en GET
  let response = await axios.get('http://www.omdbapi.com/', config);
  if(response.data.Error)
  {
    return [];
  }
  return response.data.Search;
}
const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label><b>Search for a movie</b></label>
<input class="input" type="text">
<div class="dropdown">
	<div class="dropdown-menu">
	  <div class="dropdown-content results">
	  </div>
	</div>
      </div>
      <div id="target"></div>
`
;
const input = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async (event) => 
{
  const movies = await request(event.target.value);

  if(!movies.length)
  {
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = '';
  dropdown.classList.add('is-active');
  if(movies)
  {
    for(let movie of movies)
    {
      const option = document.createElement('a');

      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

      option.classList.add('dropdown-item');
      option.innerHTML = `
      <img src="${imgSrc}"/>
      ${movie.Title}
      `;
      resultsWrapper.appendChild(option);

      option.addEventListener('click', () => {
	dropdown.classList.remove('is-active');
	input.value = movie.Title;
	OnMovieSelect(movie);
      })
    }
  }
};

//primero se ejecuta debounce y una vez la función retorna, el argumento del evento es pasado a la misma.
//cuando se ejecuta debounce la función functionRoReturn no se ejecuta.
//solo se devuelve y se usa como handler
//considerar que la linea de abajo solo se ejecuta de manera síncrona, el callback devuelto por debounce
//se ejecuta de manera asíncrona al gatillarse el evento.
input.addEventListener('input', debounce(onInput, 500));
input.addEventListener('click', onInput)

document.addEventListener('click', (event) => {
  if(!root.contains(event.target))
  {
    dropdown.classList.remove('is-active');
  }
}) 

const OnMovieSelect = async movie =>
{
  const config = 
    {
      params: {
	apikey: 'fd6fe8b7',
	i: movie.imdbID
      }
    }
  let response = await axios.get('http://www.omdbapi.com/', config)
  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
}

const movieTemplate = (movieDetail) =>
{
  const content = `
  <article class="media">
    <figure class="media-left">
      <p class="image">
	<img src="${movieDetail.Poster}" alt="">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
	<h1>${movieDetail.Title}</h1>
	<h4>${movieDetail.Genre}</h1>
	<p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IDMB Rating</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
  return content;
}
