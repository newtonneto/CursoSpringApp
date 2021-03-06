import { ClienteDTO } from './cliente.dto';
import { EnderecoDTO } from './endereco.dto';
import { ProdutoDTO } from './produto.dto';

export interface CompraDTO {
  id: number;
  instante: string;
  pagamento: Pagamento;
  cliente: ClienteDTO;
  enderecoDeEntrega: EnderecoDTO;
  itens: ItemCompra[];
  valorTotal: number;
}

interface Pagamento {
  '@type': string;
  estado: string;
  dataVencimento: string;
  dataPagamento?: string;
}

export interface ItemCompra {
  desconto: number;
  quantidade: number;
  preco: number;
  subTotal: number;
  produto: ProdutoDTO;
}
