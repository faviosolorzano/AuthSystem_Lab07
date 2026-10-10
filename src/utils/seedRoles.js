import roleRepository from '../repositories/RoleRepository.js';

const DEFAULT_ROLES = ['user', 'admin'];

export default async function seedRoles() {

  for (const name of DEFAULT_ROLES) {

    const existing =
      await roleRepository.findByName(name);

    if (!existing) {
      await roleRepository.create({ name });

      console.log(
        `Rol creado: ${name}`
      );
    }
  }
}
