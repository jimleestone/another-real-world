import React from 'react';
import { ContainerPage } from '../../components/ContainerPage/ContainerPage';
import { GenericForm } from '../../components/GenericForm/GenericForm';
import { updateUser } from '../../services/user.service';
import { logout } from '../../store/common/common.slice';
import { store } from '../../store/store';
import { useStoreWithInitializer } from '../../store/store-hooks';
import { UserSettings } from '../../types/user';
import { buildGenericFormField } from '../../utils/genericFormField';
import { initializeSettings, SettingsState, updateField } from './settings.slice';

export function Settings() {
  const { user, errors, updating } = useStoreWithInitializer(({ settings }) => settings, load);

  return (
    <div className='settings-page'>
      <ContainerPage>
        <div className='col-md-6 offset-md-3 col-xs-12'>
          <h1 className='text-xs-center'>Your Settings</h1>

          <GenericForm
            disabled={updating}
            formObject={{ ...user }}
            submitButtonText='Update Settings'
            errors={errors}
            onChange={onUpdateField}
            onSubmit={onUpdateSettings(user)}
            fields={[
              buildGenericFormField({ name: 'image', placeholder: 'URL of profile picture' }),
              buildGenericFormField({ name: 'username', placeholder: 'Your Name' }),
              buildGenericFormField({
                name: 'bio',
                placeholder: 'Short bio about you',
                rows: 8,
                fieldType: 'textarea',
              }),
              buildGenericFormField({ name: 'email', placeholder: 'Email' }),
              buildGenericFormField({ name: 'password', placeholder: 'Password', type: 'password' }),
            ]}
          />

          <hr />
          <button className='btn btn-outline-danger' onClick={_logout}>
            Or click here to logout.
          </button>
        </div>
      </ContainerPage>
    </div>
  );
}

function load() {
  store.dispatch(initializeSettings(store.getState().common.user.unwrap()));
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof SettingsState['user'], value }));
}

function onUpdateSettings(user: UserSettings) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    await store.dispatch(updateUser(user));
  };
}

function _logout() {
  store.dispatch(logout());
}
