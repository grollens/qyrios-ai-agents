/**
 * Todoist API Wrapper
 * 
 * Provides helper functions for interacting with Todoist REST API v2
 * Documentation: https://developer.todoist.com/rest/v2/
 */

const https = require('https');

class TodoistAPI {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'api.todoist.com';
  }

  /**
   * Make a Todoist API request
   */
  async request(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseURL,
        path: endpoint,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        const postData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = responseData ? JSON.parse(responseData) : {};
              resolve(parsed);
            } catch (e) {
              resolve(responseData);
            }
          } else {
            reject(new Error(`Todoist API Error: ${res.statusCode} - ${responseData}`));
          }
        });
      });

      req.on('error', reject);

      if (data && (method === 'POST' || method === 'PUT')) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  /**
   * Get all projects
   */
  async getProjects() {
    return this.request('GET', '/rest/v2/projects');
  }

  /**
   * Create a project
   */
  async createProject(name, parentId = null, color = null, isFavorite = false) {
    const data = { name };
    if (parentId) data.parent_id = parentId;
    if (color) data.color = color;
    if (isFavorite) data.is_favorite = isFavorite;
    
    return this.request('POST', '/rest/v2/projects', data);
  }

  /**
   * Get all labels
   */
  async getLabels() {
    return this.request('GET', '/rest/v2/labels');
  }

  /**
   * Create a label
   */
  async createLabel(name, color = null, order = null) {
    const data = { name };
    if (color) data.color = color;
    if (order) data.order = order;
    
    return this.request('POST', '/rest/v2/labels', data);
  }

  /**
   * Get all tasks
   */
  async getTasks(projectId = null, labelId = null, filter = null) {
    let endpoint = '/rest/v2/tasks';
    const params = [];
    
    if (projectId) params.push(`project_id=${projectId}`);
    if (labelId) params.push(`label_id=${labelId}`);
    if (filter) params.push(`filter=${encodeURIComponent(filter)}`);
    
    if (params.length > 0) {
      endpoint += '?' + params.join('&');
    }
    
    return this.request('GET', endpoint);
  }

  /**
   * Create a task
   */
  async createTask(data) {
    // data should contain: content, description, project_id, section_id, 
    // parent_id, order, labels, priority, due_string, due_date, due_datetime, 
    // due_lang, assignee_id, duration, duration_unit
    return this.request('POST', '/rest/v2/tasks', data);
  }

  /**
   * Update a task
   */
  async updateTask(taskId, data) {
    return this.request('POST', `/rest/v2/tasks/${taskId}`, data);
  }

  /**
   * Close a task (complete)
   */
  async closeTask(taskId) {
    return this.request('POST', `/rest/v2/tasks/${taskId}/close`);
  }

  /**
   * Reopen a task
   */
  async reopenTask(taskId) {
    return this.request('POST', `/rest/v2/tasks/${taskId}/reopen`);
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId) {
    return this.request('DELETE', `/rest/v2/tasks/${taskId}`);
  }
}

module.exports = TodoistAPI;


