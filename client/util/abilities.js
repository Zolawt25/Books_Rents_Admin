import { AbilityBuilder, Ability } from "@casl/ability";

export function defineAbilitiesFor(role) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (role === "admin") {
    can("manage", "all");
  } else if (role === "owner") {
    can("upload", "Book");
    can("read", "Book");
    cannot("manage", "Owners");
  } else {
    can("read", "all");
  }

  return build();
}
