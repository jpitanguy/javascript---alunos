//imports
import express from "express";
import { ListarTodos, salvarTodos } from "./manipulador/arquivo_manipulador.js";

const app = express();
const PORT = 3000;

app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("bem-vindo a API de controle de sala");
});


app.get("/alunos", async (req, res) => {
    try {
        const cadastros = await ListarTodos();
        return res.status(200).json(cadastros);
    } catch (error) {
        console.log("Erro ao listar alunos", error);
        return res.status(500).json({ error: "não foi possivel ler os cadastros" });
    }
});


app.get("/alunos/:id", async (req, res) => {
    try {
        
        const id = Number(req.params.id);
        const dados = await ListarTodos();

        
        const alunoEncontrado = dados.find((aluno) => aluno.id === id);

        if (!alunoEncontrado) {
            return res.status(404).json({ erro: "Aluno não encontrado" });
        }

        return res.status(200).json(alunoEncontrado);
    } catch (error) {
        console.log("erro ao buscar aluno", error);
        return res.status(500).json({ error: "não foi possivel buscar o aluno" });
    }
});


app.delete("/alunos/:id", async (req, res) => {
    try {
        
        const id = Number(req.params.id);
        
        
        const dados = await ListarTodos();
        
        
        const dadosAtualizados = dados.filter((aluno) => aluno.id !== id);
        
       
        if (dadosAtualizados.length === dados.length) {
            return res.status(404).json({ erro: "aluno não deletado" });
        }
        
        await salvarTodos(dadosAtualizados);
        return res.status(200).json({ mensagem: "registro excluído com sucesso" });
    } catch (error) {
        console.log("erro ao deletar cadastro", error);
        return res.status(500).json({ error: "não foi possivel deletar cadastro" });
    }
});


app.post("/alunos", async (req, res) => {
    try {
      
        const { id, matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo } = req.body;
        
       
        if (!id || !matricula || !nome || !turma || !data || presente === undefined || !motivoSaida || minutosFora === undefined || alertaTempo === undefined) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        
        const novoCadastro = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: Boolean(alertaTempo)
        };
        
        const cadastros = await ListarTodos();
        cadastros.push(novoCadastro);
        
        await salvarTodos(cadastros);
        return res.status(201).json({ mensagem: "cadastro realizado com sucesso" });
    } catch (error) {
        console.log("erro ao salvar cadastro", error);
        return res.status(500).json({ error: "Não foi possivel salvar o cadastro" });
    }
});


app.put("/alunos/:id", async (req, res) => {
    try {
      
        const id = Number(req.params.id);
        
      
        const dados = await ListarTodos();
        
      
        const alunoExistente = dados.find((aluno) => aluno.id === id);
        
       
        if (!alunoExistente) {
            return res.status(404).json({ erro: "Aluno não encontrado" });
        }
        
    
        const { matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo } = req.body;
        
       
        if (!matricula || !nome || !turma || !data || presente === undefined || !motivoSaida || minutosFora === undefined || alertaTempo === undefined) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        
        const alunoAtualizado = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: Boolean(alertaTempo)
        };
        
      
        const dadosAtualizados = dados.map((aluno) => 
            aluno.id === id ? alunoAtualizado : aluno
        );
        
       
        await salvarTodos(dadosAtualizados);
        
        
        return res.status(200).json({ mensagem: "Aluno atualizado com sucesso" });
        
    } catch (error) {
        console.log("erro ao alterar cadastro", error);
        return res.status(500).json({ error: "Não foi possivel alterar e salvar o cadastro" });
    }
});


app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});


app.listen(PORT, () => {
    console.log("Está rodando na porta:", PORT);
});