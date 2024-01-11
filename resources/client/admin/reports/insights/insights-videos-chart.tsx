import {Trans} from '@common/i18n/trans';
import React from 'react';
import {InsightsAsyncChart} from '@app/admin/reports/insights/insights-async-chart';
import {TopModelsChartLayout} from '@app/admin/reports/top-models-chart-layout';

export function InsightsVideosChart() {
  return (
    <InsightsAsyncChart metric="videos">
      <TopModelsChartLayout title={<Trans message="Most played videos" />} />
    </InsightsAsyncChart>
  );
}
