import { Option } from '@hqoss/monads';
import React from 'react';

export default function HomeSidebar({
  tags,
  onTabChange,
}: {
  tags: Option<string[]>;
  onTabChange: (tab: string) => void;
}) {
  return (
    <React.Fragment>
      <div className='sidebar'>
        <p>Popular Tags</p>

        {tags.match({
          none: () => <span>Loading tags...</span>,
          some: (tags) => (
            <div className='tag-list'>
              {' '}
              {tags.map((tag) => (
                <a key={tag} href='#' className='tag-pill tag-default' onClick={() => onTabChange(`# ${tag}`)}>
                  {tag}
                </a>
              ))}{' '}
            </div>
          ),
        })}
      </div>
    </React.Fragment>
  );
}
