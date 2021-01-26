
import './App.css';
import React from 'react';


//Custom React Hook that combines a state hook with an effect hook
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}



//This is the app, it is similar to a "main" function but returns an html element which contains the 
// webpage. 
const App = () => {

  //List of Objects
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];


  //Assign custom hooks just like built-in hooks
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  //Search Callback function
  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  
  //Filter used for searching
  const searchedStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );



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
      
      <List list={searchedStories} />

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
const List = ({ list }) => list.map(item => <Item key={item.objectID} item={item} />);
  

const Item = ({ item }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </div>
);




export default App;
