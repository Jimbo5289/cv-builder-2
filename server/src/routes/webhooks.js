/* eslint-disable */
/**
 * This file serves as a forwarding module for webhook.js
 * It's needed because some parts of the app import webhooks.js while others use webhook.js
 */

// Alias file for webhook.js
const webhook = require('./webhook');
module.exports = webhook; 