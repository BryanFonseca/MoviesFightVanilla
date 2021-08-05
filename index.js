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
  console.log(response.data);
}

const input = document.querySelector('#text-input');
let timeoutId;
const onInput = (event) => 
{
  if(timeoutId)
  {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {request(event.target.value)}, 1000);
};
input.addEventListener('input', onInput);

