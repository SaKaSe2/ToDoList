<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Users table (override default)
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Goals table (for AI Decomposition)
        Schema::create('goals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamps();
        });

        // 3. Smart Tasks table (To-Do List + Geo Context)
        Schema::create('smart_tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('goal_id')->nullable()->constrained('goals')->onDelete('cascade');
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->boolean('is_ai_generated')->default(false);
            
            // Scheduling
            $table->dateTime('scheduled_at')->nullable();
            
            // Contextual Reminder (Geolocation)
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('location_name')->nullable();
            $table->integer('location_radius_meters')->default(100);

            $table->timestamps();
        });

        // 4. Focus Sessions table (Analytics)
        Schema::create('focus_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('smart_task_id')->nullable()->constrained('smart_tasks')->onDelete('set null');
            
            $table->dateTime('started_at');
            $table->dateTime('ended_at')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->timestamps();
        });

        // 5. Personal Access Tokens (required by Laravel Sanctum)
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->uuidMorphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('focus_sessions');
        Schema::dropIfExists('smart_tasks');
        Schema::dropIfExists('goals');
        Schema::dropIfExists('users');
    }
};
