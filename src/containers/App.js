import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import { BrowserRouter as Router } from 'react-router-dom';
import Main from './Main';
import Navbar from './Navbar';
import {setCurrentUser, setAuthorizationToken} from '../store/actions/auth';
import jwtDecode from 'jwt-decode';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#831112',
      main: '#6c0e0f',
      dark: '#550b0c',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffae1a',
      main: '#ffa500',
      dark: '#e69500',
      contrastText: '#212121',
    },
  },
});


const store = configureStore();

if(localStorage.jwtToken) {
	setAuthorizationToken(localStorage.jwtToken);
	// prevent someone from manually tampering with the key of jwtToken in localStorage
	try {
		store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
	} catch(e) {
		store.dispatch(setCurrentUser({}));
	}
}

const App = () => (
	<MuiThemeProvider theme={muiTheme}>
  	<Provider store={store}>
  		<Router>
  			<div className="mdl_content">
          <Navbar />
  				<Main />
  			</div>
  		</Router>
  	</Provider>
	</MuiThemeProvider>
);

export default App;
