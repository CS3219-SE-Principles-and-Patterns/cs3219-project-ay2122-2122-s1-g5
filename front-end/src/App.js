import React from 'react';
import { useEffect } from 'react';
import PeerPrepNav from './components/PeerPrepNav';
import Home from './components/home/Home';
import Login from './components/login/Login';
import { Switch, Route } from 'react-router-dom';
import Practice from './components/practice/Practice';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import useState from 'react-usestateref';
import LoadingScreen from './components/LoadingScreen';
import './css/App.css';
import axios from 'axios';
import { VALIDATE_LOGIN_URL, MATCH_GET_INTERVIEW_URL } from './Api';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export const AppContext = React.createContext();

function App() {
  // Determines whether to show loading spinner
  const [isLoading, setIsLoading] = useState(true);
  // Maintains state of user details
  const [user, setUser, userRef] = useState(null);
  // Maintains state of user's ongoing match, if any.
  const [match, setMatch, matchRef] = useState(null);

  const history = useHistory();

  // These are passed around throughout the different components
  let context = {
    user: user,
    setUser: setUser,
    userRef: userRef,
    match: match,
    matchRef: matchRef,
    setMatch: setMatch
  }

  const checkLogin = () => {
    return axios.get(VALIDATE_LOGIN_URL).then(res => res.data.data).then(data => {
      setUser(data);
      return true;
    }).catch(err => false); // No JWT cookie or invalid JWT cookie
  }

  function redirectToPractice() {
    history.push({ pathname: '/practice' });
  }

  const checkIfUserInMatch = () => {
    const EndInterViewToastMsg = () => (<p>Interview successfully resumed. Click <b>End Interview</b> to find another match.</p>)
    return axios.get(MATCH_GET_INTERVIEW_URL + `?email=${userRef.current.email}`).then(res => {
      setMatch(res.data.data);
      toast.success(EndInterViewToastMsg);
      redirectToPractice();
      return true;
    }).catch(err => false); // Not in match
  }

  // Upon page load, check if user is logged in then check if user is already in a match.
  useEffect(() => {
    checkLogin().then(isLoggedIn => {
      if (!isLoggedIn) {
        setIsLoading(false);
        return
      }

      checkIfUserInMatch().then(isInMatch => {
        setIsLoading(false);
      });
      
    }).catch(err => { });
  }, []);

  return (
    <>
      <AppContext.Provider value={context}>
        <PeerPrepNav />
        <ToastContainer pauseOnFocusLoss={false} />
        <Switch>
          <Route exact path='/' render={props => <Home />} />
          <Route path='/login' render={props => isLoading ? <LoadingScreen /> : <Login />} />
          <Route path="/practice" render={props => isLoading ? <LoadingScreen /> : <Practice />} />
          <Route path="/register" render={props => <Login isRegister={true} />} />
          <Route path="/*" render={props => {
            toast.error("You have entered an invalid route.");
            return <Home />
          }}></Route>
        </Switch>
      </AppContext.Provider>
    </>
  );
}

export default App;