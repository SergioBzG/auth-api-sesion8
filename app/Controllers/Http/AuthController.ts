import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  //Registrar Usuario
  public async register({ request, auth, response }: HttpContextContract) {
    const dataUser = request.only([
      "name",
      "email",
      "password",
      "apellidos",
      "perfil_id",
      "tipo_id",
      "no_id",
      "direccion",
      "barrio",
      "municipio",
      "departamento",
    ]);

    try {
      const clienteExiste: number = await this.validarUsuarioExistente(
        dataUser.no_id
      );
      if (clienteExiste === 0) {
        const user = await User.create(dataUser);
        const token = await auth.use("api").login(user, {
          expiresIn: "10 mins",
        });

        response.status(200).json({
          token,
          msg: "Usuario registrado",
        });

      } else {
        response.status(400).json({ msg: "Ya existe un usuario con esta identificacion" });
      }
    } catch (error) {
      response.status(500).json({ msg: "Error en el servidor" });
    }
  }

  //Loguear usuario
  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "10 mins", // !CUIDADODO
      });
      return {
        token,
        msg: "Usuario logueado correctamente",
      };
    } catch (error) {
      response.status(400).unauthorized("Ivalid credentials");
    }
  }

  //Listar
  public async listarUsers(): Promise<User[]>{
    const users = await User.all()
    return users
  }

  //Validar usuario
  public async validarUsuarioExistente(no_id: number): Promise<number> {
    const total: User[] = await User.query()
      .where({ no_id: no_id })
      .from("users");
    return total.length;
  }
}
