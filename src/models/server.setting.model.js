const mongoose = require('mongoose');

const SettingServerSchema = new mongoose.Schema(
  {
    maintain: {
      type: Number,
      default: 0,
    },
    whitelist: {
      type: Array,
      default: [],
    },
    whiteListIp: {
      type: Array,
      default: [],
    },
    feeWithdraw: {
      type: Number,
      default: 0.005,
    },
    feeTransfer: {
      type: Number,
      default: 0.005,
    },
  },
  {
    timestamps: true,
  }
);

const ServerSetting = mongoose.model('serverSetting', SettingServerSchema);

module.exports = ServerSetting;
