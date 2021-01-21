import logo from './logo.svg';
import './App.css';

// class definition
class Developer {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getName() {
    return this.firstName + ' ' + this.lastName;
  }
}

const robin = new Developer('Robin', 'Wieruch');
console.log(robin.getName());

const dennis = new Developer('Dennis', 'Wieruch');
console.log(dennis.getName());

const welcome = {
  greeting: "Hey",
  title: "React",
}

const list = [
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

//This is the app, it is similar to a "main" function but returns an html element which contains the 
// webpage. 
const App = () => {

  const handleChange = event => {
    console.log(event.target.value);
  };

  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />

      <hr />
      
      <List />

      <List />

    </div>
  );
}



//List React element definition
const List = () => 
  list.map(item => (
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
