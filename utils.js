function debounce(callback, delay = 1000)
{
  let timeoutId;
  let functionToReturn = (...args) =>
  {
    if(timeoutId)
    {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
  return functionToReturn;
}

function checkClicked (callback)
{
  let clicked = false;
  let functionToReturn = (...args) =>
  {
    if(!clicked)
    {
      callback.apply(null, args);
    }
    clicked = true;
  }
  return functionToReturn;
}
