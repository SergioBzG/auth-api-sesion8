import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 180).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('apellidos').notNullable()
      table.integer('perfil_id').references('id').inTable('perfils').notNullable()
      table.string('tipo_id').notNullable()
      table.integer('no_id').notNullable()
      table.string('direccion').notNullable()
      table.string('barrio')
      table.string('municipio').notNullable()
      table.string('departamento').notNullable
      table.string('remember_me_token').nullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

