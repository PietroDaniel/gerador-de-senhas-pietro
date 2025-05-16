/**
 * Classe modelo para representar um item de senha
 * Garante compatibilidade com o objeto PasswordItem do backend
 */
class PasswordItem {
  constructor(id, name, password) {
    this.id = id;
    this.name = name;
    this.password = password;
  }

  /**
   * Cria um objeto PasswordItem a partir da resposta do backend
   * @param {Object} data - Dados da resposta do backend
   * @returns {PasswordItem} Objeto PasswordItem
   */
  static fromBackendResponse(data) {
    return new PasswordItem(
      data.id,
      data.name,
      data.password
    );
  }

  /**
   * Converte uma lista de objetos do backend para objetos PasswordItem
   * @param {Array} items - Lista de itens retornados pelo backend
   * @returns {Array} Lista de objetos PasswordItem
   */
  static fromBackendList(items) {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    
    return items.map(item => PasswordItem.fromBackendResponse(item));
  }
}

export default PasswordItem; 