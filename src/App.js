
import './App.css';
import React from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';




//Custom React Hook that combines a state hook with an effect hook
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );


  //Saves key and value to local storage whenever modified
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}


//Reducer function, used to handle multiple tranisitions of state
const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        )
      };
    default:
      throw new Error();
  }
}





//This is the app, it is similar to a "main" function but returns an html element which contains the 
// webpage. 
const App = () => {



  //Assign custom hook for search bar
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );
  

  //Use Effect Hook to set up initial stories, will trigger when searchTerm is changed.
  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;

    dispatchStories({type: 'STORIES_FETCH_INIT'})  

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then(response => response.json())
      .then(result => {
        dispatchStories({
          type: `STORIES_FETCH_SUCCESS`,
          payload: result.hits
        });
      })
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }));

  }, [searchTerm]);


  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);


  //Remove story callback function
  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }



  //Search Callback function
  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  
  


  //Return the HTML element which contains our webpage
  return (
    <div className="App">
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      

      <hr />


      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

    </div>
  );
}



//Search React element definition
const InputWithLabel = ({id, value, type = 'text', onInputChange, isFocused, children}) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
  <>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    
    <input
      id={id} 
      type={type}
      value={value} 
      autoFocus={isFocused}
      onChange={onInputChange} />
  </>
  );
};




//List React element definition
const List = ({ list, onRemoveItem }) => 
list.map(item => (
  <Item 
    key={item.objectID} 
    item={item} 
    onRemoveItem={onRemoveItem} 
  />
));
  

const Item = ({ item, onRemoveItem }) => (
  
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  );





export default App;
