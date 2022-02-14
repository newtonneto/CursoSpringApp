export interface PedidoDTO {
  cliente: { id: number };
  enderecoDeEntrega: { id: number };
  pagamento: Pagamento;
  itens: ItemPedido[];
}

export interface Pagamento {
  numeroDeParcelas: number | null;
  '@type': string;
}

export interface ItemPedido {
  quantidade: number;
  produto: { id: number };
}
