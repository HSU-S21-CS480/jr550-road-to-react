import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav, Navbar, FormControl, Form, Button, NavDropdown } from 'react-bootstrap';

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

  //see https://react-bootstrap.github.io/layout/grid/ for how to do basic layout in Bootstrap
  return (
    <Container>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
      </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Row>
        <Col>
          <h1>{welcome.greeting} {welcome.title}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <label htmlFor="search">Search: </label>
        </Col>
        <Col>
          <input id="search" type="text" onChange={handleChange} />
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col>
          <List />
        </Col>
      </Row>
    </Container >

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
