/**
 * Task API Utility
 * Connects to the PHP backend at http://localhost/routine-tracker/tasks/
 *
 * Status mapping:
 *   UI "Pending"     <-> API "pending"
 *   UI "In Progress" <-> API "in_progress"
 *   UI "Done"        <-> API "done"
 */

const BASE_URL = 'http://localhost/routine-tracker/tasks';

/** Convert API status string → UI display label */
const apiStatusToUI = (apiStatus) => {
  switch (apiStatus) {
    case 'in_progress': return 'In Progress';
    case 'done':        return 'Done';
    case 'pending':
    default:            return 'Pending';
  }
};

/** Convert UI display label → API status string */
const uiStatusToApi = (uiStatus) => {
  switch (uiStatus) {
    case 'In Progress': return 'in_progress';
    case 'Done':        return 'done';
    case 'Pending':
    default:            return 'pending';
  }
};

/** Normalise a raw task object from the API into the shape the UI expects */
const normaliseTask = (raw) => ({
  id:          String(raw.id),
  title:       raw.title       || '',
  description: raw.description || '',
  status:      apiStatusToUI(raw.status),
  date:        raw.date        || '',
  time:        raw.time        || '',
  priority:    raw.priority    || 'Medium',
  favourite:   !!raw.favourite,
  progress:    parseInt(raw.progress) || 0,
  createdAt:   raw.created_at  || '',
});

export const taskApi = {

  /** GET /get_tasks.php  →  returns normalised task array */
  getTasks: async (status = null) => {
    let url = `${BASE_URL}/get_tasks.php`;
    if (status && status !== 'All') {
      url += `?status=${encodeURIComponent(uiStatusToApi(status))}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch tasks (${res.status})`);
    const data = await res.json();
    // API may return { tasks: [...] } or a plain array
    const raw = Array.isArray(data) ? data : (data.tasks ?? []);
    return raw.map(normaliseTask);
  },

  /** POST /create_task.php */
  addTask: async (task) => {
    const body = {
      title:       task.title,
      description: task.description || '',
      status:      uiStatusToApi(task.status),
      date:        task.date        || null,
      time:        task.time        || null,
      priority:    task.priority    || 'Normal',
      favourite:   task.favourite   ? 1 : 0,
      progress:    task.progress    || 0,
    };
    const res = await fetch(`${BASE_URL}/create_task.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Failed to create task (${res.status})`);
    return res.json();
  },

  /** POST /update_task.php */
  updateTask: async (task) => {
    const body = {
      id:          task.id,
      title:       task.title,
      description: task.description || '',
      status:      uiStatusToApi(task.status),
      date:        task.date        || null,
      time:        task.time        || null,
      priority:    task.priority    || 'Normal',
      favourite:   task.favourite   ? 1 : 0,
      progress:    task.progress    || 0,
    };
    const res = await fetch(`${BASE_URL}/update_task.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Failed to update task (${res.status})`);
    return res.json();
  },

  /** POST /delete_task.php */
  deleteTask: async (id) => {
    const res = await fetch(`${BASE_URL}/delete_task.php`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error(`Failed to delete task (${res.status})`);
    return true;
  },

  /** GET /stats.php  →  { total, completed, pending, in_progress } */
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats.php`);
    if (!res.ok) throw new Error(`Failed to fetch stats (${res.status})`);
    return res.json();
  },

  /** GET /weekly_stats.php  →  [{ day, total }] */
  getWeeklyStats: async () => {
    const res = await fetch(`${BASE_URL}/weekly_stats.php`);
    if (!res.ok) throw new Error(`Failed to fetch weekly stats (${res.status})`);
    return res.json();
  },

  /** Notes API */
  getNote: async () => {
    const res = await fetch(`${BASE_URL}/get_note.php`);
    if (!res.ok) throw new Error(`Failed to fetch note`);
    return res.json();
  },
  saveNote: async (content) => {
    const res = await fetch(`${BASE_URL}/save_note.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    return res.json();
  },
  deleteNote: async () => {
    const res = await fetch(`${BASE_URL}/delete_note.php`, { method: 'POST' });
    return res.json();
  }
};
