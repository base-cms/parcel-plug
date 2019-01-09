const ApplyInterfaceDirective = require('./apply-interface');
const CreateDirective = require('./create');
const DeleteDirective = require('./delete');
const MatchManyDirective = require('./match-many');
const RequiresAuthDirective = require('./requires-auth');
const RetrieveDirective = require('./retrieve');
const RetrieveManyDirective = require('./retrieve-many');
const SetAndUpdateDirective = require('./set-and-update');
const UpdateDirective = require('./update');

module.exports = {
  applyInterfaceFields: ApplyInterfaceDirective,
  create: CreateDirective,
  delete: DeleteDirective,
  matchMany: MatchManyDirective,
  requiresAuth: RequiresAuthDirective,
  retrieve: RetrieveDirective,
  retrieveMany: RetrieveManyDirective,
  setAndUpdate: SetAndUpdateDirective,
  update: UpdateDirective,
};
