import {Select} from '@common/ui/forms/select/select';
import {message} from '@common/i18n/message';
import {Trans} from '@common/i18n/trans';
import {Option} from '@common/ui/forms/combobox/combobox';
import React from 'react';
import {useTrans} from '@common/i18n/use-trans';
import {useParams} from 'react-router-dom';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {Title} from '@app/titles/models/title';
import {useSeason} from '@app/seasons/requests/use-season';

interface Props {
  title: Title;
}
export function VideosEditorSeasonSelect({title}: Props) {
  const navigate = useNavigate();
  const {trans} = useTrans();
  const params = useParams();
  const season = params.season ? Number(params.season) : '';
  const episode = params.episode ? Number(params.episode) : '';

  const handleNavigate = (season?: number, episode?: number) => {
    let uri = `/admin/titles/${title.id}/edit/videos`;
    if (season) {
      uri += `/seasons/${season}`;
    }
    if (episode) {
      uri += `/episodes/${episode}`;
    }
    navigate(uri);
  };

  if (!title.seasons_count) {
    return null;
  }

  return (
    <div className="flex items-center gap-12">
      <Select
        className="flex-1"
        selectedValue={season}
        onSelectionChange={newSeason => {
          handleNavigate(newSeason as number);
        }}
        placeholder={trans(message('Season'))}
        selectionMode="single"
        size="sm"
      >
        <Option key="none" value="">
          <Trans message="All seasons" />
        </Option>
        {[...new Array(title.seasons_count).keys()].map(i => {
          const number = i + 1;
          return (
            <Option key={number} value={number}>
              <Trans message="Season :number" values={{number}} />
            </Option>
          );
        })}
      </Select>
      {season && (
        <EpisodeSelect
          value={episode}
          onChange={newEpisode => {
            handleNavigate(season, newEpisode as number);
          }}
        />
      )}
    </div>
  );
}

interface EpisodeSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
}
function EpisodeSelect({value, onChange}: EpisodeSelectProps) {
  const {trans} = useTrans();
  const {data} = useSeason('season');
  return (
    <Select
      placeholder={trans(message('Episode'))}
      selectionMode="single"
      className="flex-1"
      size="sm"
      selectedValue={value}
      onSelectionChange={onChange}
    >
      <Option key="none" value="">
        <Trans message="All episodes" />
      </Option>
      {[...new Array(data?.season.episodes_count).keys()].map(i => {
        const number = i + 1;
        return (
          <Option key={number} value={number}>
            <Trans message="Episode :number" values={{number}} />
          </Option>
        );
      })}
    </Select>
  );
}
