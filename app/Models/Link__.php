<?php

namespace App\Models;

use Common\Comments\Comment;
use Common\Core\BaseModel;
use Common\Votes\OrdersByWeightedScore;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;

class Link extends BaseModel
{
    use OrdersByWeightedScore;

    public const VIDEO_TYPE_EMBED = 'embed';
    public const VIDEO_TYPE_DIRECT = 'direct';
    public const VIDEO_TYPE_EXTERNAL = 'external';
    public const MODEL_TYPE = 'video';

    protected $guarded = ['id'];
    protected $appends = ['score', 'model_type'];
    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',        
        'title_id' => 'integer',
        'season' => 'integer',
        'episode' => 'integer',
        'reports' => 'integer',
        'negative_votes' => 'integer',
        'positive_votes' => 'integer',
    ];

    public function title(): BelongsTo
    {
        return $this->belongsTo(Title::class)->select([
            'id',
            'name',
            'poster',
            'backdrop',
            'is_series',
        ]);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(LinkVote::class);
    }

    public function episode(): BelongsTo
    {
        return $this->belongsTo(Episode::class);
    }

    public function scopeOrderByMostUpvotes(Builder $query): Builder
    {
        return $query->orderByWeightedScore('desc');
    }

    public function getScoreAttribute()
    {
        $total = $this->positive_votes + $this->negative_votes;
        if (!$total) {
            return null;
        }
        return round(($this->positive_votes / $total) * 100);
    }

    public function scopeApplySelectedSort(Builder $query): Builder
    {
        [$col, $dir] = explode(
            ':',
            settings('streaming.default_sort', 'order:asc'),
        );

        if ($col === 'score') {
            $query->orderByWeightedScore();
        } elseif ($col === 'order') {
            $query->orderBy(DB::raw('`order` = 0, `order`'), $dir);
        } else {
            $query
                ->orderBy(DB::raw('`category` = "trailer"'), 'desc')
                ->orderBy($col, $dir);
        }

        return $query;
    }

    public function scopeFromConfiguredCategory(Builder $builder): Builder {
        $contentType = settings('streaming.video_panel_content');

        if ($contentType === 'full') {
            $builder->where('category', 'full');
        } elseif ($contentType === 'short') {
            $builder->where('category', '!=', 'full');
        } else if ($contentType !== 'all') {
            $builder->where('category', $contentType);
        }

        return $builder;
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
        ];
    }

    public static function filterableFields(): array
    {
        return ['id', 'created_at', 'updated_at'];
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->thumbnail,
            'model_type' => self::MODEL_TYPE,
        ];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
