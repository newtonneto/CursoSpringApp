import { ProdutoDTO } from './produto.dto';

export interface Page {
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
