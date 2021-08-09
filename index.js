//API key: fd6fe8b7
/*
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
*/

createAutoComplete({
  searchingFor: 'movie',
  root: document.querySelector('.autocomplete'),
  RenderOption: (movie) => 
  {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}"/>
      ${movie.Title}
      (${movie.Year})
      `;
  },
  GetInputValue: (movie) =>
  {
    return movie.Title;
  },
  OnOptionSelect: (movie) => 
  {
    OnMovieSelect(movie);
  },
  Request: async (searchTerm) =>
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
});

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
