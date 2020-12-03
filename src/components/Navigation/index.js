import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';

const Navigation = () => (
    <div className="Navigation">
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <div>
        <Link to={ROUTES.HOME}>Home</Link>

        <Link to={ROUTES.ACCOUNT}>Account</Link>

        <Link to={ROUTES.ADMIN}>Admin</Link>

        <SignOutButton />
    </div>
);

const NavigationNonAuth = () => (
    <div>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </div>
);

export default Navigation;