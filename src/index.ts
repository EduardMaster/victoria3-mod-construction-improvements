import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url'; // <--- Importe fileURLToPath
import 'dotenv/config'; // <--- Carrega as variáveis de ambiente do .env

// Obtenha o caminho do diretório atual de forma compatível com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'resources'); // Pasta 'data'

// Carrega a variável de ambiente GAME_DOCS_FOLDER
const gameDocsFolder = process.env.GAME_DOCS_FOLDER;

// --- Validação da variável de ambiente ---
if (!gameDocsFolder) {
  console.error('Erro: A variável de ambiente GAME_DOCS_FOLDER não está definida no arquivo .env ou nas variáveis de ambiente do sistema.');
  console.error('Por favor, crie um arquivo .env na raiz do projeto com, por exemplo: GAME_DOCS_FOLDER=');
  process.exit(1); // Encerra o script com erro
}

const modsSubDir = path.join(gameDocsFolder, 'mod');            // <--- Nova pasta 'mod' dentro de 'target'
const modDir = path.join(modsSubDir, 'ConstructionImprovements');            // <--- Nova pasta 'mod' dentro de 'target'

async function createFolderIfNotExist(targetDir : any) {
 // 1. Verifica e cria a pasta de destino se não existir
    try {
      await fs.access(targetDir); // Tenta acessar para ver se existe
    } catch (error: any) {
      console.log(`Pasta '${targetDir}' não existe ainda.`);
      if (error.code === 'ENOENT') { // 'ENOENT' significa "Entry Not Found" (não encontrado)
        await fs.mkdir(targetDir);
        console.log(`Pasta '${targetDir}' criada.`);
      }
    }
}
async function moveModFiles() {
  try {
    await createFolderIfNotExist(modsSubDir);
    await createFolderIfNotExist(modDir);

    const files = await fs.readdir(sourceDir);
    if (files.length === 0) {
      console.log(`A pasta '${sourceDir}' está vazia. Nenhum arquivo para mover.`);
      return;
    }
    console.log(`Encontrados ${files.length} arquivos na pasta '${sourceDir}'.`);
    // 3. Move cada arquivo
    await fs.cp(sourceDir, modDir, { recursive: true });
    
  } catch (error) {
    console.error('Ocorreu um erro durante a operação de mover arquivos:', error);
  }
}

async function moveFolderFIlesTo(sourceDir : any, targetDir: any)  {
  const files = await fs.readdir(sourceDir);
  if (files.length === 0) {
    console.log(`A pasta '${sourceDir}' está vazia. Nenhum arquivo para mover.`);
    return;
  }
  for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      try {
        //await fs.rename(sourcePath, targetPath);
        await fs.copyFile(sourcePath, targetPath);
        console.log(`Arquivo '${file}' movido para '${targetDir}'`);
        
      } catch (innerError) {
        console.error(`Erro ao copiar o arquivo '${file}':`, innerError);
      }
    }
}
// Chama a função assíncrona
moveModFiles();