<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SmartTask extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'goal_id',
        'title',
        'description',
        'is_completed',
        'is_ai_generated',
        'scheduled_at',
        'latitude',
        'longitude',
        'location_name',
        'location_radius_meters',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'is_ai_generated' => 'boolean',
        'scheduled_at' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'location_radius_meters' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function goal()
    {
        return $this->belongsTo(Goal::class);
    }

    public function focusSessions()
    {
        return $this->hasMany(FocusSession::class);
    }
}
