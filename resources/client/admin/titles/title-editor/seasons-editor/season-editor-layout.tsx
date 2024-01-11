import React, {ReactNode} from 'react';
import {Trans} from '@common/i18n/trans';
import {Link, useLocation, useParams} from 'react-router-dom';
import {IconButton} from '@common/ui/buttons/icon-button';
import {ArrowBackIcon} from '@common/icons/material/ArrowBack';
import {TitleEditorLayout} from '@app/admin/titles/title-editor/title-editor-layout';
import {TabList} from '@common/ui/tabs/tab-list';
import {Tab} from '@common/ui/tabs/tab';
import {Tabs} from '@common/ui/tabs/tabs';
import {message} from '@common/i18n/message';

const PageTabs = [
  {uri: 'episodes', label: message('Episodes')},
  {uri: 'cast', label: message('Regular cast')},
  {uri: 'crew', label: message('Regular crew')},
];

interface Props {
  children: ReactNode;
}
export function SeasonEditorLayout({children}: Props) {
  const {season: seasonNumber} = useParams();

  const {pathname} = useLocation();
  const tabName = pathname.split('/').pop();

  // only "episodes" tab will be enabled when creating new episode
  const selectedTab = seasonNumber
    ? PageTabs.findIndex(tab => tab.uri === tabName)
    : 0;

  return (
    <TitleEditorLayout>
      <div className="flex items-center gap-12 mb-4">
        <IconButton
          elementType={Link}
          to="../../"
          relative="path"
          className="text-muted"
        >
          <ArrowBackIcon />
        </IconButton>
        <h2 className="text-base">
          <Trans message="Season :number" values={{number: seasonNumber}} />
        </h2>
      </div>
      <Tabs selectedTab={selectedTab}>
        <TabList>
          {PageTabs.map(tab => (
            <Tab
              isDisabled={!seasonNumber && tab.uri !== PageTabs[0].uri}
              key={tab.uri}
              width="min-w-132"
              elementType={Link}
              to={`../${tab.uri}`}
              relative="path"
              replace
            >
              <Trans {...tab.label} />
            </Tab>
          ))}
        </TabList>
        <div className="pt-24 min-h-512">{children}</div>
      </Tabs>
    </TitleEditorLayout>
  );
}
