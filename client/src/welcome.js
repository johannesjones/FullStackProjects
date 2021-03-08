// src/welcome.js
import { HashRouter, Route } from "react-router-dom";
import Registration from './registration';
import Login from "./login";
import ResetPassword from './resetPassword';

// 'dumb'/'presentational' component
export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to RHIZOME</h1>
            <img src="Rhizom.jpeg" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path='/resetPassword' component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}