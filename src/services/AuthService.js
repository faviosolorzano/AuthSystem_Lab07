import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

class AuthService {

  async signUp({
    email,
    password,
    name,
    lastName,
    phoneNumber,
    birthdate,
    url_profile = '',
    adress = '',
    roles = ['user']
  }) {

    const existing = await userRepository.findByEmail(email);

    if (existing) {
      const err = new Error('El email ya se encuentra en uso');
      err.status = 400;
      throw err;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/;

    if (!passwordRegex.test(password)) {
      const err = new Error(
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un dígito y un carácter especial (# $ % & * @)'
      );

      err.status = 400;
      throw err;
    }

    if (
      !name ||
      !lastName ||
      !phoneNumber ||
      !birthdate
    ) {
      const err = new Error(
        'Todos los campos obligatorios deben completarse'
      );

      err.status = 400;
      throw err;
    }

    const saltRounds = parseInt(
      process.env.BCRYPT_SALT_ROUNDS ?? '10',
      10
    );

    const hashed = await bcrypt.hash(
      password,
      saltRounds
    );

    const roleDocs = [];

    for (const roleName of roles) {
      let roleDoc =
        await roleRepository.findByName(roleName);

      if (!roleDoc) {
        roleDoc = await roleRepository.create({
          name: roleName
        });
      }

      roleDocs.push(roleDoc._id);
    }

    const user = await userRepository.create({
      email,
      password: hashed,
      name,
      lastName,
      phoneNumber,
      birthdate,
      url_profile,
      adress,
      roles: roleDocs
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      url_profile: user.url_profile,
      adress: user.adress
    };
  }

  async signIn({ email, password }) {

    const user =
      await userRepository.findByEmail(email);

    if (!user) {
      const err =
        new Error('Credenciales inválidas');

      err.status = 401;

      throw err;
    }

    const ok =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!ok) {
      const err =
        new Error('Credenciales inválidas');

      err.status = 401;

      throw err;
    }

    const token = jwt.sign(
      {
        sub: user._id,
        roles: user.roles.map(
          role => role.name
        )
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || '1h'
      }
    );

    return {
      token,
      roles: user.roles.map(
        role => role.name
      )
    };
  }
}

export default new AuthService();