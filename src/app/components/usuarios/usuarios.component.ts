import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var M: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  orden: any;
  usuario: any;
  usuarios: any[];
  fichero: File = null;
  ficheroCrear: File = null;

  showSuccessMessage = false;
  showSuccessMessageCreate = false;
  serverErrorMessages: string;
  // tslint:disable-next-line:max-line-length
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  UserForm = new FormGroup({
    nick: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    image: new FormControl(),
  });

  CreateUserForm = new FormGroup({
    nick: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    rol: new FormControl('', Validators.required),
    image: new FormControl(),
  });

  constructor(private usuariosservice: UsuariosService, private authservice: AuthService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }


  onFileSelected(event) {
    this.fichero = <File>event.target.files[0];
    this.UserForm.get('image').setValue(this.fichero, this.fichero.name);
  }

  onFileSelectedCreate(event) {
    this.ficheroCrear = <File>event.target.files[0];
    this.CreateUserForm.get('image').setValue(this.ficheroCrear, this.ficheroCrear.name);
  }

  cargarUsuarios() {
    this.usuariosservice.getUsers().subscribe(
      res => {
        this.usuarios = res as any[];
      },
      error => {
        console.log(error);
      }
    );
  }

  limpiarFormulario() {
    this.UserForm.reset();
    this.serverErrorMessages = '';
    this.showSuccessMessage = false;
  }

  eliminarUsuario(user, i) {
    this.usuarios.splice(i, 1);
    this.usuariosservice.deleteUser(user.id).subscribe(
      res => {
        console.log(res);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
        this.cargarUsuarios();
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    if (this.fichero != null) {
      this.showSuccessMessage = false;
      this.usuariosservice.editUser(this.usuario.id, this.UserForm.value, this.fichero).subscribe(
        res => {
          this.serverErrorMessages = '';
          this.showSuccessMessage = true;
          this.UserForm.reset();
          this.cargarUsuarios();
          M.toast({ html: 'Updated successfully', classes: 'rounded' });
        },
        err => {
          console.log(err);
          this.serverErrorMessages = err.error.errors[0].mesage;
        }
      );
    } else {
      this.usuariosservice.editUser(this.usuario.id, this.UserForm.value, null).subscribe(
        res => {
          this.serverErrorMessages = '';
          this.showSuccessMessage = true;
          this.UserForm.reset();
          this.cargarUsuarios();
          M.toast({ html: 'Updated successfully', classes: 'rounded' });
        },
        err => {
          console.log(err);
          this.serverErrorMessages = err.error.errors[0].mesage;
        }
      );
    }
  }

  onCreate() {
    if (this.ficheroCrear != null) {
      this.showSuccessMessage = false;
      this.usuariosservice.createUser(this.CreateUserForm.value, this.ficheroCrear).subscribe(
        res => {
          this.serverErrorMessages = '';
          this.showSuccessMessageCreate = true;
          this.CreateUserForm.reset();
          this.cargarUsuarios();
          M.toast({ html: 'Created successfully', classes: 'rounded' });
        },
        err => {
          console.log(err);
          this.serverErrorMessages = err.error.errors[0].mesage;
        }
      );
    } else {
      this.serverErrorMessages = 'Introduce una imagen, por favor.';
    }
  }

  editarUsuario(user) {
    this.usuario = user;
    this.UserForm.value['nick'] = user.nick;
    this.UserForm.value['email'] = user.nick;
    this.UserForm.value['password'] = user.nick;
    this.UserForm.value['nombre'] = user.nick;
  }

}
