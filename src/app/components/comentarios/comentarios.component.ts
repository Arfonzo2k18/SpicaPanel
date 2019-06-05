import { Component, OnInit } from '@angular/core';
import { ComentariosService } from 'src/app/services/comentarios/comentarios.service';
import { NoticiasService } from 'src/app/services/noticias/noticias.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {

  configuracion: any;

  comentarios: any[];
  noticias: any[];
  filterComment = '';
  autor: Usuario;
  comentarioSelected: any;

  CreateCommentForm = new FormGroup({
    cuerpo: new FormControl('', Validators.required),
    noticia_id: new FormControl('', Validators.required),
    autor_id: new FormControl(''),
  });

  // tslint:disable-next-line:max-line-length
  constructor(private authservice: AuthService, private comentariosservice: ComentariosService, private noticiasservice: NoticiasService, private toastr: ToastrService) { }

  ngOnInit() {
    this.cargarComentarios();
    this.cargarAutor();
  }

  cargarComentarios() {
    this.comentariosservice.getComments().subscribe(
      res => {
        this.comentarios = res as any[];
      },
      error => {
        console.log(error);
      }
    );
  }

  cambiarOrden() {
    this.comentarios.reverse();
  }

  cargarAutor() {
    this.autor = this.authservice.extraertoken();
  }

  seleccionarComentario(comentario) {
    this.comentarioSelected = comentario;
  }

  cargarNoticias() {
    this.noticiasservice.getNews().subscribe(
      res => {
        this.noticias = res as any[];
      },
      error => {
        console.log(error);
      }
    );
  }

  eliminarComentario(comentario) {
    this.comentariosservice.deleteComment(comentario.id).subscribe(
      res => {
        this.comentarios.splice(this.comentarios.indexOf(comentario), 1);
        this.toastr.success('Comentario eliminado correctamente');
      },
      error => {
        this.toastr.error('Ha ocurrido un error');
      }
    );
  }

  onCreate() {
    this.comentariosservice.createComment(this.autor.id, this.CreateCommentForm.value).subscribe(
      res => {
        this.cargarComentarios();
        this.toastr.success(res.toString());
        this.limpiarFormulario();
      },
      error => {
        this.toastr.error('Ha ocurrido un error.');
      }
    );
  }

  limpiarFormulario() {
    this.CreateCommentForm.value['cuerpo'] = '';
    this.CreateCommentForm.value['noticia_id'] = '';
    this.CreateCommentForm.reset();
  }

}
