import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import Home from './components/Home';
 
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/signin' component ={LoginForm} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/' component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
