import React from 'react';
import { store } from '../../store/store';
import { useStore } from '../../store/store-hooks';
import { buildGenericFormField } from '../../utils/genericFormField';
import { ContainerPage } from '../ContainerPage/ContainerPage';
import { GenericForm } from '../GenericForm/GenericForm';
import { addTag, EditorState, removeTag, updateField } from './article-editor.slice';

export function ArticleEditor({ onSubmit }: { onSubmit: (ev: React.FormEvent) => void }) {
  const { article, submitting, tag, errors } = useStore(({ editor }) => editor);

  return (
    <div className='editor-page'>
      <ContainerPage>
        <div className='col-md-10 offset-md-1 col-xs-12'>
          <GenericForm
            formObject={{ ...article, tag } as unknown as Record<string, string | null>}
            disabled={submitting}
            errors={errors}
            onChange={onUpdateField}
            onSubmit={onSubmit}
            submitButtonText='Publish Article'
            onAddItemToList={onAddTag}
            onRemoveListItem={onRemoveTag}
            fields={[
              buildGenericFormField({ name: 'title', placeholder: 'Article Title' }),
              buildGenericFormField({ name: 'description', placeholder: "What's this article about?", lg: false }),
              buildGenericFormField({
                name: 'body',
                placeholder: 'Write your article (in markdown)',
                fieldType: 'textarea',
                rows: 8,
                lg: false,
              }),
              buildGenericFormField({
                name: 'tag',
                placeholder: 'Enter Tags',
                listName: 'tagList',
                fieldType: 'list',
                lg: false,
              }),
            ]}
          />
        </div>
      </ContainerPage>
    </div>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof EditorState['article'], value }));
}

function onAddTag() {
  store.dispatch(addTag());
}

function onRemoveTag(_: string, index: number) {
  store.dispatch(removeTag(index));
}
