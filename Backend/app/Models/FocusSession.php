<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FocusSession extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'smart_task_id',
        'started_at',
        'ended_at',
        'duration_minutes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function smartTask()
    {
        return $this->belongsTo(SmartTask::class);
    }
}
