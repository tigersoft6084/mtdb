<?php

namespace App\Console\Commands;

use App\Actions\Demo\GenerateDemoAnimeVideos;
use App\Actions\Demo\GenerateDemoComments;
use App\Actions\Demo\GenerateDemoReviews;
use App\Actions\Demo\GenerateDemoStreamVideos;
use App\Actions\Demo\GenerateDemoUsers;
use App\Actions\Demo\GenerateDemoVideoVotes;
use Common\Admin\Appearance\Themes\CssTheme;
use Common\Channels\GenerateChannelsFromConfig;
use Common\Channels\UpdateAllChannelsContent;
use Common\Settings\DotEnvEditor;
use Common\Settings\Setting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class GenerateDemoDataCommand extends Command
{
    protected $signature = 'demo:generate {variant}';

    public function handle(): void
    {
        @set_time_limit(0);
        @ini_set('memory_limit', '200M');

        Artisan::call('down');

        $variant = $this->argument('variant');

        if ($variant === 'database') {
            $this->databaseVariant();
        } elseif ($variant === 'streaming') {
            $this->streamingVariant();
        } elseif ($variant === 'anime') {
            $this->animeVariant();
        } else {
            $this->error('Invalid variant');
        }

        $this->info('Demo data generated', true);

        Artisan::call('up');
    }

    protected function databaseVariant(): void
    {
        $this->overridePrimaryMenu([
            [
                'id' => 'cVKgbI',
                'type' => 'channels',
                'label' => 'Movies',
                'action' => '/movies',
            ],
            [
                'id' => 'nVKg4v',
                'type' => 'channels',
                'label' => 'Series',
                'action' => '/series',
            ],
            [
                'id' => 'nVKg1Ix',
                'type' => 'channels',
                'label' => 'People',
                'action' => '/people',
            ],
            [
                'id' => 'nVKxdI',
                'type' => 'channels',
                'label' => 'News',
                'action' => '/latest-news',
            ],
        ]);

        $homepageChannel = (new GenerateChannelsFromConfig())->execute([
            resource_path('defaults/channels/shared-channels.json'),
            resource_path('defaults/channels/default-channels.json'),
        ]);
        settings()->save([
            'homepage.type' => 'channels',
            'homepage.value' => $homepageChannel->id,
            'titles.video_panel_mode' => 'carousel',
            'streaming.video_panel_content' => 'all',
            'streaming.prefer_full' => false,
            'streaming.show_video_selector' => false,
            'streaming.show_header_play' => true,
            'content.search_provider' => 'tmdb',
            'content.title_provider' => 'tmdb',
            'content.people_provider' => 'tmdb',
            'content.automate_filmography' => true,
            'title_page.sections' => json_encode([
                'seasons',
                'videos',
                'images',
                'reviews',
                'cast',
                'related',
            ]),
        ]);

        Artisan::call(UpdateAllChannelsContent::class);

        (new GenerateDemoUsers())->execute();
        (new GenerateDemoVideoVotes())->execute();
        (new GenerateDemoComments())->execute();
        (new GenerateDemoReviews())->execute();
    }

    protected function streamingVariant(): void
    {
        $this->overridePrimaryMenu([
            [
                'id' => 'cVKg0I',
                'type' => 'route',
                'label' => 'Movies',
                'action' => '/movies',
            ],
            [
                'id' => 'nVKg0v',
                'type' => 'route',
                'label' => 'TV shows',
                'action' => '/series',
            ],
            [
                'id' => 'nVKg0Ix',
                'type' => 'route',
                'label' => 'Watchlist',
                'action' => '/watchlist',
            ],
        ]);

        $homepageChannel = (new GenerateChannelsFromConfig())->execute([
            resource_path('defaults/channels/shared-channels.json'),
            resource_path('defaults/channels/streaming-channels.json'),
        ]);

        $darkTheme = CssTheme::where('default_dark', true)->first();

        settings()->save([
            'themes.default_id' => $darkTheme->id,
            'homepage.type' => 'landingPage',
            'titles.video_panel_mode' => 'hide',
            'streaming.video_panel_content' => 'full',
            'streaming.prefer_full' => true,
            'streaming.show_video_selector' => false,
            'streaming.show_header_play' => true,
            'content.search_provider' => 'local',
            'content.title_provider' => 'tmdb',
            'content.people_provider' => 'tmdb',
            'content.automate_filmography' => false,
            'title_page.sections' => json_encode([
                'seasons',
                'images',
                'reviews',
                'cast',
                'related',
            ]),
        ]);

        app(DotEnvEditor::class)->write([
            'scout_driver' => 'meilisearch',
        ]);

        Artisan::call(UpdateAllChannelsContent::class);
        Artisan::call(UpdateSeasonsFromRemote::class);

        (new GenerateDemoUsers())->execute();
        (new GenerateDemoStreamVideos())->execute();
        (new GenerateDemoVideoVotes())->execute();
        (new GenerateDemoComments())->execute();
        (new GenerateDemoReviews())->execute();
    }

    protected function animeVariant(): void
    {
        $this->overridePrimaryMenu([
            [
                'id' => 'cVKg0I',
                'type' => 'route',
                'label' => 'Movies',
                'action' => '/movies',
            ],
            [
                'id' => 'nVKg0v',
                'type' => 'route',
                'label' => 'TV shows',
                'action' => '/series',
            ],
            [
                'id' => 'nVKg0Ix',
                'type' => 'route',
                'label' => 'Watchlist',
                'action' => '/watchlist',
            ],
        ]);

        $homepageChannel = (new GenerateChannelsFromConfig())->execute([
            resource_path('defaults/channels/shared-channels.json'),
            resource_path('defaults/channels/anime-channels.json'),
        ]);

        settings()->save([
            'homepage.type' => 'channels',
            'homepage.value' => $homepageChannel->id,
            'titles.video_panel_mode' => 'hide',
            'streaming.video_panel_content' => 'full',
            'streaming.prefer_full' => true,
            'streaming.show_video_selector' => true,
            'streaming.show_header_play' => true,
            'content.search_provider' => 'local',
            'content.title_provider' => 'tmdb',
            'content.people_provider' => 'tmdb',
            'content.automate_filmography' => false,
            'title_page.sections' => json_encode([
                'episodes',
                'images',
                'reviews',
                'cast',
                'related',
            ]),
        ]);

        app(DotEnvEditor::class)->write([
            'scout_driver' => 'meilisearch',
        ]);

        Artisan::call(UpdateAllChannelsContent::class);

        (new GenerateDemoUsers())->execute();
        (new GenerateDemoAnimeVideos())->execute();
        (new GenerateDemoVideoVotes())->execute();
        (new GenerateDemoComments())->execute('anime');
        (new GenerateDemoReviews())->execute();
    }

    protected function overridePrimaryMenu(array $items): void
    {
        $menus = json_decode(
            Setting::where('name', 'menus')->first()->value,
            true,
        );
        $index = array_search('primary', array_column($menus, 'name'));
        $menus[$index]['items'] = $items;
        Setting::where('name', 'menus')->update([
            'value' => json_encode($menus),
        ]);
    }
}
