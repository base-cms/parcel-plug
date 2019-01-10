const ApplyInterfaceDirective = require('./apply-interface');
const CreateDirective = require('./create');
const DeleteDirective = require('./delete');
const MatchManyDirective = require('./match-many');
const RefManyDirective = require('./ref-many');
const RefOneDirective = require('./ref-one');
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
  refMany: RefManyDirective,
  refOne: RefOneDirective,
  requiresAuth: RequiresAuthDirective,
  retrieve: RetrieveDirective,
  retrieveMany: RetrieveManyDirective,
  setAndUpdate: SetAndUpdateDirective,
  update: UpdateDirective,
};
