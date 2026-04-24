<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\SmartTask;
use App\Services\GroqApiService;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    protected $groqService;

    public function __construct(GroqApiService $groqService)
    {
        $this->groqService = $groqService;
    }

    public function index(Request $request)
    {
        return response()->json($request->user()->goals()->with('smartTasks')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $goal = $request->user()->goals()->create($request->all());

        return response()->json($goal, 201);
    }

    public function decompose(Request $request, Goal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Call Groq API to get tasks
        $tasksData = $this->groqService->decomposeGoal($goal->title, $goal->description);

        $createdTasks = [];
        foreach ($tasksData as $taskData) {
            $createdTasks[] = $goal->smartTasks()->create([
                'user_id' => $request->user()->id,
                'title' => $taskData['title'],
                'description' => 'Estimated time: ' . ($taskData['estimated_duration_minutes'] ?? 0) . ' minutes',
                'is_ai_generated' => true,
            ]);
        }

        return response()->json([
            'goal' => $goal,
            'new_tasks' => $createdTasks
        ]);
    }
}
