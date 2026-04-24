<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasUuids, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function goals()
    {
        return $this->hasMany(Goal::class, 'user_id');
    }

    public function smartTasks()
    {
        return $this->hasMany(SmartTask::class, 'user_id');
    }

    public function focusSessions()
    {
        return $this->hasMany(FocusSession::class, 'user_id');
    }
}
