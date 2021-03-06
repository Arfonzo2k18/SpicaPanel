import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Global } from "src/app/services/global/global";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CategoriasService } from "../../services/categorias/categorias.service";
import { Usuario } from "src/app/models/usuario";
import { AuthService } from "src/app/services/auth.service";

declare var $;

@Component({
  selector: "app-categorias",
  templateUrl: "./categorias.component.html",
  styleUrls: ["./categorias.component.scss"]
})
export class CategoriasComponent implements OnInit {
  autor: Usuario;
  categorias: any[];
  fichero: File = null;
  ficheroEdit: File = null;

  selectedCategory: any;

  showSuccessMessage = false;
  showSuccessMessageCreate = false;
  serverErrorMessages: string;

  CreateCategoryForm = new FormGroup({
    nombre: new FormControl("", Validators.required)
  });

  EditCategoryForm = new FormGroup({
    nombre: new FormControl("", Validators.required)
  });

  filterCategory = "";

  constructor(
    private authservice: AuthService,
    private global: Global,
    private toastr: ToastrService,
    private categoriasservice: CategoriasService
  ) {}

  ngOnInit() {
    this.cargarCategorias();
    this.cargarAutor();
  }

  cambiarOrden() {
    this.categorias.reverse();
  }

  cargarAutor() {
    this.autor = this.authservice.extraertoken();
  }

  onFileSelectedEdit(event) {
    this.ficheroEdit = <File>event.target.files[0];
    this.EditCategoryForm.get("image").setValue(
      this.ficheroEdit,
      this.ficheroEdit.name
    );
  }

  onFileSelectedCreate(event) {
    this.fichero = <File>event.target.files[0];
    this.CreateCategoryForm.get("image").setValue(
      this.fichero,
      this.fichero.name
    );
  }

  cargarCategorias() {
    this.categoriasservice.getCategories().subscribe(
      res => {
        this.categorias = res as any[];
      },
      error => {
        console.log(error);
      }
    );
  }

  eliminarCategoria(categoria) {
    this.categoriasservice.deleteCategory(categoria.id).subscribe(
      res => {
        this.toastr.success("Categoría eliminada correctamente.");
        this.categorias.splice(this.categorias.indexOf(categoria), 1);
      },
      error => {
        this.toastr.error("Ha ocurrido un error.");
      }
    );
  }

  onEdit() {
    if (this.ficheroEdit != null) {
      this.showSuccessMessage = false;
      this.categoriasservice
        .editCategory(
          this.selectedCategory.id,
          this.EditCategoryForm.value,
          this.ficheroEdit
        )
        .subscribe(
          res => {
            this.serverErrorMessages = "";
            this.ficheroEdit = null;
            this.limpiarFormularios();
            this.cargarCategorias();
            this.toastr.success("¡Categoría editada correctamente!");
          },
          error => {
            this.toastr.error("Ha ocurrido un error.");
          }
        );
    } else {
      this.showSuccessMessage = false;
      this.categoriasservice
        .editCategory(
          this.selectedCategory.id,
          this.EditCategoryForm.value,
          null
        )
        .subscribe(
          res => {
            this.serverErrorMessages = "";
            this.ficheroEdit = null;
            this.limpiarFormularios();
            this.cargarCategorias();
            this.toastr.success("¡Categoría editada correctamente!");
          },
          error => {
            this.toastr.error("Ha ocurrido un error.");
          }
        );
    }
  }

  editarCategoria(categoria) {
    this.selectedCategory = categoria;
    this.EditCategoryForm.get("nombre").setValue(categoria.nombre);
  }

  onCreate() {
    if (this.fichero != null) {
      this.showSuccessMessage = false;
      this.categoriasservice
        .createCategory(
          this.autor.id,
          this.CreateCategoryForm.value,
          this.fichero
        )
        .subscribe(
          res => {
            this.serverErrorMessages = "";
            this.showSuccessMessageCreate = true;
            this.fichero = null;
            this.limpiarFormularios();
            this.cargarCategorias();
            this.toastr.success("¡Categoría creada correctamente!");
          },
          err => {
            this.toastr.error("Ha ocurrido un error.");
          }
        );
    } else {
      this.serverErrorMessages = "Introduce una imagen, por favor.";
    }
  }

  limpiarFormularios() {
    this.CreateCategoryForm.value["nombre"] = "";
    this.EditCategoryForm.value["nombre"] = "";
    this.CreateCategoryForm.reset();
    this.EditCategoryForm.reset();
    this.showSuccessMessageCreate = false;
  }
}
