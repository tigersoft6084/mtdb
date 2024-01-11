import {ColumnConfig} from '@common/datatable/column-config';
import {TitleCredit} from '@app/titles/models/title';
import {Trans} from '@common/i18n/trans';
import {DragHandleIcon} from '@common/icons/material/DragHandle';
import {PersonPoster} from '@app/people/person-poster/person-poster';
import React, {Fragment, useContext, useRef} from 'react';
import {Table} from '@common/ui/tables/table';
import {RowElementProps} from '@common/ui/tables/table-row';
import {NormalizedModel} from '@common/datatable/filters/normalized-model';
import {useIsTouchDevice} from '@common/utils/hooks/is-touch-device';
import {TableContext} from '@common/ui/tables/table-context';
import {DragPreviewRenderer} from '@common/ui/interactions/dnd/use-draggable';
import {useSortable} from '@common/ui/interactions/dnd/use-sortable';
import {mergeProps} from '@react-aria/utils';
import {DragPreview} from '@common/ui/interactions/dnd/drag-preview';
import {useSortTitleCredits} from '@app/admin/titles/requests/use-sort-title-credits';
import {moveItemInNewArray} from '@common/utils/array/move-item-in-new-array';
import {getCreditsEditorActionColumn} from '@app/admin/titles/title-editor/credits-editor/get-credits-editor-action-column';
import {UseInfiniteDataResult} from '@common/ui/infinite-scroll/use-infinite-data';
import {CreditsTableQueryIndicator} from '@app/admin/titles/title-editor/credits-editor/credits-table-query-indicator';

const columnConfig: ColumnConfig<TitleCredit>[] = [
  {
    key: 'dragHandle',
    width: 'w-42 flex-shrink-0',
    header: () => <Trans message="Drag handle" />,
    hideHeader: true,
    body: () => (
      <DragHandleIcon className="cursor-pointer text-muted hover:text" />
    ),
  },
  {
    key: 'name',
    header: () => <Trans message="Person" />,
    visibleInMode: 'all',
    body: credit => (
      <div className="flex items-center gap-12">
        <PersonPoster rounded person={credit} size="w-44" />
        <div className="overflow-hidden min-w-0">{credit.name}</div>
      </div>
    ),
  },
  {
    key: 'character',
    header: () => <Trans message="Character" />,
    body: credit => credit.pivot.character,
  },
  getCreditsEditorActionColumn(),
];

interface Props {
  query: UseInfiniteDataResult<TitleCredit>;
}
export function CastEditorTable({query}: Props) {
  return (
    <Fragment>
      <Table
        enableSelection={false}
        columns={columnConfig}
        data={query.items}
        renderRowAs={CreditsTableRow}
        cellHeight="h-54"
      />
      <CreditsTableQueryIndicator query={query} />
    </Fragment>
  );
}

function CreditsTableRow({
  item,
  children,
  className,
  ...domProps
}: RowElementProps<TitleCredit>) {
  const isTouchDevice = useIsTouchDevice();
  const context = useContext(TableContext);
  const domRef = useRef<HTMLTableRowElement>(null);
  const previewRef = useRef<DragPreviewRenderer>(null);
  const credits = context.data as TitleCredit[];

  const sortCredits = useSortTitleCredits();

  const {sortableProps} = useSortable({
    ref: domRef,
    disabled: isTouchDevice ?? false,
    item,
    items: credits,
    type: 'cast-editor-item',
    preview: previewRef,
    previewVariant: 'line',
    onSortEnd: (oldIndex, newIndex) => {
      const ids = credits.map(item => item.pivot.id);
      const sortedIds = moveItemInNewArray(ids, oldIndex, newIndex);
      sortCredits.mutate({ids: sortedIds});
    },
  });

  return (
    <div
      className={className}
      ref={domRef}
      {...mergeProps(sortableProps, domProps)}
    >
      {children}
      {!item.isPlaceholder && <RowDragPreview item={item} ref={previewRef} />}
    </div>
  );
}

interface RowDragPreviewProps {
  item: NormalizedModel;
}
const RowDragPreview = React.forwardRef<
  DragPreviewRenderer,
  RowDragPreviewProps
>(({item}, ref) => {
  return (
    <DragPreview ref={ref}>
      {() => (
        <div className="p-8 rounded shadow bg-chip text-sm">{item.name}</div>
      )}
    </DragPreview>
  );
});
