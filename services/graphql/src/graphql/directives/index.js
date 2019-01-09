const ApplyInterfaceDirective = require('./apply-interface');
const RequiresAuthDirective = require('./requires-auth');
const SetAndUpdateDirective = require('./set-and-update');

module.exports = {
  applyInterfaceFields: ApplyInterfaceDirective,
  requiresAuth: RequiresAuthDirective,
  setAndUpdate: SetAndUpdateDirective,
};
