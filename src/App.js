
import './App.css';
import React from 'react';



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



  const [searchTerm, setSearchTerm] = React.useState('');


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

      <Search onSearch={handleSearch} />

      <hr />
      
      <List list={searchedStories} />

    </div>
  );
}



//Search React element definition
const Search = props => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={props.onSearch} />
    </div>
  );
}



//List React element definition
const List = props => 
  props.list.map(item => (
    <div key={item.objectID}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </div>
  )
);



export default App;
