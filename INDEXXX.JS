 const taskInput = document.getElementById('taskInput');
        const tasksList = document.getElementById('tasksList');
        const totalTasksEl = document.getElementById('totalTasks');
        const completedTasksEl = document.getElementById('completedTasks');
        const pendingTasksEl = document.getElementById('pendingTasks');

        const STORAGE_KEY = 'tasks_crud';

        // Carregar tarefas do localStorage
        function loadTasks() {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        }

        // Salvar tarefas no localStorage
        function saveTasks(tasks) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }

        // Adicionar nova tarefa
        function addTask() {
            const taskText = taskInput.value.trim();

            if (taskText === '') {
                alert('Por favor, escreva uma tarefa!');
                taskInput.focus();
                return;
            }

            const tasks = loadTasks();
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };

            tasks.push(newTask);
            saveTasks(tasks);
            taskInput.value = '';
            taskInput.focus();
            renderTasks();
        }

        // Atualizar tarefa (marcar como concluída)
        function toggleTask(id) {
            const tasks = loadTasks();
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                saveTasks(tasks);
                renderTasks();
            }
        }

        // Editar tarefa
        function editTask(id) {
            const tasks = loadTasks();
            const task = tasks.find(t => t.id === id);
            if (!task) return;

            const newText = prompt('Editar tarefa:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasks(tasks);
                renderTasks();
            }
        }

        // Eliminar tarefa
        function deleteTask(id) {
            if (confirm('Tem certeza que deseja eliminar esta tarefa?')) {
                let tasks = loadTasks();
                tasks = tasks.filter(t => t.id !== id);
                saveTasks(tasks);
                renderTasks();
            }
        }

        // Atualizar estatísticas
        function updateStats() {
            const tasks = loadTasks();
            const completed = tasks.filter(t => t.completed).length;
            const pending = tasks.length - completed;

            totalTasksEl.textContent = tasks.length;
            completedTasksEl.textContent = completed;
            pendingTasksEl.textContent = pending;
        }

        // Renderizar lista de tarefas
        function renderTasks() {
            const tasks = loadTasks();
            updateStats();

            if (tasks.length === 0) {
                tasksList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">✨</div>
                        <p>Nenhuma tarefa ainda</p>
                        <p style="font-size: 13px; margin-top: 8px;">Crie sua primeira tarefa acima</p>
                    </div>
                `;
                return;
            }

            tasksList.innerHTML = tasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="checkbox"
                        ${task.completed ? 'checked' : ''}
                        onchange="toggleTask(${task.id})"
                    >
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <div class="task-actions">
                        <button class="btn btn-success" onclick="editTask(${task.id})">
                            Editar
                        </button>
                        <button class="btn btn-danger" onclick="deleteTask(${task.id})">
                            Eliminar
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Escape HTML para segurança
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        // Event listener para Enter
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Carregar tarefas ao iniciar
        renderTasks();