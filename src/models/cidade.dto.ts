import { EstadoDTO } from './estado.dto';

export interface CidadeDTO {
  id: number;
  nome: string;
  estado?: EstadoDTO;
}
