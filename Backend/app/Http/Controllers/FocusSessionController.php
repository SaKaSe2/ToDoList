<?php

namespace App\Http\Controllers;

use App\Models\FocusSession;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FocusSessionController extends Controller
{
    public function start(Request $request)
    {
        $request->validate([
            'smart_task_id' => 'nullable|exists:smart_tasks,id'
        ]);

        $session = $request->user()->focusSessions()->create([
            'smart_task_id' => $request->smart_task_id,
            'started_at' => Carbon::now(),
        ]);

        return response()->json($session, 201);
    }

    public function stop(Request $request, FocusSession $session)
    {
        if ($session->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $session->update([
            'ended_at' => Carbon::now(),
            'duration_minutes' => Carbon::now()->diffInMinutes($session->started_at)
        ]);

        return response()->json($session);
    }

    public function analytics(Request $request)
    {
        $sessions = $request->user()->focusSessions()->whereNotNull('ended_at')->get();
        $tasks = $request->user()->smartTasks()->get();

        $totalMinutes = $sessions->sum('duration_minutes');
        $completedTasks = $tasks->where('is_completed', true)->count();
        $completionRate = $tasks->count() > 0 ? round(($completedTasks / $tasks->count()) * 100) : 0;

        return response()->json([
            'total_focus_minutes' => $totalMinutes,
            'completed_tasks' => $completedTasks,
            'total_tasks' => $tasks->count(),
            'completion_rate' => $completionRate
        ]);
    }
}
