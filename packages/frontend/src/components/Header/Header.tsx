import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../store/store-hooks';
import { User } from '../../types/user';

export function Header() {
  const { user } = useStore(({ common }) => common);

  return (
    <React.Fragment>
      <nav className='navbar navbar-light'>
        <div className='container'>
          <Link className='navbar-brand' to='/'>
            conduit
          </Link>
          <ul className='nav navbar-nav pull-xs-right'>
            <NavItem text='Home' href='/' />

            {user.match({
              none: () => <GuestLinks />,
              some: (user) => <UserLinks user={user} />,
            })}
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
}

function NavItem({ text, href, icon }: { text: string; href: string; icon?: string }) {
  return (
    <li className='nav-item'>
      <NavLink end to={href} className='nav-link'>
        {icon && <i className={icon}></i>}&nbsp;
        {text}
      </NavLink>
    </li>
  );
}

function GuestLinks() {
  return (
    <React.Fragment>
      <NavItem text='Sign in' href='/login' />
      <NavItem text='Sign up' href='/register' />
    </React.Fragment>
  );
}

function UserLinks({ user: { username } }: { user: User }) {
  return (
    <React.Fragment>
      <NavItem text='New Article' href='/editor' icon='ion-compose' />
      <NavItem text='Settings' href='/settings' icon='ion-gear-a' />
      <NavItem text={`${username}`} href={`/profile/${username}`} />
    </React.Fragment>
  );
}
