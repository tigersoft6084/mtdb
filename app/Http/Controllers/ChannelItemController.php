<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Common\Core\BaseController;
use Illuminate\Support\Str;

class ChannelItemController extends BaseController
{
    public function add(Channel $channel)
    {
        $this->authorize('update', $channel);

        $data = $this->validate(request(), [
            'itemId' => 'required|integer',
            'itemType' => 'required|string',
        ]);

        $relationName = Str::plural($data['itemType']);

        $channel->$relationName()->sync(
            [
                $data['itemId'] => [
                    'order' => $channel->$relationName()->count() + 1,
                ],
            ],
            false,
        );
        $channel->touch();

        return $this->success(['chanel' => $channel]);
    }

    public function remove(Channel $channel)
    {
        $this->authorize('update', $channel);

        $data = $this->validate(request(), [
            'itemId' => 'required|integer',
            'itemType' => 'required|string',
        ]);

        $relationName = Str::plural($data['itemType']);
        $channel->$relationName()->detach($data['itemId']);
        $channel->touch();

        return $this->success(['channel' => $channel]);
    }
}
