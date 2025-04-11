// URL base da API
const API_URL = 'http://localhost:3000/pedidos';

// Função para buscar pedido pelo ID
async function buscarPedidoPorId(id) {
  try {
    // Faz a requisição GET para a API
    const response = await fetch(`${API_URL}/${id}`);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Pedido não encontrado.');
      }
      throw new Error('Erro ao buscar pedido.');
    }

    // Converte a resposta para JSON
    const pedido = await response.json();

    // Exibe os detalhes do pedido
    exibirDetalhesPedido(pedido);
  } catch (error) {
    console.error(error);
    document.getElementById('detalhesPedido').innerText = `❌ ${error.message}`;
  }
}

// Função para exibir os detalhes do pedido
function exibirDetalhesPedido(pedido) {
  const detalhesDiv = document.getElementById('detalhesPedido');
  console.log("Itens do pedido:", pedido.itens);

  detalhesDiv.innerHTML = `
    <p><strong>ID do Pedido:</strong> ${pedido.id}</p>
    <p><strong>Restaurante:</strong> ${pedido.restauranteId}</p>
    <p><strong>Itens:</strong> ${pedido.itens}</p>
    <p><strong>Status:</strong> ${pedido.status}</p>
  `;
}

// Adiciona evento ao botão de buscar pedido
document.getElementById('buscarPedido').addEventListener('click', () => {
  const pedidoId = document.getElementById('pedidoId').value.trim();
  if (!pedidoId) {
    document.getElementById('detalhesPedido').innerText = '❌ Por favor, insira um ID válido.';
    return;
  }
  buscarPedidoPorId(pedidoId);
});