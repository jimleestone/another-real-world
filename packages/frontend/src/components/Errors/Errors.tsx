import React from 'react';
import { GenericErrors } from '../../types/error';

export function Errors({ errors }: { errors: GenericErrors }) {
  return (
    <React.Fragment>
      <ul className='error-messages'>
        {Array.isArray(errors) ? (
          <li key={errors[0]}>{errors[0]}</li>
        ) : typeof errors === 'string' ? (
          <li key={errors}>{errors}</li>
        ) : (
          Object.entries(errors).map(([field, fieldErrors]) =>
            fieldErrors.map((fieldError) => (
              <li key={field + String(fieldError)}>
                {field} {fieldError}
              </li>
            ))
          )
        )}
      </ul>
    </React.Fragment>
  );
}
