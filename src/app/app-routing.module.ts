import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { CrearnoticiaComponent } from './components/noticias/crearnoticia/crearnoticia/crearnoticia.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { HomeComponent } from './components/home/home.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: UserprofileComponent,
  },
  {
    path: 'categorias',
    component: CategoriasComponent,
  },
  {
    path: 'comentarios',
    component: ComentariosComponent,
  },
  {
    path: 'noticias',
    component: NoticiasComponent,
  },
  {
    path: 'crearnoticia',
    component: CrearnoticiaComponent,
  },
  {
    path: 'notificaciones',
    component: NotificacionesComponent,
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
  },
  {
    path: 'not-found',
    component: NotfoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
