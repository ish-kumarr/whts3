import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyApWYalcn1sLUFwtcUbTBToQkzIu0pVfJ4");

interface TaskAnalysis {
  summary: {
    title: string;
    description: string;
    priority_level: "Low" | "Medium" | "High" | "Urgent";
    estimated_time: string;
  };
  requirements: {
    key_points: string[];
    dependencies: string[];
    stakeholders: string[];
  };
  next_steps: {
    immediate_actions: string[];
    future_tasks: string[];
    milestones: {
      title: string;
      deadline: string;
    }[];
  };
  challenges: {
    potential_risks: string[];
    mitigation_strategies: string[];
    resource_requirements: string[];
  };
}

export async function analyzeTask(task: any): Promise<TaskAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Analyze this task and return a JSON object with the following structure. DO NOT include any markdown formatting or code blocks, just return the raw JSON:

      {
        "summary": {
          "title": string,
          "description": string,
          "priority_level": "Low" | "Medium" | "High" | "Urgent",
          "estimated_time": string
        },
        "requirements": {
          "key_points": string[],
          "dependencies": string[],
          "stakeholders": string[]
        },
        "next_steps": {
          "immediate_actions": string[],
          "future_tasks": string[],
          "milestones": [
            {
              "title": string,
              "deadline": string
            }
          ]
        },
        "challenges": {
          "potential_risks": string[],
          "mitigation_strategies": string[],
          "resource_requirements": string[]
        }
      }

      Task Details:
      - Task: ${task.task}
      - Message: ${task.snippet}
      - Priority: ${task.priority}
      - Deadline: ${task.deadline} at ${task.time}
      - Category: ${task.category}

      Important:
      1. Return ONLY the JSON object, no other text or formatting
      2. Ensure all arrays have at least 2-3 items
      3. Keep descriptions concise but informative
      4. Use professional language
      5. Make sure the JSON is valid and properly formatted
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing task:", error);
    throw error;
  }
}
