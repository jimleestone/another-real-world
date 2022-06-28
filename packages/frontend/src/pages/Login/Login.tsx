import React from 'react';
import { Link } from 'react-router-dom';
import { ContainerPage } from '../../components/ContainerPage/ContainerPage';
import { GenericForm } from '../../components/GenericForm/GenericForm';
import { login } from '../../services/user.service';
import { dispatchOnCall, store } from '../../store/store';
import { useStoreWithInitializer } from '../../store/store-hooks';
import { UserForLogin } from '../../types/user';
import { buildGenericFormField } from '../../utils/genericFormField';
import { initializeLogin, LoginState, updateField } from './login.slice';

export function Login() {
  const { errors, loggingIn, user } = useStoreWithInitializer(({ login }) => login, dispatchOnCall(initializeLogin()));

  return (
    <div className='auth-page'>
      <ContainerPage>
        <div className='col-md-6 offset-md-3 col-xs-12'>
          <h1 className='text-xs-center'>Sign in</h1>
          <p className='text-xs-center'>
            <Link to='/register'>Need an account?</Link>
          </p>

          <GenericForm
            disabled={loggingIn}
            formObject={user as unknown as Record<string, string>}
            submitButtonText='Sign in'
            errors={errors}
            onChange={onUpdateField}
            onSubmit={signIn(user)}
            fields={[
              buildGenericFormField({ name: 'email', placeholder: 'Email' }),
              buildGenericFormField({ name: 'password', placeholder: 'Password', type: 'password' }),
            ]}
          />
        </div>
      </ContainerPage>
    </div>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof LoginState['user'], value }));
}

function signIn(user: UserForLogin) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    await store.dispatch(login(user));
  };
}
