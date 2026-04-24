<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GroqApiService
{
    protected $apiKey;
    protected $apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = env('GROK_API_KEY');
    }

    public function decomposeGoal($goalTitle, $goalDescription)
    {
        if (!$this->apiKey) {
            // Mock response if no API key
            return [
                ['title' => 'Define scope for ' . $goalTitle, 'estimated_duration_minutes' => 60],
                ['title' => 'Research resources', 'estimated_duration_minutes' => 120],
                ['title' => 'Create implementation plan', 'estimated_duration_minutes' => 90],
                ['title' => 'Execute first phase', 'estimated_duration_minutes' => 180],
                ['title' => 'Review and refine', 'estimated_duration_minutes' => 60],
            ];
        }

        $prompt = "I have a goal titled '{$goalTitle}' with description '{$goalDescription}'. Please break this down into 3-5 actionable sub-tasks. Return ONLY a valid JSON array of objects, where each object has 'title' (string) and 'estimated_duration_minutes' (integer). No markdown formatting, just raw JSON array.";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful task decomposition assistant.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'model' => 'llama-3.3-70b-versatile',
                'temperature' => 0.7
            ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                // Clean markdown code blocks if any
                $content = preg_replace('/```json\s*/', '', $content);
                $content = preg_replace('/```\s*/', '', $content);
                return json_decode($content, true) ?? [];
            }
        } catch (\Exception $e) {
            \Log::error('Groq API Error: ' . $e->getMessage());
        }

        return [];
    }
}
