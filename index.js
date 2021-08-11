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

const autoCompleteConfig = {
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
}
createAutoComplete({
  ...autoCompleteConfig,
  searchingFor: 'movie',
  root: document.querySelector('#left-autocomplete'),
  OnOptionSelect: (movie) => 
  {
    document.querySelector('.tutorial').classList.add('is-hidden');
    OnMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }
});

createAutoComplete({
  ...autoCompleteConfig,
  searchingFor: 'movie',
  root: document.querySelector('#right-autocomplete'),
  OnOptionSelect: (movie) => 
  {
    document.querySelector('.tutorial').classList.add('is-hidden');
    OnMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  }
});

let leftMovie;
let rightMovie;
const OnMovieSelect = async (movie, summaryTarget, side) =>
{
  const config = 
    {
      params: {
	apikey: 'fd6fe8b7',
	i: movie.imdbID
      }
    }
  let response = await axios.get('http://www.omdbapi.com/', config)
  summaryTarget.innerHTML = movieTemplate(response.data);

  if(side === 'left')
  {
    leftMovie = response.data;
  }
  else
  {
    rightMovie = response.data;
  }

  if(leftMovie && rightMovie)
  {
    runComparison();
  }
};

const runComparison = () =>
{
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => 
    {
      const rightStat = rightSideStats[index];

      const leftSideValue = leftStat.dataset.value;
      const rightSideValue = rightStat.dataset.value;

      if(rightSideValue > leftSideValue)
      {
	leftStat.classList.remove('is-primary');
	leftStat.classList.add('is-warning');
      }
      else
      {
	rightStat.classList.remove('is-primary');
	rightStat.classList.add('is-warning');
      }
    })
};

const movieTemplate = (movieDetail) =>
{
  const awards = movieDetail.Awards.split(' ').reduce((accumulator, word) => {
    const value = parseInt(word);

    if(isNaN(value))
    {
      return accumulator;
    }
    return accumulator + value;
  }, 0)
  console.log(awards);


  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

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
  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value=${metaScore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IDMB Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
  return content;
}
