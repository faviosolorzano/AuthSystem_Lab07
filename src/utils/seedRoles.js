import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {

  const existing =
    await userRepository.findByEmail(
      'admin@talenti.com'
    );

  if (existing) {
    return;
  }

  const adminRole =
    await roleRepository.findByName('admin');

  const hashedPassword =
    await bcrypt.hash(
      'Admin123@',
      parseInt(
        process.env.BCRYPT_SALT_ROUNDS ?? '10',
        10
      )
    );

  await userRepository.create({
    email: 'admin@talenti.com',
    password: hashedPassword,
    name: 'Administrador',
    lastName: 'Sistema',
    phoneNumber: '999999999',
    birthdate: new Date('2000-01-01'),
    url_profile: '',
    adress: 'Lima, Peru',
    roles: [adminRole._id]
  });

  console.log(
    'Usuario administrador creado'
  );
}