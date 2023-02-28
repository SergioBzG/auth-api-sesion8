import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Perfil from 'App/Models/Perfil';
import Perfils from 'Database/migrations/1677561531953_perfils';

export default class PerfilsController {
    public async registerPerfil({request, response, auth}: HttpContextContract){
        const user = auth.user;
        try{
            if(user){
                const isAdmin: boolean = await this.isAdmin(user.perfil_id)//Se verifica que sea administrador
                if(isAdmin){
                    const descripcion = request.input('descripcion');
                    const perfil = new Perfil();
                    perfil.descripcion = descripcion;
                    perfil.save();
                    response.status(200).json({
                        msg: 'Perfil registrado correctamente',
                        perfil,
                    })
                }else {
                    response.status(400).json({msg: 'No cuenta con permisos para registrar perfiles'})
                }
            }
        } catch(error){   
            console.log(error)
            response.status(500).json({msg: 'Error en el servidor'})
        }
    }

    //Listar perfiles
    public async listarPerfiles(): Promise<Perfil[]>{
        const perfiles = await Perfil.all()
        return perfiles
    }
    
    //Verifica si su perfil es Admin
    private async isAdmin(perfil_id: number): Promise<boolean>{
        const perfil: Perfil[] = await Perfil.query().where({'id': perfil_id}).from('perfils')
        return perfil[0].descripcion === 'Admin'
    }
}
