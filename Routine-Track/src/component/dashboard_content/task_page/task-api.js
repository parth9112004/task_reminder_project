/**
 * Task API Utility
 * Handles persistent storage using localStorage
 */

const STORAGE_KEY = 'routine_tracker_tasks';

export const taskApi = {
  // Get all tasks
  getTasks: () => {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  },

  // Save/Update tasks array
  saveAllTasks: (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  // Add a new task
  addTask: (task) => {
    const tasks = taskApi.getTasks();
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    taskApi.saveAllTasks(tasks);
    return newTask;
  },

  // Update an existing task
  updateTask: (task) => {
    const tasks = taskApi.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...task };
      taskApi.saveAllTasks(tasks);
      return tasks[index];
    }
    return null;
  },

  // Delete a task
  deleteTask: (id) => {
    const tasks = taskApi.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    taskApi.saveAllTasks(filtered);
    return filtered;
  }
};
