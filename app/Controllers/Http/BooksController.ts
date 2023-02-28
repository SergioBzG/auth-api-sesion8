import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Book from "App/Models/Book";
import Perfil from "App/Models/Perfil";

export default class BooksController {
  //Registrar Libro (debe ser Admin para guardar un libro)
  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user;
    try {
      if (user) {
        const isAdmin: boolean = await this.isAdmin(user.perfil_id); //Se verifica que sea administrador
        if (isAdmin) {
          const book = new Book();
          book.title = request.input("title");
          book.author = request.input("author");
          book.editorial = request.input("editorial");
          book.no_pag = request.input("no_pag");
          book.user_id = request.input("user_id");
          await book.save();
          response.status(200).json({
            msg: "Libro registrado correctamente",
            book,
          });
        } else {
          response
            .status(401)
            .json({ msg: "No cuenta con permisos para registrar libros" });
        }
      }
    } catch (error) {
      console.log(error)
      response.status(500).json({ msg: "Error en el servidor" });
    }

  }

  //Listar todos los Libros
  public async index(): Promise<Book[]> {
    const books = await Book.query();
    return books;
  }

  //Filtar libro por id
  public async show({ params }: HttpContextContract) {
    try {
      const book = await Book.find(params.id);
      if (book) {
        return book;
      } else {
        return "Registro no existente";
      }
    } catch (err) {
      console.log(err);
    }
  }

  //Actualizar Libro (debe ser Editor o Admin para actualizar un libro)
  public async update({ request, response, auth, params }: HttpContextContract) {
    const user = auth.user;
    try {
      if (user) {
        const isEditor: boolean = await this.isEditor(user.perfil_id); //Se verifica que sea editor
        const isAdmin: boolean = await this.isAdmin(user.perfil_id); //Se verifica que sea admin

        if (isEditor || isAdmin) {
          const book = await Book.find(params.id);

          if (book) {
            book.title = request.input("title");
            book.author = request.input("author");
            book.editorial = request.input("editorial");
            book.no_pag = request.input("no_pag");
            book.user_id = request.input("user_id");

            if (await book.save()) {
              response.status(200).json({
                msg: "Libro actualizado correctamente",
                book,
              });
            } else{
              response.status(401).json({
                msg: "No se pudo actualizar el libro",
                book,
              });
            }

          } else{
            response.status(401).json({
              msg: "No existe libro con ese id"
            });
          }

        } else {
          response
            .status(400)
            .json({ msg: "No cuenta con permisos para actaulizar libros" });
        }
      }
    } catch (error) {
      response.status(500).json({ msg: "Error en el servidor" });
    }
    
  }

  //Borrar Libro (debe ser Admin para borrar un libro)
  public async borrarLibro({request, response, auth}: HttpContextContract){
    const user = auth.user;
    try {
      if (user) {
        const isAdmin: boolean = await this.isAdmin(user.perfil_id); //Se verifica que sea administrador
        if (isAdmin) {
          const id = request.param('id');
          await Book.query().where({'id': id}).delete()
          response.status(200).json({msg: `Libro con id: ${id} eliminado`})
        } else {
          response
            .status(401)
            .json({ msg: "No cuenta con permisos para eliminar libros" });
        }
      }
    } catch (error) {
      response.status(500).json({ msg: "Error en el servidor" });
    }
  }

  //Verifica si el perfil es Admin
  private async isAdmin(perfil_id: number): Promise<boolean> {
    const perfil: Perfil[] = await Perfil.query()
      .where({ id: perfil_id })
      .from("perfils");
    return perfil[0].descripcion === "Admin";
  }

  //Verifica si el perfil es Editor
  private async isEditor(perfil_id: number): Promise<boolean> {
    const perfil: Perfil[] = await Perfil.query()
      .where({ id: perfil_id })
      .from("perfils");
    return perfil[0].descripcion === "Editor";
  }
  
}
