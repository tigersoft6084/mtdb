import React, {Fragment} from 'react';
import {useForm} from 'react-hook-form';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@common/i18n/trans';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {useCreateList} from '@app/requests/requests/use-create-list';
import {CrupdateRequestForm} from '@app/requests/pages/crupdate-request-form';
import {TITLE_MODEL} from '@app/titles/models/title';
import {EMPTY_PAGINATION_RESPONSE} from '@common/http/backend-response/pagination-response';
import {IconButton} from '@common/ui/buttons/icon-button';
import {Link} from 'react-router-dom';
import {ArrowBackIcon} from '@common/icons/material/ArrowBack';
import {CreateChannelPayload} from '@common/admin/channels/requests/use-create-channel';

export function CreateRequestPage() {
  const form = useForm<CreateChannelPayload>({
    defaultValues: {
      type: 'list',
      public: true,
      config: {
        contentType: 'manual',
        contentModel: TITLE_MODEL,
        layout: 'grid',
        contentOrder: 'channelables.order:asc',
      },
      content: EMPTY_PAGINATION_RESPONSE.pagination,
    },
  });
  const createList = useCreateList(form);

  return (
    <Fragment>
      <StaticPageTitle>
        <Trans message="New list" />
      </StaticPageTitle>
      <CrupdateResourceLayout
        backButton={
          <IconButton elementType={Link} relative="path" to="../">
            <ArrowBackIcon />
          </IconButton>
        }
        form={form}
        onSubmit={values => {
          createList.mutate(values);
        }}
        title={<Trans message="New list" />}
        isLoading={createList.isPending}
      >
        <CrupdateRequestForm />
      </CrupdateResourceLayout>
    </Fragment>
  );
}
