<?php

namespace App\Http\Controllers;

use App\Models\SmartTask;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SmartTaskController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->smartTasks()->with('goal')->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'goal_id' => 'nullable|exists:goals,id',
            'description' => 'nullable|string',
            'scheduled_at' => 'nullable|date',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'location_name' => 'nullable|string',
            'location_radius_meters' => 'nullable|integer',
        ]);

        $task = $request->user()->smartTasks()->create($request->all());

        return response()->json($task, 201);
    }

    public function update(Request $request, SmartTask $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $task->update($request->all());
        return response()->json($task);
    }

    public function destroy(Request $request, SmartTask $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function smartReschedule(Request $request, SmartTask $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Mock smart scheduling: just push to 2 hours from now
        $task->update(['scheduled_at' => Carbon::now()->addHours(2)]);

        return response()->json($task);
    }
}
