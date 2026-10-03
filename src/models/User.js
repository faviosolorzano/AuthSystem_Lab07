import mongoose from 'mongoose';

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return (
          passwordRegex.test(value) ||
          /^\$2[aby]\$\d{2}\$/.test(value)
        );
      },
      message:
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un dígito y un carácter especial (# $ % & * @)'
    }
  },

  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],

  name: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },

  birthdate: {
    type: Date,
    required: true
  },

  url_profile: {
    type: String,
    trim: true,
    default: ''
  },

  adress: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);