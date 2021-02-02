
import './App.css';
import React from 'react';
import axios from 'axios';

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

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );
  
  //Use reducer function to handle state change
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );
  

  //Sets a callback hook used to fetch stories according to searchTerm
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({type: 'STORIES_FETCH_INIT'}); 

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: `STORIES_FETCH_SUCCESS`,
        payload: result.data.hits
      });

    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
             
  }, [url]);



  //Triggers when handleFetchStories is updated, which happens when searchTerm is updated. 
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



  //Handler for updating search term
  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  }

  //Handler for submitting searchTerm
  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  
  


  //Return the HTML element which contains our webpage
  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        className="button_small"
      />


      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

    </div>
  );
}


const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  className
}) => (
  <form onSubmit={onSearchSubmit} className="search-form">
        <InputWithLabel
          id="search"
          value={searchTerm}
          isFocused
          onInputChange={onSearchInput}
        >
          <strong>Search:</strong>
        </InputWithLabel>

        <button type="submit" disabled={!searchTerm} className={className}>
          Submit
        </button>
      </form>
)


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
    <label htmlFor={id} className="label">
      {children}
    </label>
    &nbsp;
    
    <input
      id={id} 
      type={type}
      value={value} 
      autoFocus={isFocused}
      onChange={onInputChange}
      className="input" 
    />
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
  
    <div className="item">
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button type="button" onClick={() => onRemoveItem(item)} className="button_small">
          Dismiss
        </button>
      </span>
    </div>
  );





export default App;
