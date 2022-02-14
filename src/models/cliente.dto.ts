import { EnderecoDTO } from './endereco.dto';

export interface ClienteDTO {
  id: number;
  nome: string;
  email: string;
  imageUrl?: string;
  cpfOuCnpj: string;
  enderecos: EnderecoDTO[];
}
