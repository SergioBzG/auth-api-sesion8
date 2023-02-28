import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public name: string
  @column() public email: string
  @column({ serializeAs: null }) public password: string
  @column() public apellidos: string
  @column() public perfil_id: number
  @column() public tipo_id: string
  @column() public no_id: number
  @column() public direccion: string
  @column() public barrio: string
  @column() public municipio: string
  @column() public departamento: string
  @column() public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
