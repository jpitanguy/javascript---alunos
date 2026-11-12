//imports
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

//não importa onde sera chamdo sempre vai conseguir encontrar o arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoDados = path.join(__dirname, "..", "BD", "registro_alunos.json");

//logicas
//Listar todos - le o arquivo local
export async function ListarTodos() {
    const conteudo = await fs.readFile(caminhoDados, "utf-8");
    return JSON.parse(conteudo);
}

//escrever salvar
//salvartodos - escrever em um arquivo local
export async function salvarTodos(cadastros) {
    await fs.writeFile(
        caminhoDados, JSON.stringify(cadastros, null, 2),
        "utf-8"
    );
}

//funcoes auxiliares