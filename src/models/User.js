/**
 * Classe modelo para representar um usuário
 * Garante compatibilidade com o objeto User do backend
 */
class User {
  constructor(id, name, email, token) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.token = token;
  }

  /**
   * Cria um objeto User a partir da resposta do backend
   * @param {Object} data - Dados da resposta do backend
   * @returns {User} Objeto User
   */
  static fromBackendResponse(data) {
    return new User(
      data.id,
      data.name,
      data.email,
      data.token
    );
  }
}

export default User; 