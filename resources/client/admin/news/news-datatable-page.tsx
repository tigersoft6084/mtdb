import {Fragment} from 'react';
import {Trans} from '@common/i18n/trans';
import {Link} from 'react-router-dom';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {NewsDatatableFilters} from '@app/admin/news/news-datatable-filters';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import {DeleteSelectedItemsAction} from '@common/datatable/page/delete-selected-items-action';
import onlineArticlesImg from '@app/admin/news/online-articles.svg';
import {newsDatatableColumns} from '@app/admin/news/news-datatable-columns';
import {IconButton} from '@common/ui/buttons/icon-button';
import {PublishIcon} from '@common/icons/material/Publish';
import {useImportNewsArticles} from '@app/admin/news/requests/use-import-news-articles';
import {Tooltip} from '@common/ui/tooltip/tooltip';

export function NewsDatatablePage() {
  return (
    <DataTablePage
      endpoint="news"
      title={<Trans message="News articles" />}
      filters={NewsDatatableFilters}
      columns={newsDatatableColumns}
      queryParams={{
        stripHtml: 'true',
        truncateBody: 200,
      }}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      enableSelection={false}
      cellHeight="h-80"
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={onlineArticlesImg}
          title={<Trans message="No articles have been created yet" />}
          filteringTitle={<Trans message="No matching articles" />}
        />
      }
    />
  );
}

function Actions() {
  const importArticles = useImportNewsArticles();
  return (
    <Fragment>
      <Tooltip label={<Trans message="Import news articles" />}>
        <IconButton
          variant="outline"
          color="primary"
          radius="rounded"
          size="sm"
          onClick={() => importArticles.mutate()}
          disabled={importArticles.isPending}
        >
          <PublishIcon />
        </IconButton>
      </Tooltip>
      <DataTableAddItemButton elementType={Link} to="add">
        <Trans message="Add news article" />
      </DataTableAddItemButton>
    </Fragment>
  );
}
