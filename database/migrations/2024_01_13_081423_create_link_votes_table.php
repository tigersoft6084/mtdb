<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('link_votes', function (Blueprint $table) {
            $table->id();
            $table->string('vote_type')->enum(['upvote', 'downvote']);
            $table->string('user_ip')->index();
            $table->unsigned('user_id')->nullable()->index();
            $table->unsigned('link_id')->index();
            $table->unique(['user_id', 'link_id']);
            $table->unique(['user_ip', 'link_id']);
            $table->timestamps();

            $table->collation = config('database.connections.mysql.collation');
            $table->charset = config('database.connections.mysql.charset');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('link_votes');
    }
};
