import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Books extends BaseSchema {
  protected tableName = 'books'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 200).notNullable()
      table.integer('author').unsigned().notNullable()
      table.string('editorial').notNullable()
      table.integer('no_pag').unsigned().notNullable()
      table.integer('user_id').references('id').inTable('users')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

