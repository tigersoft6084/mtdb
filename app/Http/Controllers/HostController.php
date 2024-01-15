<?php

namespace App\Http\Controllers;

use App\Models\Host;
use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;

class HostController extends BaseController
{
    public function index()
    {
        $this->authorize('index', Host::class);

        $builder = app(Host::class)->newQuery();

        $dataSource = new DataSource($builder, request()->all());

        $pagination = $dataSource->paginate();

        return $this->success(['pagination' => $pagination]);
    }

    public function show(int $id)
    {
        $host = Host::findOrFail($id);

        $this->authorize('show', $host);

        $data = [
            'host' => $host,
            // 'related' => Host::compact()
            //     ->where('id', '!=', $host->id)
            //     ->orderBy('created_at', 'desc')
            //     ->limit(10)
            //     ->get(),
        ];

        return $this->renderClientOrApi([
            'pageName' => 'host-page',
            'data' => $data,
        ]);
    }

    public function store() {
        $this->authorize('store', Host::class);

        $data = $this->validate(request(), [
            'name' => 'string',
            'domain' => 'required|string',
            'description' => 'string',
        ]);

        $host = app(Host::class)->create($data);

        return $this->success(['host' => $host]);
    }

    public function update(int $hostId) {
        $this->authorize('update', Host::class);

        $data = $this->validate(request(), [
            'name' => 'string',
            'domain' => 'required|string',
            'description' => 'string',
        ]);

        $host = app(Host::class)->findOrFail($hostId);

        $host->update($data);

        return $this->success(['host' => $host]);
    }

    public function destroy(string $ids)
    {
        $hostIds = explode(',', $ids);
        $this->authorize('destroy', Host::class);

        foreach ($hostIds as $hostId) {
            $host = app(Host::class)->findOrFail($hostId);
            $host->titles()->detach();
            $host->delete();
        }

        return $this->success();
    }
}
