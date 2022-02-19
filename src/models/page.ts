import { CompraDTO } from './compra.dto';
import { ProdutoDTO } from './produto.dto';

export interface PageProduto {
  content: ProdutoDTO[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  numberOfElements: number;
  empty: boolean;
}

export interface PageCompra {
  content: CompraDTO[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  numberOfElements: number;
  empty: boolean;
}
