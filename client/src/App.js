import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link, NavLink, Redirect, Switch } from 'react-router-dom';

import { Container, Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Card from "./components/Card";
import AppBar from "./components/AppBar";
import UserPage from "./components/UserPage";
import PostDetails from "./components/PostDetails"
import Chat from './components/Chat';

import UserContext from './UserContext';
import authService from './services/authService';

function App() {
  const useStyles = makeStyles((theme) => ({
    appBar: {
      marginBottom: "110px"
    },
  }));

  const [user, setUser] = useState(null);
  //const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('user');
    console.log('lul');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  });


  const logIn = (userObject) => {
    setUser(userObject);
    //setLoggedIn(true);
  }

  const logOut = async () => {
    localStorage.clear();
    await authService.logOut();
    setUser(null);
    //setLoggedIn(false);
  }

  const classes = useStyles();

  const isLoggedIn = user;
  return (
    <UserContext.Provider value={{ user, logIn, logOut, }}>
      <BrowserRouter>

        <Switch>

          <Route path="/" exact>
            {isLoggedIn ? (
              <>
                <Grid className={classes.appBar}>
                  <AppBar />
                </Grid>
                <Grid container direction={'column'} alignItems={'center'}>
                  <Card />
                </Grid>
              </>
            ) : (<Redirect to="/login" />)}
          </Route>

          <Route path="/p/:id" >
            <Grid className={classes.appBar}>
              <AppBar />
            </Grid>
            <PostDetails />
          </Route>
          <Route path="/profile/:id" component={UserPage} ></Route>

          <Route path="/inbox" exact >
            <Grid className={classes.appBar}>
              <AppBar />
            </Grid>
            <Chat />
          </Route>

          <Route path="/register">
            {isLoggedIn ? (<Redirect to="/" />) : (<SignUp />)}
          </Route>
          <Route path="/login">
            {isLoggedIn ? (<Redirect to="/" />) : (<SignIn />)}
          </Route>
        </Switch>

      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;