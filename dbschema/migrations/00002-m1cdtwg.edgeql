CREATE MIGRATION m1cdtwg46mscp2j2cfh7wfknqwtxxtl5w7ughvwnwbfl37nv57pgta
    ONTO m1lrgrjjbq5hhzjltw2yshtlakr3xzrnu6qymzdu7jafks67dnneba
{
  DROP TYPE discord::Author;
  ALTER TYPE discord::User EXTENDING default::Author LAST;
};
