document.getElementById('formulario_cadastro').addEventListener('submit', async function (e) {
  e.preventDefault();

  const statusDiv = document.getElementById('status');

  // Captura os valores dos campos do formulário
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const categoria = document.getElementById('categoria').value.trim();

  // Validação simples para garantir que os campos não estejam vazios
  if (!nome || !endereco || !categoria) {
    exibirMensagem(statusDiv, "❌ Todos os campos são obrigatórios.", "red");
    return;
  }

  try {
    // Envia os dados para a API
    const response = await fetch('http://localhost:3000/cadastro_restaurantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, endereco, categoria }),
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erro || 'Erro desconhecido ao cadastrar restaurante.');
    }

    const data = await response.json();

    // Exibe mensagem de sucesso
    exibirMensagem(statusDiv, "✅ Restaurante cadastrado com sucesso!", "green");

    // Limpa o formulário
    document.getElementById('formulario_cadastro').reset();
  } catch (err) {
    console.error(err);

    // Exibe mensagem de erro
    exibirMensagem(statusDiv, `❌ Erro ao cadastrar restaurante: ${err.message}`, "red");
  }
});

// Função para exibir mensagens de status
function exibirMensagem(elemento, mensagem, cor) {
  elemento.innerText = mensagem;
  elemento.style.color = cor;
  elemento.style.display = "block";

  // Oculta a mensagem após 5 segundos
  setTimeout(() => {
    elemento.style.display = "none";
  }, 5000);
}
