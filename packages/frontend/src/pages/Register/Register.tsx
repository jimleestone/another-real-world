import React from 'react';
import { Link } from 'react-router-dom';
import { ContainerPage } from '../../components/ContainerPage/ContainerPage';
import { GenericForm } from '../../components/GenericForm/GenericForm';
import { register } from '../../services/user.service';
import { dispatchOnCall, store } from '../../store/store';
import { useStoreWithInitializer } from '../../store/store-hooks';
import { UserForRegistration } from '../../types/user';
import { buildGenericFormField } from '../../utils/genericFormField';
import { initializeRegister, RegisterState, updateField } from './register.slice';

export function Register() {
  const { errors, signingUp, user } = useStoreWithInitializer(
    ({ register }) => register,
    dispatchOnCall(initializeRegister())
  );

  return (
    <React.Fragment>
      <div className='auth-page'>
        <ContainerPage>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>Sign up</h1>
            <p className='text-xs-center'>
              <Link to='/login'>Have an account?</Link>
            </p>

            <GenericForm
              disabled={signingUp}
              formObject={user as unknown as Record<string, string>}
              submitButtonText='Sign up'
              errors={errors}
              onChange={onUpdateField}
              onSubmit={onSignUp(user)}
              fields={[
                buildGenericFormField({ name: 'username', placeholder: 'Username' }),
                buildGenericFormField({ name: 'email', placeholder: 'Email' }),
                buildGenericFormField({ name: 'password', placeholder: 'Password', type: 'password' }),
              ]}
            />
          </div>
        </ContainerPage>
      </div>
    </React.Fragment>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof RegisterState['user'], value }));
}

function onSignUp(user: UserForRegistration) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    await store.dispatch(register(user));
  };
}
