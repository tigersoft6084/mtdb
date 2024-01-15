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
        Schema::create('schedule_votes', function (Blueprint $table) {
            $table->id();
            $table->string('vote_type')->enum(['upvote', 'downvote']);
            $table->string('user_ip')->indeX();
            $table->unsigned('user_id')->nullable()->index();
            $table->unsigned('schedule_id')->index();
            $table->unique(['user_id', 'schedule_id']);
            $table->unique(['user_ip', 'schedule_id']);
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
        Schema::dropIfExists('schedule_votes');
    }
};
