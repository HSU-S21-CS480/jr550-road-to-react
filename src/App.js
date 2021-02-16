import React from 'react';
import axios from 'axios';
import './App.css'


import SearchForm from './SearchForm';
import List from './List';
import LastSearches from './LastSearches'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const getUrl = (searchTerm, page) => 
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;


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
        data: 
          action.payload.page === 0
          ? action.payload.list
          : state.data.concat(action.payload.list),
        page: action.payload.page
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

const extractSearchTerm = url => 
  url.substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
  .replace(PARAM_SEARCH, '');


const getLastSearches = urls =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length - 1];

      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6).
    slice(0, -1);




// App Component
const App = () => {


  // Use semiPersitentState custom hook to maintain searchTerm upon reload
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  // Sets a state hook for our urls used to fetch data from
  const [urls, seturls] = React.useState([getUrl(searchTerm, 0)]);

  // Reducer hook used to populate stories list
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], page: 0, isLoading: false, isError: false }
  );

  // Async Handler for fetching stories.
  // Passes results to dispatchStories reducer hook.
  // Automatically updates when urls is changed by manipulating searchTerm, called by effect hook.
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length - 1]
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page
        }
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  // Effect Hook used to call srories handler whenever urls is changed, which
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
    handleSearch(searchTerm, 0);

    event.preventDefault();
  };

  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    seturls(urls.concat(url));
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  


  const lastSearches = getLastSearches(urls);

  // App element to be returned and displayed as webpage
  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}
      
      <List list={stories.data} onRemoveItem={handleRemoveStory} />
      
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <button type="button" onClick={handleMore}>
          More
        </button>
      )}

      
    </div>
  );
};

export default App;
