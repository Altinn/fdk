import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Link, Route, browserHistory, IndexRoute } from 'react-router'

import {SearchPage} from "./containers/search-resultpage/index";
import {App} from "./containers/app";

const Home = () => {
  return (
    <div>
      <Link to="search">Go to Search</Link>
    </div>
  )
}

const routes =
  (
    <Route path="/" component={App}>
      <Route path="/datasets" component={SearchPage}/>
      <IndexRoute component={SearchPage}/>
    </Route>
  );

ReactDOM.render((
<Router history={browserHistory}>
  {routes}
</Router>
), document.getElementById('root'));


/*


 const routes =
 (
 <Route path="/" component={App}>
 <IndexRoute component={SearchPage}/>
 </Route>
 );

 */