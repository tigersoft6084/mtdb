import React from 'react';
import {FullPageLoader} from '@common/ui/progress/full-page-loader';
import {Outlet} from 'react-router-dom';
import {useTitle} from '@app/titles/requests/use-title';

export function EditTitlePage() {
  const query = useTitle('editTitlePage');

  if (!query.data) {
    return <FullPageLoader />;
  }

  return <Outlet context={query.data.title} />;
}
