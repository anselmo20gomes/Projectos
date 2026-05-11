const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados SQLite
const dbPath = path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Banco de dados conectado com sucesso!');
    initializeDatabase();
  }
});

// Criar tabela de tarefas se não existir
function initializeDatabase() {
  db.run(
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      createdAt TEXT NOT NULL,
      UNIQUE(id)
    )`,
    (err) => {
      if (err) {
        console.error('Erro ao criar tabela:', err);
      } else {
        console.log('Tabela de tarefas pronta!');
      }
    }
  );
}

// ============== ENDPOINTS ==============

// GET /api/tasks - Listar todas as tarefas
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar tarefas', details: err.message });
      return;
    }
    // Converter para formato compatível com o frontend
    const tasks = rows.map(row => ({
      id: row.id,
      text: row.text,
      completed: row.completed === 1,
      createdAt: row.createdAt
    }));
    res.json(tasks);
  });
});

// POST /api/tasks - Criar nova tarefa
app.post('/api/tasks', (req, res) => {
  const { text } = req.body;

  // Validação
  if (!text || text.trim() === '') {
    res.status(400).json({ error: 'Texto da tarefa é obrigatório' });
    return;
  }

  const createdAt = new Date().toISOString();

  db.run(
    'INSERT INTO tasks (text, completed, createdAt) VALUES (?, ?, ?)',
    [text.trim(), 0, createdAt],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Erro ao criar tarefa', details: err.message });
        return;
      }
      
      res.status(201).json({
        id: this.lastID,
        text: text.trim(),
        completed: false,
        createdAt
      });
    }
  );
});

// PUT /api/tasks/:id - Atualizar tarefa (marcar como concluída ou editar)
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  // Validação
  if (!id) {
    res.status(400).json({ error: 'ID da tarefa é obrigatório' });
    return;
  }

  // Se apenas atualizar status
  if (text === undefined) {
    db.run(
      'UPDATE tasks SET completed = ? WHERE id = ?',
      [completed ? 1 : 0, id],
      function(err) {
        if (err) {
          res.status(500).json({ error: 'Erro ao atualizar tarefa', details: err.message });
          return;
        }
        
        if (this.changes === 0) {
          res.status(404).json({ error: 'Tarefa não encontrada' });
          return;
        }

        res.json({ message: 'Tarefa atualizada com sucesso', id, completed });
      }
    );
    return;
  }

  // Se editar o texto
  if (text.trim() === '') {
    res.status(400).json({ error: 'Texto da tarefa não pode estar vazio' });
    return;
  }

  db.run(
    'UPDATE tasks SET text = ?, completed = ? WHERE id = ?',
    [text.trim(), completed ? 1 : 0, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Erro ao atualizar tarefa', details: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Tarefa não encontrada' });
        return;
      }

      res.json({ 
        message: 'Tarefa atualizada com sucesso',
        id,
        text: text.trim(),
        completed: completed ? 1 : 0
      });
    }
  );
});

// DELETE /api/tasks/:id - Deletar tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID da tarefa é obrigatório' });
    return;
  }

  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Erro ao deletar tarefa', details: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Tarefa não encontrada' });
      return;
    }

    res.json({ message: 'Tarefa deletada com sucesso', id });
  });
});

// GET /api/stats - Estatísticas das tarefas
app.get('/api/stats', (req, res) => {
  db.all('SELECT completed FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
      return;
    }

    const total = rows.length;
    const completed = rows.filter(row => row.completed === 1).length;
    const pending = total - completed;

    res.json({ total, completed, pending });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API está funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 API de tarefas disponível em http://localhost:${PORT}/api/tasks`);
});

// Fechar banco de dados ao encerrar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err);
    } else {
      console.log('Banco de dados fechado');
    }
    process.exit(0);
  });
});
