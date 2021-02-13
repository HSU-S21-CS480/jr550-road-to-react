import React from 'react';
import axios from 'axios';
import './App.css'


import SearchForm from './SearchForm';
import List from './List';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';


// Custom Hook used to keep state over page reloads
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  // Effect hook used to update the local storage whenver the key or value changes
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};


// Reducer function used to handle various state changes for displaying fetched stories
const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};


// App Component
const App = () => {

  // Use semiPersitentState custom hook to maintain searchTerm upon reload
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  // Sets a state hook for our url used to fetch data from
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  // Reducer hook used to populate stories list
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  // Async Handler for fetching stories.
  // Passes results to dispatchStories reducer hook.
  // Automatically updates when url is changed by manipulating searchTerm, called by effect hook.
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  // Effect Hook used to call srories handler whenever url is changed, which
  // in turn causes the function signature of handleFetchStories to be updated,
  // which then triggers the effect.
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);


  // Remove story handler, passes instruction to stories reducer function.
  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  // Search Input handler
  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  // Submission handler
  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  // App element to be returned and displayed as webpage
  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}
      
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default App;
