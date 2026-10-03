import userRepository from '../repositories/UserRepository.js';

class UserService {

  calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const monthDifference =
      today.getMonth() -
      birth.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < birth.getDate()
      )
    ) {
      age--;
    }

    return age;
  }

  formatUser(user) {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      age: this.calculateAge(user.birthdate),
      url_profile: user.url_profile,
      adress: user.adress,
      roles: user.roles.map(role => role.name),
      createdAt: user.createdAt
    };
  }

  async getAll() {
    const users =
      await userRepository.getAll();

    return users.map(user =>
      this.formatUser(user)
    );
  }

  async getById(id) {
    const user =
      await userRepository.findById(id);

    if (!user) {
      const err =
        new Error('Usuario no encontrado');

      err.status = 404;

      throw err;
    }

    return this.formatUser(user);
  }

  async update(id, data) {

    const allowedData = {
      name: data.name,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      birthdate: data.birthdate,
      url_profile: data.url_profile,
      adress: data.adress
    };

    const user =
      await userRepository.update(
        id,
        allowedData
      );

    if (!user) {
      const err =
        new Error('Usuario no encontrado');

      err.status = 404;

      throw err;
    }

    return this.formatUser(user);
  }
}

export default new UserService();