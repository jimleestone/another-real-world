import React, { FC } from 'react';
import { GenericErrors } from '../../types/error';
import { GenericFormField } from '../../utils/genericFormField';
import { Errors } from '../Errors/Errors';
import { FormGroup, ListFormGroup, TextAreaFormGroup } from '../FormGroup/FormGroup';

export interface GenericFormProps {
  fields: GenericFormField[];
  disabled: boolean;
  formObject: Record<string, string | null>;
  submitButtonText: string;
  errors: GenericErrors;
  onChange: (name: string, value: string) => void;
  onSubmit: (ev: React.FormEvent) => void;
  onAddItemToList?: (name: string) => void;
  onRemoveListItem?: (name: string, index: number) => void;
}

export const GenericForm: FC<GenericFormProps> = ({
  fields,
  disabled,
  formObject,
  submitButtonText,
  errors,
  onChange,
  onSubmit,
  onAddItemToList,
  onRemoveListItem,
}) => (
  <React.Fragment>
    <Errors errors={errors} />

    <form onSubmit={onSubmit}>
      <fieldset>
        {fields.map((field) =>
          field.fieldType === 'input' ? (
            <FormGroup
              key={field.name}
              disabled={disabled}
              type={field.type}
              placeholder={field.placeholder}
              value={formObject[field.name] || ''}
              onChange={onUpdateField(field.name, onChange)}
              lg={field.lg}
            />
          ) : field.fieldType === 'textarea' ? (
            <TextAreaFormGroup
              key={field.name}
              disabled={disabled}
              type={field.type}
              placeholder={field.placeholder}
              value={formObject[field.name] || ''}
              rows={field.rows as number}
              onChange={onUpdateField(field.name, onChange)}
              lg={field.lg}
            />
          ) : (
            <ListFormGroup
              key={field.name}
              disabled={disabled}
              type={field.type}
              placeholder={field.placeholder}
              value={formObject[field.name] || ''}
              onChange={onUpdateField(field.name, onChange)}
              listValue={formObject[field.listName as string] as unknown as string[]}
              onEnter={() => onAddItemToList && field.listName && onAddItemToList(field.listName)}
              onRemoveItem={(index) => onRemoveListItem && field.listName && onRemoveListItem(field.listName, index)}
              lg={field.lg}
            />
          )
        )}
        <button className='btn btn-lg btn-primary pull-xs-right'>{submitButtonText}</button>
      </fieldset>
    </form>
  </React.Fragment>
);

function onUpdateField(
  name: string,
  onChange: GenericFormProps['onChange']
): (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
  return ({ target: { value } }) => {
    onChange(name, value);
  };
}
