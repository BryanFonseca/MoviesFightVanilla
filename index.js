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
  let response = await axios.get('http://www.omdbapi.com/', config);
  if(response.data.Error)
  {
    return [];
  }
  return response.data.Search;
}
const input = document.querySelector('#text-input');
const onInput = async (event) => 
{
  const movies = await request(event.target.value);
  if(movies)
  {
    for(let movie of movies)
    {
      const div = document.createElement('div');
      div.innerHTML = `
      <img src="${movie.Poster}"/>
      <h1>${movie.Title}</h1>
    `;
      document.querySelector('#target').appendChild(div);
    }
  }
};

//primero se ejecuta debounce y una vez la función retorna, el argumento del evento es pasado a la misma.
//cuando se ejecuta debounce la función functionRoReturn no se ejecuta.
//solo se devuelve y se usa como handler
//considerar que la linea de abajo solo se ejecuta de manera síncrona, el callback devuelto por debounce
//se ejecuta de manera asíncrona al gatillarse el evento.
input.addEventListener('input', debounce(onInput, 500));
