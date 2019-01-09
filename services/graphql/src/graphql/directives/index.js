const ApplyInterfaceDirective = require('./apply-interface');
const CreateDirective = require('./create');
const DeleteDirective = require('./delete');
const RequiresAuthDirective = require('./requires-auth');
const RetrieveDirective = require('./retrieve');
const SetAndUpdateDirective = require('./set-and-update');
const UpdateDirective = require('./update');

module.exports = {
  applyInterfaceFields: ApplyInterfaceDirective,
  create: CreateDirective,
  delete: DeleteDirective,
  requiresAuth: RequiresAuthDirective,
  retrieve: RetrieveDirective,
  setAndUpdate: SetAndUpdateDirective,
  update: UpdateDirective,
};
