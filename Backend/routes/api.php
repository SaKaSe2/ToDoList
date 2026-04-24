<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\SmartTaskController;
use App\Http\Controllers\FocusSessionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('goals', GoalController::class);
    Route::post('/goals/{goal}/decompose', [GoalController::class, 'decompose']);

    Route::apiResource('tasks', SmartTaskController::class);
    Route::post('/tasks/{task}/reschedule', [SmartTaskController::class, 'smartReschedule']);

    Route::post('/focus/start', [FocusSessionController::class, 'start']);
    Route::post('/focus/{session}/stop', [FocusSessionController::class, 'stop']);
    Route::get('/analytics', [FocusSessionController::class, 'analytics']);
});
