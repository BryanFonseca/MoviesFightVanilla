//config is specific to the current application
const createAutoComplete = ({ 
  searchingFor,
  root, 
  RenderOption, 
  OnOptionSelect, 
  GetInputValue,
  Request
}) => 
{
  root.innerHTML = `
<label><b>Search for a ${searchingFor}</b></label>
<input class="input" type="text">
<div class="dropdown">
	<div class="dropdown-menu">
	  <div class="dropdown-content results">
	  </div>
	</div>
      </div>
      <div id="target"></div>
`;

  const input = root.querySelector('.input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  const onInput = async (event) => 
  {
    if(event.target.value)
    {
      const items = await Request(event.target.value);

      if(!items.length)
      {
	dropdown.classList.remove('is-active');
	return;
      }

      resultsWrapper.innerHTML = '';
      dropdown.classList.add('is-active');
      if(items)
      {
	for(let item of items)
	{
	  const option = document.createElement('a');
	  option.classList.add('dropdown-item');
	  option.innerHTML = RenderOption(item);
	  resultsWrapper.appendChild(option);
	  option.addEventListener('click', () => {
	    dropdown.classList.remove('is-active');
	    input.value = GetInputValue(item);
	    OnOptionSelect(item);
	  })
	}
      }
    }
    else
    {
      dropdown.classList.remove('is-active');
    }
  };

  //primero se ejecuta debounce y una vez la función retorna, el argumento del evento es pasado a la misma.
  //cuando se ejecuta debounce la función functionRoReturn no se ejecuta.
  //solo se devuelve y se usa como handler
  //considerar que la linea de abajo solo se ejecuta de manera síncrona, el callback devuelto por debounce
  //se ejecuta de manera asíncrona al gatillarse el evento.
  input.addEventListener('input', debounce(onInput, 500));
  input.addEventListener('click', checkClicked(onInput));

  document.addEventListener('click', (event) => {
    if(!root.contains(event.target))
    {
      dropdown.classList.remove('is-active');
      input.removeEventListener('click', checkClicked(onInput));
      input.addEventListener('click', checkClicked(onInput));
    }
  }) 
}
