import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useState } from 'react';
import Login from './components/Login';
import Home from './components/profil/Home';
import NavigBar from './components/NavigBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddUser from './components/user/AddUser';
import UsersList from './components/user/UsersList';
import Professeur from './components/professeur/Professeur';
import Annee from './components/annee/Annee';
import Etudiant from './components/etudiant/Etudiant';
import Filiere from './components/filiere/Filiere';
import Matiere from './components/matiere/Matiere';
import ReleveControle1 from './components/note/RleveControle';
import FicheSynthetique from './components/note/FicheSynthetique';
import RecapulatifControle from './components/note/RecapulatifControle';
import RecapulatifPratique from './components/note/RecapulatifPratique';
import RecapulatifTheorique from './components/note/RecapulatifTheorique';
import Bulletin from './components/note/Bulletin';
import ModalitePassage from './components/note/ModalitePassage';
import ModaliteDiplome from './components/note/ModaliteDiplome';

export const loginContext = React.createContext()

function App() {

  const [isLoggedin, setLoggedIn] = useState('false')
  return (
    <div className="App">
      <loginContext.Provider value={{ isLoggedin, setLoggedIn }} >
        <Router>
          <NavigBar />
          <Switch>
            <Route path='/' exact>
              <Login />
            </Route>
            <Route path='/home' exact>
              <Home />
            </Route>
            <Route path='/adduser'>
              <AddUser />
            </Route>
            <Route path='/userslist'>
              <UsersList />
            </Route>
            <Route path='/professeurs'>
              <Professeur />
            </Route>
            <Route path='/ReleveControle'>
              <ReleveControle1 />
            </Route>
            <Route path='/FicheSynthetique'>
              <FicheSynthetique />
            </Route>
            <Route path='/RecapulatifControle'>
              <RecapulatifControle />
            </Route>
            <Route path='/RecapulatifPratique'>
              <RecapulatifPratique />
            </Route>
            <Route path='/RecapulatifTheorique'>
              <RecapulatifTheorique />
            </Route>
            <Route path='/Bulletins'>
              <Bulletin />
            </Route>
            <Route path='/ModalitePassage'>
              <ModalitePassage />
            </Route>
            <Route path='/ModaliteDiplome'>
              <ModaliteDiplome />
            </Route>
            <Route path='/annees'>
              <Annee />
            </Route>
            <Route path='/etudiants'>
              <Etudiant />
            </Route>
            <Route path='/filieres'>
              <Filiere />
            </Route>
            <Route path='/matieres'>
              <Matiere />
            </Route>
          </Switch>
        </Router>
      </loginContext.Provider>
    </div>
  );
}

export default App;
