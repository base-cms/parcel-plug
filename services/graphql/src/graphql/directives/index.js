const ApplyInterfaceDirective = require('./apply-interface');
const RequiresAuthDirective = require('./requires-auth');

module.exports = {
  applyInterfaceFields: ApplyInterfaceDirective,
  requiresAuth: RequiresAuthDirective,
};
