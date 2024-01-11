<?php

namespace App\Services;

use App\Http\Resources\ChannelResource;
use App\Models\Channel;
use App\Models\Episode;
use App\Models\Genre;
use App\Models\NewsArticle;
use App\Models\Person;
use App\Models\Season;
use App\Models\Title;
use App\Models\User;
use App\Models\Video;
use Common\Core\Prerender\BaseUrlGenerator;

class UrlGenerator extends BaseUrlGenerator
{
    public function title(array|Title $title): string
    {
        $slug = slugify($title['name']);
        return url("titles/{$title['id']}/{$slug}");
    }

    public function season(array|Season $season, $dataOrTitle): string
    {
        $title = $dataOrTitle['title'] ?? $dataOrTitle;
        $titleUrl = $this->title($title);
        return "$titleUrl/season/{$season['number']}";
    }

    public function episode(array|Episode $episode, $dataOrTitle): string
    {
        $title = $dataOrTitle['title'] ?? $dataOrTitle;
        $titleUrl = $this->title($title);
        return "$titleUrl/season/{$episode['season_number']}/episode/{$episode['episode_number']}";
    }

    public function watch(array|Video $video): string
    {
        return url("watch/{$video['id']}");
    }

    public function person(array|Person $person): string
    {
        $slug = slugify($person['name']);
        return url("people/{$person['id']}/{$slug}");
    }

    public function article(array|NewsArticle $article): string
    {
        return url("news/{$article['id']}");
    }

    public function genre(array|Genre $genre): string
    {
        return url("genre/{$genre['id']}");
    }

    public function search(string $query): string
    {
        return url("search/{$query}");
    }

    public function user(User|array $model): string
    {
        return url('users/' . $model['id']);
    }

    public function channel(Channel|ChannelResource|array $model): string
    {
        if ($model['type'] === 'list') {
            return url("lists/{$model['id']}");
        } else {
            if (settings('homepage.type') === 'channels' && settings('homepage.value') === $model['id']) {
                return url('/');
            }
            return url($model['slug'] ?: slugify($model['name']));
        }
    }
}
