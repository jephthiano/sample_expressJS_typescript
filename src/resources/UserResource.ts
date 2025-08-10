import type { UserDocument, UserResourceInterface } from "#src/types/user/interface.js";


class UserResource {
  user: UserDocument;

  constructor(user: UserDocument) {
    this.user = user;
  }

  toJSON(): UserResourceInterface {
    return {
      id: this.user._id,
      unique_id: this.user.unique_id,
      email: this.user.email,
      mobile_number: this.user.mobile_number,
      username: this.user.username,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      role: this.user.role,
      user_level: this.user.user_level,
      gender: this.user.gender,
      dob: this.user.dob,
      address: this.user.address,
      status: this.user.status,
      email_verified_at: this.user.email_verified_at,
      mobile_number_verified_at: this.user.mobile_number_verified_at,
      created_at: this.user.created_at,
    };
  }

  static collection(users: UserDocument[]): ReturnType<UserResource['toJSON']>[] {
    return users.map(user => new UserResource(user).toJSON());
  }
}

export default UserResource;
