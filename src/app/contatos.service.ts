import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contato } from './contato';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginaContato } from './contato/paginaContato';

@Injectable({
  providedIn: 'root'
})
export class ContatosService {

  apiUrl:String = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  salvar(contato: Contato):Observable<Contato>{
    return this.httpClient.post<Contato>(`${this.apiUrl}/salvar`, contato);
  }

  getall(page:number, size:number):Observable<PaginaContato>{
    let params = new HttpParams()
                          .set('page', page)
                          .set('size', size)
                          .set('sort', 'nome,asc')
    return this.httpClient.get<PaginaContato>(`${this.apiUrl}/page?${params.toString()}`);
  }

  favoriteConsume(contato: Contato, favorito: boolean):Observable<Contato>{
    return this.httpClient.patch<Contato>(`${this.apiUrl}/${contato.id}`, favorito);
  }

  upload(contato:Contato, formData: FormData):Observable<any>{
    return this.httpClient.put(`${this.apiUrl}/${contato.id}`,formData, {responseType: 'blob'});
  }
}
