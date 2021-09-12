import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contato } from '../contato';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { ContatosService } from '../contatos.service';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {
  contato: Contato;
  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto', 'id', 'nome', 'email', 'favorito'];
  totalElementos: number = 0;
  page: number = 0;
  size: number = 10;
  pageSizeOptions: number[] = [10];

  constructor(private service: ContatosService, private fb: FormBuilder, private dialog: MatDialog, private snackBar:MatSnackBar) {
    this.contato = new Contato();
    this.formulario = this.montarFormulario();
  }

  ngOnInit(): void {
    this.listar(this.page, this.size);
  }
  montarFormulario() {
    return this.fb.group({
      nome: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])]
    })
  }

  onSubmit() {
    const formulariov = this.formulario.value
    this.contato.email = formulariov.email
    this.contato.nome = formulariov.nome
    this.service.salvar(this.contato)
      .subscribe(
        contato => {
         this.listar(this.page, this.size)
         this.snackBar.open('Contato Adicionado', 'Sucesso', {
           duration: 2000
         })
         this.formulario.reset();
        }
      )
  }

  uploadPhoto(event: any, contato: Contato) {
    if (event.target) {
      const files = event.target.files;
      if (files) {
        const foto = files[0];
        const formData = new FormData;
        formData.append("photo", foto)
        this.service.upload(contato, formData)
          .subscribe(
            response => this.listar(this.page, this.size),
            error => {
              console.log(error)
            }
          )
      }
    }
  }

  listar(page: number, size: number) {
    this.service.getall(page, size)
      .subscribe(
        response => {
          if (response.content != null && response.totalElements != null && response.number != null) {
            this.contatos = response.content
            this.totalElementos = response.totalElements
            this.page = response.number
          }
        }
      )
  }

  favoritar(contato: Contato) {
    let favorite: boolean;
    if (contato.favorito) {
      favorite = false;
    } else {
      favorite = true;
    }
    this.service.favoriteConsume(contato, favorite)
      .subscribe(
        Response => { contato.favorito = !contato.favorito }
      )
  }

  visualizarContato(contato: Contato) {
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    })
  }

  paginar(event: PageEvent) {
    this.page = event.pageIndex;
    this.listar(this.page, this.size)
  }
}
